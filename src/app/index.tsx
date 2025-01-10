import React from 'react';
import { Text } from 'react-native'; // Ajoutez Text et View ici
import { useAuth } from '@/src/hooks/useAuth'; // Hook d'authentification

console.log('### src/app/index.tsx');

export default function Index() {
    const { user, isVerified, loading } = useAuth();

    console.log('### index :: User: ', user);
    console.log('### index :: Is Verified: ', isVerified);
    console.log('### index :: loading: ', loading);

    if (loading) {
        // Afficher un écran de chargement pendant l'initialisation
        return <Text>Chargement...</Text>;
    }

    // Sinon, tu peux afficher le contenu de la page d'accueil (ou autre)
    return (
        <Text>Bienvenue sur l'index</Text>
    );
}
