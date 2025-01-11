import React, { useEffect } from 'react';
import { Text } from 'react-native'; // Ajoutez Text et View ici
import { useAuth } from '@/src/context/AuthContext'; // Contexte d'authentification
import logger from '@/src/utils/logger'; // Importer le logger

export default function Index() {
    const { user, isVerified, loading } = useAuth();

    useEffect(() => {
        // Log lors du changement de l'état de chargement
        if (loading) {
            logger.info('Chargement en cours...');
        } else {
            logger.info('Chargement terminé');
        }

        // Log de l'utilisateur et de sa vérification
        if (user) {
            logger.info('Utilisateur connecté :', { user });
        } else {
            logger.warn('Aucun utilisateur connecté');
        }

        if (isVerified) {
            logger.info('Utilisateur vérifié');
        } else {
            logger.info('Utilisateur non vérifié');
        }
    }, [loading, user, isVerified]);

    if (loading) {
        // Afficher un écran de chargement pendant l'initialisation
        return <Text>Chargement...</Text>;
    }

    // Sinon, tu peux afficher le contenu de la page d'accueil (ou autre)
    return (
        <Text>Bienvenue sur l'index</Text>
    );
}
