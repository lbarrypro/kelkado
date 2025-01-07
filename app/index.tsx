import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth'; // Hook d'authentification

export default function Index() {
    const { user, isVerified } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false); // État pour vérifier si le composant est monté

    useEffect(() => {
        // Marquer le composant comme monté
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Navigation conditionnelle après le montage du composant
        if (isMounted) {
            if (user) {
                if (isVerified) {
                    router.replace('/home'); // Rediriger vers la page "home" si vérifié
                } else {
                    console.warn('Votre email n\'est pas vérifié. Veuillez vérifier vos emails.');
                    router.replace('/verify-email'); // Page de vérification d'email
                }
            } else {
                // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
                router.replace('/auth/login'); // Chemin mis à jour pour suivre l'arborescence
            }
        } else {
            console.error('Le composant n\'est pas monté');
        }
    }, [user, isMounted, isVerified, router]);

    return null; // Pas d'interface ici, uniquement la logique de redirection
}
