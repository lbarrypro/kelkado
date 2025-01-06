import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '@/hooks/useAuth';  // Le hook d'authentification

export default function TabLayout() {
    const user = useAuth();  // Récupérer l'utilisateur connecté

    console.log('### TabLayout :: user: ', user);

    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            // Si l'utilisateur n'est pas connecté, rediriger vers la page d'accueil
            router.push('/');  // Rediriger vers la page de connexion ou d'accueil
        }
    }, [user, router]);

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
