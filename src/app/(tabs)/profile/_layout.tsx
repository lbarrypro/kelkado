import { Stack } from 'expo-router';
import { UserProfilesProvider } from '@/src/context/UserProfilesContext';
import React from 'react';

export default function ProfileLayout() {
    return (
        <UserProfilesProvider>
            <Stack>
                {/* Ce layout gère toutes les pages dans le dossier /profile */}
                <Stack.Screen
                    name="index"
                    options={{
                        title: 'Profile Overview',
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="edit"
                    options={{
                        title: 'Edit Profile',
                        headerShown: true, // Assure que l'en-tête est affiché
                        headerBackTitle: 'Back', // Texte du bouton précédent
                    }}
                />
            </Stack>
        </UserProfilesProvider>
    );
}
