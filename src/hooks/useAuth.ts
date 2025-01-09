import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';

interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    isVerified: boolean;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [isVerified, setIsVerified] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                setIsVerified(user.email_confirmed_at !== null);
            } else {
                setUser(null);
                setIsVerified(false);
            }
            setLoading(false);
        };

        fetchUser();

        const { data: subscription } = supabase.auth.onAuthStateChange((_, session) => {
            if (isMounted) {
                setUser(session?.user || null);
                setIsVerified(session?.user?.email_confirmed_at !== null);
            }
        });

        return () => {
            if (subscription?.unsubscribe) {
                subscription.unsubscribe();  // Désinscription propre
            }
            setIsMounted(false); // Nettoyer l'état au démontage
        };
    }, [isMounted]);

    return { user, loading, isVerified };
}
