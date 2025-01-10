import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthProviderInterface } from '@/src/provider/AuthProviderInterface'; // L'interface définie
import { SupabaseAuthProvider } from '@/src/provider/SupabaseAuthProvider'; // Implémentation de Supabase
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
            setIsVerified(parsedUser.user_metadata?.email_verified ?? false);

            try {
                // Essayer de configurer Supabase avec le token seulement si il existe
                await authProvider.setSession(storedToken);
            } catch (error) {
                console.error("Error setting session:", error);
                // Gérer l'erreur ici, par exemple en déconnectant l'utilisateur ou en le redirigeant
            }

            setLoading(false);
            return;
        }

        const { data, error } = await authProvider.getCurrentUser();
        if (error) {
            console.error("Error getting current user:", error);
        }

        console.log('### AuthProvider :: fetchUser :: data: ', data);

        if (data?.user) {
            setUser(data.user);
            setIsVerified(data.user.user_metadata.email_verified);

            const session = await authProvider.getSession();
            if (session?.data?.session?.access_token) {
                await setItem('token', session?.data?.session?.access_token ?? '');
                await setItem('user', JSON.stringify(data.user));
            }
        } else {
            setUser(null);
            setIsVerified(false);
        }

        setLoading(false);
    };

    // Fonction de connexion
    const signIn = async (email, password) => {
        console.log('### AuthProvider :: signIn :: email:', email);
        console.log('### AuthProvider :: signIn :: password:', password);

        const { data, error } = await authProvider.signIn(email, password);
        if (error) throw error;

        setUser(data.user);
        setIsVerified(data.user.user_metadata.email_verified);

        // Enregistrer les informations nécessaires dans le storage
        if (data.session) {
            await setItem('authToken', data.session.access_token); // Exemple avec le token
            await setItem('user', JSON.stringify(data.user)); // Exemple avec l'utilisateur
        }

        // Récupérer l'utilisateur après connexion pour garantir que l'état est bien à jour
        fetchUser();
    };

    // Fonction d'inscription
    const signUp = async (email, password) => {
        const { data, error } = await authProvider.signUp(email, password);
        if (error) throw error;

        setUser(data.user);
        setIsVerified(data.user.user_metadata.email_verified);

        if (data.session) {
            await setItem('authToken', data.session.access_token); // Exemple avec le token
            await setItem('user', JSON.stringify(data.user)); // Exemple avec l'utilisateur
        }

        // Récupérer l'utilisateur après connexion pour garantir que l'état est bien à jour
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
                setIsVerified(session?.user?.user_metadata?.email_verified ?? false);
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
