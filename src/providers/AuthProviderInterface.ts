export interface AuthProviderInterface {
    // Fonction d'inscription
    signUp(email: string, password: string): Promise<any>;

    // Fonction de connexion
    signIn(email: string, password: string): Promise<any>;

    // Fonction de déconnexion
    signOut(): Promise<void>;

    // Récupérer l'utilisateur actuel
    getCurrentUser(): Promise<any>;

    // Gérer les sessions (avec un token)
    setSession(token: string, refresh_token?:string): Promise<void>;

    // Récupérer les informations de la session active
    getSession(): Promise<any>;

    // Fonction pour écouter les changements d'état d'authentification
    onAuthStateChange(callback: (event: string, session: any) => void): { unsubscribe: () => void };

    // verifie si l'utilisateur est vérifié
    verifiedUser(user: any): any;

    resendConfirmationEmail(email: string): Promise<void>;
}
