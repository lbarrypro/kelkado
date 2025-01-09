import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';

export default function Index() {
    const { user, isVerified, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                if (isVerified) {
                    router.replace('/home'); // Page d'accueil
                } else {
                    router.replace('/verify-email'); // Page de vérification d'email
                }
            } else {
                router.replace('/auth/login'); // Page de connexion
            }
        }
    }, [user, isVerified, loading, router]);

    return null; // Pas d'affichage ici, juste la logique de redirection
}
