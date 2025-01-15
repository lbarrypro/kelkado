import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';  // Assure-toi que tu utilises le bon hook pour la navigation
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/src/context/AuthContext';  // Le contexte pour récupérer l'utilisateur
import logger from '@/src/utils/logger';  // Import de ton logger personnalisé

export default function TabLayout() {
    const { user, isVerified } = useAuth();  // Utiliser useContext pour récupérer l'utilisateur
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);  // État pour suivre la disponibilité du layout

    useEffect(() => {
        // Log à chaque fois que le layout est prêt ou que l'utilisateur change
        logger.info('app/(tabs)/_layout :: useEffect', { isReady, user, isVerified });

        // S'assurer que le layout est monté avant de naviguer
        if (!isReady) return;

        if (user === null) {
            logger.warn('app/(tabs)/_layout :: useEffect :: Utilisateur non connecté, redirection vers la page d\'accueil');
            // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
            router.push('/');  // Rediriger vers la page de connexion ou d'accueil
        } else if (user && !isVerified) {
            logger.info('app/(tabs)/_layout :: useEffect :: Utilisateur non vérifié:', { email: user.email });  // Log l'email de l'utilisateur si connecté
        } else {
            logger.info('app/(tabs)/_layout :: useEffect :: Utilisateur connecté:', { email: user.email });  // Log l'email de l'utilisateur si connecté
        }
    }, [user, isReady, router]);

    useEffect(() => {
        // Quand le composant est monté, on met à jour l'état pour signaler que le layout est prêt
        logger.debug('app/(tabs)/_layout :: useEffect :: TabLayout monté, mise à jour de l\'état de readiness');
        setIsReady(true);
    }, []);

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#ffd33d',
                headerStyle: {
                    backgroundColor: '#25292e',
                },
                headerShadowVisible: false,
                headerTintColor: '#fff',
                tabBarStyle: {
                    backgroundColor: '#25292e',
                },
                tabBarShowLabel: false, // Enlève les labels sous les icônes
            }}
        >
            <Tabs.Screen
                name="home"  // Renommé de "index" à "home"
                options={{
                    title: 'Home',
                    headerShown: false, // Enlève le header
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'home-sharp' : 'home-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    headerShown: false, // Enlève le header
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'compass' : 'compass-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="add"
                options={{
                    title: 'Add',
                    headerShown: false, // Enlève le header
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: 'Notifications',
                    headerShown: false, // Enlève le header
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'notifications' : 'notifications-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    headerShown: false, // Enlève le header
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
