import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthProviderInterface } from '@/src/providers/AuthProviderInterface'; // L'interface définie
import { SupabaseAuthProvider } from '@/src/providers/SupabaseAuthProvider'; // Implémentation de Supabase
import { setItem, getItem, removeItem } from '../storage';
import logger from '@/src/utils/logger'; // Importer le logger

// Définir l'interface pour l'utilisateur
interface User {
    id: string;
    name: string;
    verified: boolean;
}

// Déclare l'interface du contexte
interface AuthContextType {
    authProvider: AuthProviderInterface; // Le type du provider
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
    user: User | null;
    isVerified: boolean;
    loading: boolean;
}

// Crée un contexte avec un type par défaut
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Implémentation du provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const [authProvider, setAuthProvider] = useState<AuthProviderInterface | null>(null);

    // Initialisation du fournisseur d'authentification dans un useEffect
    useEffect(() => {
        logger.debug('Initialisation du fournisseur d\'authentification');
        const provider = new SupabaseAuthProvider();
        setAuthProvider(provider);
        logger.debug('Fournisseur d\'authentification initialisé');
    }, []); // Ce useEffect s'exécute une seule fois lors du premier rendu

    // Fonction pour obtenir l'utilisateur actuel de Supabase
    const fetchUser = async () => {
        if (!authProvider) {
            logger.warn('Le fournisseur d\'authentification n\'est pas défini');
            return; // Vérifie si authProvider est défini
        }

        logger.debug('Tentative de récupération des informations utilisateur depuis le stockage');
        const storedUser = await getItem('user');
        const storedToken = await getItem('access_token');
        const storedRefreshToken = await getItem('refresh_token'); // Récupérer le refresh token

        if (storedUser && storedToken && storedRefreshToken) {
            const parsedUser = JSON.parse(storedUser); // Parse les données JSON
            setUser(parsedUser);
            setIsVerified(authProvider.verifiedUser(parsedUser));  // Utiliser la méthode générique

            // Vérifier si le token et le refresh token existent avant de définir la session
            if (storedToken && storedRefreshToken) {
                logger.debug('Token trouvé, configuration de la session');
                await authProvider.setSession(storedToken, storedRefreshToken);  // Appel à setSession avec access et refresh token
                setLoading(false);
                return;
            } else {
                setLoading(false);
                logger.error('Token d\'authentification ou refresh token manquant');
            }
        } else {
            // Si les données sont absentes, gérer l'absence de session
            logger.warn('Aucune session trouvée dans le stockage local');
            setUser(null);
            setIsVerified(false);
            setLoading(false);
        }
    };

    // Fonction de connexion
    const signIn = async (email: string, password: string) => {
        if (!authProvider) {
            logger.error('Auth provider not available');
            throw new Error('Auth provider not available');
        }

        logger.debug('Tentative de connexion avec:', { email });
        const { data, error } = await authProvider.signIn(email, password);
        if (error) {
            logger.error('Erreur lors de la connexion:', error);
            throw error;
        }

        setUser(data.user);
        setIsVerified(authProvider.verifiedUser(data.user));  // Utiliser la méthode générique

        if (data.session?.access_token && data.session?.refresh_token) {
            logger.debug('Tokens reçus, stockage des données utilisateur');
            await setItem('access_token', data.session.access_token);
            await setItem('refresh_token', data.session.refresh_token);
            await setItem('user', JSON.stringify(data.user));

            // Configure la session après l'obtention du token
            await authProvider.setSession(data.session.access_token, data.session?.refresh_token);
            fetchUser();
        }
    };

    const signUp = async (email: string, password: string) => {
        if (!authProvider) {
            logger.error('Auth provider not available');
            throw new Error('Auth provider not available');
        }

        logger.debug('Tentative d\'inscription avec:', { email });
        const { data, error } = await authProvider.signUp(email, password);
        if (error) {
            logger.error('Erreur lors de l\'inscription:', error);
            throw error;
        }

        setUser(data.user);
        setIsVerified(authProvider.verifiedUser(data.user));  // Utiliser la méthode générique

        if (data.session?.access_token && data.session?.refresh_token) {
            logger.debug('Tokens reçus, stockage des données utilisateur');
            await setItem('access_token', data.session.access_token);
            await setItem('refresh_token', data.session.refresh_token);
            await setItem('user', JSON.stringify(data.user));

            // Configure la session avec le token
            await authProvider.setSession(data.session.access_token, data.session?.refresh_token);
        }

        fetchUser();
        return { data, error };
    };

    // Fonction de déconnexion
    const signOut = async () => {
        if (!authProvider) {
            logger.error('Auth provider not available');
            throw new Error('Auth provider not available');
        }

        logger.debug('Déconnexion en cours...');
        await authProvider.signOut();
        setUser(null);
        setIsVerified(false);
        await removeItem('authToken');
        await removeItem('user');
        logger.debug('Déconnexion effectuée, session supprimée');
    };

    // Récupérer l'utilisateur actuel lors du montage du composant
    useEffect(() => {
        if (!authProvider) return; // Assure que authProvider est défini

        logger.debug('Montée du composant, récupération des informations utilisateur');
        fetchUser();
        const { data: listener } = authProvider.onAuthStateChange(
            (_, session) => {
                setUser(session?.user ?? null);
                setIsVerified(authProvider.verifiedUser(session?.user) ?? false);
                logger.debug('Changement d\'état de l\'authentification:', { user: session?.user, isVerified: session?.user ? authProvider.verifiedUser(session?.user) : false });
            }
        );

        return () => {
            if (listener?.unsubscribe) {
                logger.debug('Désinscription du listener');
                listener?.unsubscribe();
            }
        };
    }, [authProvider]); // Ajoute authProvider en dépendance

    return (
        <AuthContext.Provider value={{ authProvider: authProvider!, signIn, signUp, signOut, user, isVerified, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook pour accéder au contexte
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        logger.error('useAuth must be used within an AuthProvider');
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
