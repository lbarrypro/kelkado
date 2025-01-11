import React from 'react';
import { Text } from 'react-native'; // Ajoutez Text et View ici
import { useAuth } from '@/src/context/AuthContext'; // Contexte d'authentification

export default function Index() {
    const { user, isVerified, loading } = useAuth();

    if (loading) {
        // Afficher un écran de chargement pendant l'initialisation
        return <Text>Chargement...</Text>;
    }

    // Sinon, tu peux afficher le contenu de la page d'accueil (ou autre)
    return (
        <Text>Bienvenue sur l'index</Text>
    );
}
