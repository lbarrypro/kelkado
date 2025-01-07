import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; // Importation de l'instance Supabase
import { User } from '@supabase/supabase-js'; // Type pour l'utilisateur Supabase

interface UseAuthReturn {
    user: User | null;
    isVerified: boolean;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);  // L'utilisateur actuel
    const [isVerified, setIsVerified] = useState<boolean>(false);  // Si l'utilisateur a vérifié son email

    useEffect(() => {
        // Vérifier si l'utilisateur est connecté dès le départ
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setIsVerified(user.email_confirmed_at !== null); // Vérifier si l'email est confirmé
            }
        };

        fetchUser();

        // Écouter les changements d'authentification
        const { data: subscription } = supabase.auth.onAuthStateChange(
            (_, session) => {
                setUser(session?.user || null);
                setIsVerified(session?.user?.email_confirmed_at !== null);
            }
        );

        // Nettoyer l'écouteur lorsqu'on quitte ce composant
        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return { user, isVerified };
}
