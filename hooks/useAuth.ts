import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [isVerified, setIsVerified] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Erreur lors de la récupération de la session:', error.message);
                setUser(null);
                setIsVerified(null); // Pas de vérification possible
            } else {
                setUser(session?.user ?? null);
                setIsVerified(session?.user?.email_confirmed_at !== null); // Vérifiez l'email
            }
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                console.log('Session mise à jour:', session);
                setUser(session?.user ?? null);
                setIsVerified(session?.user?.email_confirmed_at !== null); // Vérifiez l'email
            }
        );

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    return { user, isVerified };
}
