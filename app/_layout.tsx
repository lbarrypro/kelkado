import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth'; // Hook d'authentification
import { Stack } from 'expo-router';

export default function RootLayout() {
    const { user } = useAuth(); // Accéder aux données utilisateur via le hook d'authentification
    const router = useRouter();

    useEffect(() => {
        // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
        if (!user) {
            router.replace('/auth/login'); // Chemin mis à jour pour suivre l'arborescence
        }
    }, [user, router]);

    if (!user) {
        // Si l'utilisateur n'est pas connecté, ne pas afficher le layout principal
        return null;
    }

    return (
        <Stack>
            {/* Écran de connexion */}
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            {/* Onglets pour les utilisateurs connectés */}
            <Stack.Screen name="(tabs)/home" options={{ headerShown: false }} />
            {/* Exemple d'écran d'erreur */}
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}
