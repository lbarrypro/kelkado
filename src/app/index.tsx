import React, { useEffect } from 'react';
import { Text } from 'react-native'; // Ajoutez Text et View ici
import { useAuth } from '@/src/context/AuthContext'; // Contexte d'authentification
import logger from '@/src/utils/logger'; // Importer le logger

export default function Index() {
    const { user, isVerified, loading } = useAuth();

    useEffect(() => {
        // Log lors du changement de l'état de chargement
        if (loading) {
            logger.info('Index :: Chargement en cours...');
        } else {
            logger.info('Index :: Chargement terminé');
        }

        // Log de l'utilisateur et de sa vérification
        if (user) {
            logger.info('Index :: Utilisateur connecté :', { user });
        } else {
            logger.warn('Index :: Aucun utilisateur connecté');
        }

        if (isVerified) {
            logger.info('Index :: Utilisateur vérifié');
        } else {
            logger.info('Index :: Utilisateur non vérifié');
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
