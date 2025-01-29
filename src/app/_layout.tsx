import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/src/context/AuthContext'; // Contexte d'authentification
import { UserProfilesProvider } from '@/src/context/UserProfilesContext'; // Contexte pour les profils utilisateurs
import { ListsProvider } from '@/src/context/ListsContext'; // Contexte pour les profils utilisateurs
import { ProductsProvider } from '@/src/context/ProductsContext';
import { Text, View } from 'react-native'; // Ajoutez Text et View ici
import { Provider as PaperProvider } from 'react-native-paper';
import logger from '@/src/utils/logger'; // Importer le logger

export default function RootLayout() {
    return (
        // AuthProvider doit envelopper tout le contenu
        <AuthProvider>
            <UserProfilesProvider>
                <PaperProvider>
                    <ProductsProvider>
                        <ListsProvider>
                            <AuthenticatedLayout />
                        </ListsProvider>
                    </ProductsProvider>
                </PaperProvider>
            </UserProfilesProvider>
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
        // Ajouter des logs pour suivre l'état des données utilisateur et de la redirection
        logger.debug('app/_layout :: Vérification des états de l\'utilisateur:', { user, isVerified, loading });

        // Vérifier si le composant est monté avant de procéder à la redirection
        if (isMounted && !loading) {
            if (!user) {
                // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
                logger.info('app/_layout :: Utilisateur non authentifié, redirection vers la page de connexion');
                router.replace('/auth/login');
            } else if (user && !isVerified) {
                // Si l'utilisateur est connecté mais non vérifié, rediriger vers la page de vérification d'email
                logger.info('app/_layout :: Utilisateur connecté mais non vérifié, redirection vers la page de vérification d\'email');
                router.replace('/auth/verify-email');
            } else if (user && isVerified) {
                // Si l'utilisateur est connecté et vérifié, rediriger vers la page d\'accueil
                logger.info('app/_layout :: Utilisateur connecté et vérifié, redirection vers la page d\'accueil');
                router.replace('/home');
            }
        }
    }, [user, isVerified, loading, router, isMounted]); // Ajout de `isMounted` comme dépendance

    // Log lors du chargement
    if (loading) {
        logger.debug('app/_layout :: L\'application est en cours de chargement...');
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
