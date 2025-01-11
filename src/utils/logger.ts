import { logger, consoleTransport } from "react-native-logs";

// Fonction pour obtenir le fichier appelant sans utiliser path
function getCallerFile(): string {
    const stack = new Error().stack || '';
    const stackLines = stack.split('\n');
    const callerLine = stackLines[3] || ''; // Ligne contenant l'appel du logger
    const match = callerLine.match(/\((.*):\d+:\d+\)$/); // Extraire le chemin du fichier
    return match ? match[1] : 'unknown';
}

// Définir les niveaux de log personnalisés
const customLevels = {
    levels: {
        fatal: 0,    // Niveau critique
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5,    // Messages très détaillés
    },
    colors: {
        fatal: "redBright",
        error: "red",
        warn: "yellowBright",
        info: "greenBright",
        debug: "blueBright",
        trace: "gray",
    },
};

// Configurer le logger avec les niveaux et couleurs personnalisées
const log = logger.createLogger({
    levels: customLevels.levels,
    severity: "debug",
    transport: consoleTransport,
    transportOptions: {
        colors: customLevels.colors,
    },
    async: true,
    dateFormat: "time",
    printLevel: true,
    printDate: true,
    fixedExtLvlLength: false,
    enabled: true,
});

// Créer une fonction pour enregistrer avec le fichier appelant
const logWithFile = (level: string, message: string, ...args: any[]) => {
    const callerFile = getCallerFile(); // Obtenir le fichier appelant
    log[level](`${message} (from ${callerFile})`, ...args);
};

// Exposer les méthodes de log
export const logInfo = (message: string, ...args: any[]) => logWithFile('info', message, ...args);
export const logWarning = (message: string, ...args: any[]) => logWithFile('warn', message, ...args);
export const logError = (message: string, ...args: any[]) => logWithFile('error', message, ...args);

// Exposition directe des méthodes info, warn, error
export const info = (message: string, ...args: any[]) => logWithFile('info', message, ...args);
export const warning = (message: string, ...args: any[]) => logWithFile('warn', message, ...args);
export const error = (message: string, ...args: any[]) => logWithFile('error', message, ...args);

export default log;
