import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { AuthProviderInterface } from './AuthProviderInterface';

export class SupabaseAuthProvider implements AuthProviderInterface {
    private supabase: SupabaseClient;

    constructor() {
        // Récupère les valeurs depuis app.config.ts
        const supabaseUrl = Constants.expoConfig?.extra?.authProviderUrl;
        const supabaseKey = Constants.expoConfig?.extra?.authProviderKey;

        // Vérifie que les valeurs sont définies
        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase URL or Key is missing from configuration');
        }

        // Initialise le client Supabase
        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    // Inscription de l'utilisateur
    async signUp(email: string, password: string) {
        return await this.supabase.auth.signUp({ email, password });
    }

    // Connexion de l'utilisateur
    async signIn(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({ email, password });
    }

    // Déconnexion de l'utilisateur
    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
    }

    // Récupérer l'utilisateur actuel
    async getCurrentUser() {
        return await this.supabase.auth.getUser();
    }

    // Récupérer les métadonnées utilisateur (ici spécifique à Supabase)
    verifiedUser(user: any) {
        return user?.user_metadata?.email_verified;
    }

    // Gérer la session de l'utilisateur avec un token
    // Méthode pour configurer la session utilisateur avec access_token et refresh_token
    async setSession(token: string, refresh_token: string = '') {
        try {
            const { error } = await this.supabase.auth.setSession({ access_token: token, refresh_token });
            if (error) throw error;
        } catch (error) {
            console.error('Error setting session:', error);
        }
    }

    // Récupérer la session actuelle de l'utilisateur
    async getSession() {
       return await this.supabase.auth.getSession();
    }

    async resendConfirmationEmail(email: string): Promise<void> {
        const { error } = await this.supabase.auth.resend({
            type: 'signup',
            email,
        });

        if (error) {
            throw new Error(error.message); // Lancer une exception en cas d'erreur
        }
    }

    // Écouter les changements d'état d'authentification
    onAuthStateChange(callback: (event: string, session: any) => void) {
        const { data: listener } = this.supabase.auth.onAuthStateChange(callback);

        return {
            unsubscribe: () => {
                if (listener?.unsubscribe) {
                    listener.unsubscribe();
                }
            }
        };
    }
}
