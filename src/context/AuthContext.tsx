import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthProviderInterface } from '@/src/providers/AuthProviderInterface'; // L'interface définie
import { SupabaseAuthProvider } from '@/src/providers/SupabaseAuthProvider'; // Implémentation de Supabase
import logger from '@/src/utils/logger';

// Définir l'interface pour l'utilisateur
interface User {
    id: string;
    name: string;
    email: string;
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
        logger.debug('AuthProvider :: Initialisation du fournisseur d\'authentification');
        const provider = new SupabaseAuthProvider();
        setAuthProvider(provider);
        logger.debug('AuthProvider :: Fournisseur d\'authentification initialisé');
    }, []); // Ce useEffect s'exécute une seule fois lors du premier rendu

    // Fonction de connexion (signIn)
    const signIn = async (email: string, password: string) => {
        try {
            if (!authProvider) {
                throw new Error('AuthProvider :: signIn :: Auth provider not available');
            }

            logger.debug('AuthProvider :: signIn :: Tentative de connexion avec:', { email });

            return await authProvider.signIn(email, password);
            /*
            const { data, error } = await authProvider.signIn(email, password);

            if (error) {
                return { data: null, error }; // Retourne l'erreur
            }

            if (!data?.user) {
                return { data: null, error: new Error('Utilisateur non trouvé') };
            }

            const verifiedUser = authProvider.verifiedUser(data.user);
            if (!verifiedUser) {
                return { data: null, error: new Error('Email non vérifié') };
            }

            setUser(data.user);
            setIsVerified(verifiedUser);

            await authProvider.setSession(data.session?.access_token, data.session?.refresh_token);

            logger.info('AuthProvider :: signIn :: Utilisateur connecté');
            return { data, error: null }; // Retourne les données en cas de succès
            */
        } catch (error: any) {
            logger.error('AuthProvider :: signIn :: Erreur pendant la connexion:', error);
            return { data: null, error }; // Retourne l'erreur capturée
        }
    };

    // Fonction d'inscription (signUp)
    const signUp = async (email: string, password: string) => {
        try {
            if (!authProvider) {
                throw new Error('AuthProvider :: signUp :: Auth provider not available');
            }

            logger.debug('AuthProvider :: signUp :: Tentative d\'inscription avec:', { email });

            return await authProvider.signUp(email, password);

            /*
            const { data, error } = await authProvider.signUp(email, password);

            if (data?.user) {
                setUser(data.user);
                setIsVerified(authProvider.verifiedUser(data.user));

                logger.info('AuthProvider :: signUp :: Session configurée');
            }

            if (data?.session?.access_token && data?.session?.refresh_token) {
                // Sauvegarder la session après la création de l'utilisateur
                await authProvider.setSession(data.session?.access_token, data.session?.refresh_token);
            }

            return { data, error };
             */
        } catch (error) {
            logger.error('AuthProvider :: signUp :: Error during signUp:', error);
        }
    };

    // Fonction de déconnexion (signOut)
    const signOut = async () => {
        try {
            if (!authProvider) {
                throw new Error('AuthProvider :: signOut :: Auth provider not available');
            }

            logger.debug('AuthProvider :: signOut :: Déconnexion en cours...');
            await authProvider.signOut();
            setUser(null);
            setIsVerified(false);

            // Supprimer les données locales de session
            logger.debug('AuthProvider :: signOut :: Déconnexion effectuée, session supprimée');
        } catch (error) {
            logger.error('AuthProvider :: signOut :: Error during signOut:', error);
        }
    };

    // Remplacement dans le useEffect :
    useEffect(() => {
        if (!authProvider) {
            logger.error('AuthProvider :: useEffect :: authProvider non défini');
            setLoading(false); // On arrête le chargement même si authProvider est manquant
            return;
        }

        const fetchInitialSession = async () => {
            try {
                logger.debug('AuthProvider :: useEffect :: fetchInitialSession :: Début');

                const session = await authProvider.getSession(); // Appel au provider
                logger.debug('AuthProvider :: useEffect :: fetchInitialSession :: Session récupérée:', session);

                if (session?.user) {
                    setUser(session.user);
                    setIsVerified(authProvider.verifiedUser(session.user));
                    logger.debug('AuthProvider :: useEffect :: fetchInitialSession :: Utilisateur défini:', session.user);
                } else {
                    setUser(null);
                    setIsVerified(false);
                    logger.debug('AuthProvider :: useEffect :: fetchInitialSession :: Aucun utilisateur trouvé');
                }
            } catch (error) {
                logger.error('AuthProvider :: useEffect :: fetchInitialSession :: Error:', error);
            } finally {
                logger.debug('AuthProvider :: useEffect :: fetchInitialSession ::  Fin du chargement');
                setLoading(false); // Important pour signaler la fin de l'initialisation
            }
        };

        fetchInitialSession();

        const { data: listener } = authProvider.onAuthStateChange(async (event, session) => {
            logger.debug('Événement auth:', { event, session });

            switch (event) {
                case 'INITIAL_SESSION':
                    if (session?.user) {
                        setUser(session.user);
                        setIsVerified(authProvider.verifiedUser(session.user));
                        logger.debug('AuthProvider :: useEffect :: fetchInitialSession :: SIGNED_IN :: setIsVerified: ', authProvider.verifiedUser(session.user));
                    }
                    break;

                case 'SIGNED_IN':
                    if (session?.user) {
                        setUser(session.user);
                        setIsVerified(authProvider.verifiedUser(session.user));
                        logger.debug('AuthProvider :: useEffect :: fetchInitialSession :: SIGNED_IN :: setIsVerified: ', authProvider.verifiedUser(session.user));
                    }
                    break;

                case 'TOKEN_REFRESHED':
                    setUser(session?.user ?? null);
                    await authProvider.setSession(session?.access_token, session?.refresh_token);
                    break;

                case 'SIGNED_OUT':
                    setUser(null);
                    setIsVerified(false);
                    // await authProvider.setSession(null, null);
                    break;

                default:
                    logger.warn('Événement auth inconnu:', event);
            }
        });

        return () => listener?.unsubscribe();
    }, [authProvider]);

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
        throw new Error('AuthProvider :: useAuth must be used within an AuthProvider');
    }
    return context;
};
