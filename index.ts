import React from 'react';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import logger from '@/src/utils/logger'; // Import du logger

// Utilisation de require.context pour charger dynamiquement le contenu de `./app`
export function App() {
    try {
        logger.info('Initialisation de l\'application App.');

        // require.context() est utilisé pour importer tous les fichiers .tsx dans le dossier `app`
        const ctx = require.context('./src/app', true, /\.tsx$/); // true pour inclure les sous-dossiers

        logger.info('Les fichiers ont été chargés avec require.context.', {
            loadedModules: ctx.keys(),
        });

        // Vérifie si `ctx` contient bien un répertoire valide et si la fonction ExpoRoot fonctionne correctement
        return React.createElement(ExpoRoot, { context: ctx });
    } catch (error) {
        logger.error('Erreur lors de l\'initialisation de l\'application App.', { error });
        throw error; // Relance l'erreur pour éviter de masquer un problème critique
    }
}

// Enregistre le composant d'entrée de l'application
try {
    logger.info('Enregistrement du composant racine avec registerRootComponent.');
    registerRootComponent(App);
} catch (error) {
    logger.error('Erreur lors de l\'enregistrement du composant racine.', { error });
    throw error; // Relance l'erreur pour investigation
}
