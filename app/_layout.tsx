import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth'; // Hook d'authentification
import { Stack } from 'expo-router';

export default function RootLayout() {
    const user = useAuth(); // Vérifier si l'utilisateur est connecté
    const router = useRouter();

    useEffect(() => {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        if (user === null) {
            router.replace('/login'); // Remplacer au lieu de pousser pour éviter le bouton "Retour"
        }
    }, [user, router]);

    if (user === null) {
        // Si l'utilisateur n'est pas connecté, ne pas afficher le layout principal
        return null;
    }

    return (
        <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            {/* Tabs pour les utilisateurs connectés */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Exemple d'écran de gestion d'erreur */}
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}
