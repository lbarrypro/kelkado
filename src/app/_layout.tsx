import React, { useEffect, useState } from 'react';
import { Slot, useRouter } from 'expo-router';
import { AuthProvider, useAuth } from '@/src/context/AuthContext'; // Contexte d'authentification
import { UserProfilesProvider } from '@/src/context/UserProfilesContext';
import { ListsProvider } from '@/src/context/ListsContext';
import { ProductsProvider } from '@/src/context/ProductsContext';
import { HomeFeedProvider } from '@/src/context/HomeFeedContext';
import { Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import logger from '@/src/utils/logger';

export default function RootLayout() {
    return (
        <AuthProvider>
            <UserProfilesProvider>
                <PaperProvider>
                    <ProductsProvider>
                        <ListsProvider>
                            <HomeFeedProvider>
                                <AuthenticatedLayout />
                            </HomeFeedProvider>
                        </ListsProvider>
                    </ProductsProvider>
                </PaperProvider>
            </UserProfilesProvider>
        </AuthProvider>
    );
}

function AuthenticatedLayout() {
    const { user, isVerified, loading } = useAuth();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        logger.debug('app/_layout :: Vérification des états de l\'utilisateur:', { user, isVerified, loading });

        if (isMounted && !loading) {
            if (!user) {
                logger.info('app/_layout :: Utilisateur non authentifié, redirection vers la page de connexion');
                router.replace('/auth/login');
            } else if (user && !isVerified) {
                logger.info('app/_layout :: Utilisateur connecté mais non vérifié, redirection vers la page de vérification d\'email');
                router.replace('/auth/verify-email');
            } else if (user && isVerified) {
                logger.info('app/_layout :: Utilisateur connecté et vérifié, redirection vers la page d\'accueil');
                router.replace('/home');
            }
        }
    }, [user, isVerified, loading, router, isMounted]);

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
