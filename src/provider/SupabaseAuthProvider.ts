import { supabase } from "@/src/utils/supabaseClient";
import { AuthProviderInterface } from './AuthProviderInterface';

export class SupabaseAuthProvider implements AuthProviderInterface {

    // Inscription de l'utilisateur
    async signUp(email: string, password: string) {
        return await supabase.auth.signUp({ email, password });
    }

    // Connexion de l'utilisateur
    async signIn(email: string, password: string) {
        return await supabase.auth.signInWithPassword({ email, password });
    }

    // Déconnexion de l'utilisateur
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    // Récupérer l'utilisateur actuel
    async getCurrentUser() {
        return await supabase.auth.getUser();
    }

    // Gérer la session de l'utilisateur avec un token
    // Méthode pour configurer la session utilisateur avec access_token et refresh_token
    async setSession(token: string, refresh_token: string = '') {
        try {
            const { error } = await supabase.auth.setSession({ access_token: token, refresh_token });
            if (error) throw error;
        } catch (error) {
            console.error('Error setting session:', error);
        }
    }

    // Récupérer la session actuelle de l'utilisateur
    async getSession() {
       return await supabase.auth.getSession();
    }

    // Écouter les changements d'état d'authentification
    onAuthStateChange(callback: (event: string, session: any) => void) {
        const { data: listener } = supabase.auth.onAuthStateChange(callback);

        return {
            unsubscribe: () => {
                if (listener?.unsubscribe) {
                    listener.unsubscribe();
                }
            }
        };
    }
}
