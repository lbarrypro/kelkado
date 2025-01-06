import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';  // Le hook d'authentification

export default function Index() {
    const { user, isVerified } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false); // Ajout d'un état pour vérifier si le composant est monté

    useEffect(() => {
        // Indiquer que le composant est monté
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Attendre que le composant soit monté avant de naviguer
        if (isMounted) {
            if (user !== null) {
                if (isVerified) {
                    router.replace('/(tabs)/home');
                } else {
                    console.warn('Votre email n\'est pas vérifié. Veuillez vérifier vos emails.');
                    router.push('/verify-email'); // Une page pour gérer la vérification d'email
                }
            } else {
                // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
                router.replace('/login');  // Remplacez "/login" par la page de votre choix
            }
        } else {
            console.error('Component not mounted');
        }
    }, [user, isMounted, isVerified, router]);

    return null;  // Pas de UI ici, juste la logique de redirection
}
