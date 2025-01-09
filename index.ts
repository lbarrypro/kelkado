import React from 'react';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// Utilisation de require.context pour charger dynamiquement le contenu de `./app`
export function App() {

    console.log("Ceci est le point d'entrée de l'application.");
    console.log('### process.env: ', process.env);

    // require.context() est utilisé pour importer tous les fichiers .tsx dans le dossier `app`
    const ctx = require.context('./src/app', true, /\.tsx$/); // true pour inclure les sous-dossiers

    console.log('### ctx: ', ctx);

    // Vérifie si `ctx` contient bien un répertoire valide et si la fonction ExpoRoot fonctionne correctement
    return React.createElement(ExpoRoot, { context: ctx });
}

// Enregistre le composant d'entrée de l'application
registerRootComponent(App);
