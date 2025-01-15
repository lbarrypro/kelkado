import SupabaseSingleton, { SupabaseClient } from '@/src/utils/supabaseClient';
import { AuthProviderInterface } from './AuthProviderInterface';
import logger from '@/src/utils/logger';

export class SupabaseAuthProvider implements AuthProviderInterface {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = SupabaseSingleton.getInstance();
        logger.info('SupabaseAuthProvider :: constructor :: Supabase client retrieved from singleton');
    }

    // Inscription de l'utilisateur
    async signUp(email: string, password: string) {
        logger.debug(`SupabaseAuthProvider :: signUp :: email: ${email}`);
        return await this.supabase.auth.signUp({ email, password });
    }

    // Connexion de l'utilisateur
    async signIn(email: string, password: string) {
        logger.debug(`SupabaseAuthProvider :: signIn :: email: ${email}`);
        return await this.supabase.auth.signInWithPassword({ email, password });
    }

    // Déconnexion de l'utilisateur
    async signOut() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                throw error;
            }
            logger.info('SupabaseAuthProvider :: signOut :: success');
        } catch (error) {
            logger.error('SupabaseAuthProvider :: signOut :: Error:', error);
        }
    }

    // Récupérer l'utilisateur actuel
    async getCurrentUser() {
        logger.debug('SupabaseAuthProvider :: getCurrentUser');
        return await this.supabase.auth.getUser();
    }

    // Récupérer les métadonnées utilisateur (ici spécifique à Supabase)
    verifiedUser(user: any) {
        const isVerified = user?.user_metadata?.email_verified;
        logger.info(`SupabaseAuthProvider :: verifiedUser: ${isVerified}`);
        return isVerified;
    }

    // Gérer la session de l'utilisateur avec un token
    // Méthode pour configurer la session utilisateur avec access_token et refresh_token
    async setSession(access_token: string, refresh_token?: string): Promise<void> {
        try {
            const { error } = await this.supabase.auth.setSession({ access_token, refresh_token });
            if (error) {
                throw error;
            }
            logger.info('SupabaseAuthProvider :: setSession success');
        } catch (error) {
            logger.error('SupabaseAuthProvider :: setSession Error:', error);
        }
    }

    // Récupérer la session actuelle de l'utilisateur
    async getSession() {
        logger.debug('SupabaseAuthProvider :: getSession');
        return await this.supabase.auth.getSession();
    }

    async resendConfirmationEmail(email: string): Promise<void> {
        try {
            const { error } = await this.supabase.auth.resend({
                type: 'signup',
                email,
            });

            if (error) {
                throw new Error(error.message); // Lancer une exception en cas d'erreur
            }
            logger.info(`SupabaseAuthProvider :: resendConfirmationEmail :: resent to ${email}`);
        } catch (error) {
            logger.error('SupabaseAuthProvider :: resendConfirmationEmail :: Error:', error);
        }
    }

    // Typage explicite de `onAuthStateChange`
    onAuthStateChange(callback: (event: string, session: any) => void): { unsubscribe: () => void } {
        logger.debug('SupabaseAuthProvider :: onAuthStateChange :: Setting up authentication state listener');

        const listener = this.supabase.auth.onAuthStateChange(callback);

        logger.info('SupabaseAuthProvider :: onAuthStateChange :: Listener object returned:', listener);

        return {
            unsubscribe: listener?.data?.unsubscribe, // Désabonnement
        };
    }
}
