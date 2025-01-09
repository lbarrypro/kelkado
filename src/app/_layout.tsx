import React, { useEffect } from 'react';
import { Slot, useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth'; // Hook d'authentification
import { AuthProvider } from '@/src/provider/AuthProvider'; // Contexte d'authentification
import { Text, View } from 'react-native'; // Ajoutez Text et View ici

console.log('### src/app/_layout');

export default function RootLayout() {
    return (
        // AuthProvider doit envelopper le composant Slot et tout autre contenu
        <AuthProvider>
            <AuthenticatedLayout />
        </AuthProvider>
    );
}

function AuthenticatedLayout() {
    const { user, loading } = useAuth(); // Hook pour accéder à l'utilisateur et l'état de chargement
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
            router.replace('/auth/login');
        }
    }, [user, loading, router]);

    if (loading) {
        // Afficher un écran de chargement pendant l'initialisation
        return <LoadingScreen />;
    }

    return (
        <Slot />
    );
}

// Composant d'écran de chargement
function LoadingScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Chargement...</Text>
        </View>
    );
}
