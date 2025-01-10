import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthProviderInterface } from '@/src/providers/AuthProviderInterface'; // L'interface définie
import { SupabaseAuthProvider } from '@/src/providers/SupabaseAuthProvider'; // Implémentation de Supabase
import { setItem, getItem, removeItem } from '../storage';

// Crée un contexte pour l'authentification
export const AuthContext = createContext<AuthProviderInterface | undefined>(undefined);

// Le composant AuthProvider fournit l'état global de l'utilisateur
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    // Ici on instancie notre fournisseur d'authentification (ici Supabase)
    const authProvider: AuthProviderInterface = new SupabaseAuthProvider();

    // Fonction pour obtenir l'utilisateur actuel de Supabase
    const fetchUser = async () => {
        console.log('### AuthProvider :: fetchUser');

        const storedUser = await getItem('user');
        const storedToken = await getItem('token');

        console.log('### AuthProvider :: storedUser: ', storedUser);

        if (storedUser && storedToken) {
            const parsedUser = JSON.parse(storedUser); // Parse les données JSON
            setUser(parsedUser);
            setIsVerified(authProvider.verifiedUser(parsedUser));  // Utiliser la méthode générique

            // Configure Supabase avec le token
            await authProvider.setSession(storedToken);  // Appel à setSession pour configurer la session
            setLoading(false);
            return;
        }

        const { data } = await authProvider.getCurrentUser();
        console.log('### AuthProvider :: fetchUser :: data: ', data);

        if (data?.user) {
            setUser(data.user);
            setIsVerified(authProvider.verifiedUser(data.user));  // Utiliser la méthode générique

            const session = await authProvider.getSession();
            if (session?.data?.session?.access_token) {
                await setItem('token', session?.data?.session?.access_token ?? '');
                await setItem('user', JSON.stringify(data.user));

                // Configure la session avec le token
                await authProvider.setSession(session.data.session.access_token, session.data.session?.refresh_token);
            }
        } else {
            setUser(null);
            setIsVerified(false);
        }

        setLoading(false);
    };

    // Fonction de connexion
    const signIn = async (email, password) => {
        const { data, error } = await authProvider.signIn(email, password);
        if (error) throw error;

        setUser(data.user);
        setIsVerified(authProvider.verifiedUser(data.user));  // Utiliser la méthode générique

        if (data.session) {
            await setItem('authToken', data.session.access_token);
            await setItem('user', JSON.stringify(data.user));

            // Configure la session avec le token
            await authProvider.setSession(data.session.access_token, data.session?.refresh_token);
        }

        fetchUser();
    };

    const signUp = async (email, password) => {
        const { data, error } = await authProvider.signUp(email, password);
        if (error) throw error;

        setUser(data.user);
        setIsVerified(authProvider.verifiedUser(data.user));  // Utiliser la méthode générique

        if (data.session) {
            await setItem('authToken', data.session.access_token);
            await setItem('user', JSON.stringify(data.user));

            // Configure la session avec le token
            await authProvider.setSession(data.session.access_token, data.session?.refresh_token);
        }

        fetchUser();
        return { data, error };
    };

    // Fonction de déconnexion
    const signOut = async () => {
        await authProvider.signOut();
        setUser(null);
        setIsVerified(false);
        await removeItem('authToken');
        await removeItem('user');
    };

    // Récupérer l'utilisateur actuel lors du montage du composant
    useEffect(() => {
        fetchUser();
        const { data: listener } = authProvider.onAuthStateChange(
            (_, session) => {
                console.log('### AuthProvider :: session: ', session);
                setUser(session?.user ?? null);
                setIsVerified(authProvider.verifiedUser(session?.user) ?? false);
            }
        );

        return () => {
            if (listener?.unsubscribe) {
                listener?.unsubscribe();
            }
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, isVerified, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook pour accéder au contexte d'authentification
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
