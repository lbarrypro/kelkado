import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { AuthProviderInterface } from './AuthProviderInterface';
import logger from '@/src/utils/logger';  // Import de ton logger personnalisé

export class SupabaseAuthProvider implements AuthProviderInterface {
    private supabase: SupabaseClient;

    constructor() {
        // Récupère les valeurs depuis app.config.ts
        const supabaseUrl = Constants.expoConfig?.extra?.authProviderUrl;
        const supabaseKey = Constants.expoConfig?.extra?.authProviderKey;

        // Vérifie que les valeurs sont définies
        if (!supabaseUrl || !supabaseKey) {
            logger.error('Supabase URL or Key is missing from configuration');
            throw new Error('Supabase URL or Key is missing from configuration');
        }

        // Initialise le client Supabase
        this.supabase = createClient(supabaseUrl, supabaseKey);
        logger.info('Supabase client initialized');
    }

    // Inscription de l'utilisateur
    async signUp(email: string, password: string) {
        logger.debug(`Attempting to sign up user with email: ${email}`);
        return await this.supabase.auth.signUp({ email, password });
    }

    // Connexion de l'utilisateur
    async signIn(email: string, password: string) {
        logger.debug(`Attempting to sign in user with email: ${email}`);
        return await this.supabase.auth.signInWithPassword({ email, password });
    }

    // Déconnexion de l'utilisateur
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                logger.error('Error signing out user:', error);
                throw error;
            }
            logger.info('User signed out successfully');
        } catch (error) {
            logger.error('Error during sign out:', error);
        }
    }

    // Récupérer l'utilisateur actuel
    async getCurrentUser() {
        logger.debug('Fetching current user');
        return await this.supabase.auth.getUser();
    }

    // Récupérer les métadonnées utilisateur (ici spécifique à Supabase)
    verifiedUser(user: any) {
        const isVerified = user?.user_metadata?.email_verified;
        logger.debug(`User email verified: ${isVerified}`);
        return isVerified;
    }

    // Gérer la session de l'utilisateur avec un token
    // Méthode pour configurer la session utilisateur avec access_token et refresh_token
    async setSession(token: string, refresh_token: string = '') {
        try {
            const { error } = await this.supabase.auth.setSession({ access_token: token, refresh_token });
            if (error) {
                logger.error('Error setting session:', error);
                throw error;
            }
            logger.info('Session set successfully');
        } catch (error) {
            logger.error('Error setting session:', error);
        }
    }

    // Récupérer la session actuelle de l'utilisateur
    async getSession() {
        logger.debug('Fetching current session');
        return await this.supabase.auth.getSession();
    }

    async resendConfirmationEmail(email: string): Promise<void> {
        try {
            const { error } = await this.supabase.auth.resend({
                type: 'signup',
                email,
            });

            if (error) {
                logger.error('Error resending confirmation email:', error);
                throw new Error(error.message); // Lancer une exception en cas d'erreur
            }
            logger.info(`Confirmation email resent to ${email}`);
        } catch (error) {
            logger.error('Error during resendConfirmationEmail:', error);
        }
    }

    // Écouter les changements d'état d'authentification
    onAuthStateChange(callback: (event: string, session: any) => void) {
        logger.debug('Setting up authentication state listener');
        const { data: listener } = this.supabase.auth.onAuthStateChange(callback);

        return {
            unsubscribe: () => {
                if (listener?.unsubscribe) {
                    logger.debug('Unsubscribing from auth state changes');
                    listener.unsubscribe();
                }
            }
        };
    }
}
