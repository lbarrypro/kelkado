import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/src/context/AuthContext'; // Contexte d'authentification
import { Text, View } from 'react-native'; // Ajoutez Text et View ici

export default function RootLayout() {
    return (
        // AuthProvider doit envelopper le composant Slot et tout autre contenu
        <AuthProvider>
            <AuthenticatedLayout />
        </AuthProvider>
    );
}

function AuthenticatedLayout() {
    const { user, isVerified, loading } = useAuth(); // Hook pour accéder à l'utilisateur et son état de vérification
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false); // Ajouter un état pour vérifier si le composant est monté

    useEffect(() => {
        // Marquer le composant comme monté après le premier rendu
        setIsMounted(true);
    }, []);

    useEffect(() => {
        // Vérifier si le composant est monté avant de procéder à la redirection
        if (isMounted && !loading) {
            if (!user) {
                // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
                router.replace('/auth/login');
            } else if (user && !isVerified) {
                // Si l'utilisateur est connecté mais non vérifié, rediriger vers la page de vérification d'email
                router.replace('/auth/verify-email');
            } else if (user && isVerified) {
                // Si l'utilisateur est connecté et vérifié, rediriger vers la page d'accueil
                router.replace('/home');
            }
        }
    }, [user, isVerified, loading, router, isMounted]); // Ajout de `isMounted` comme dépendance

    if (loading) {
        // Afficher un écran de chargement pendant l'initialisation
        return <LoadingScreen />;
    }

    return <Slot />;
}

function LoadingScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Chargement...</Text>
        </View>
    );
}
