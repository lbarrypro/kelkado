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
    levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
    },
    severity: process.env.LOG_LEVEL || 'debug',
    transport: consoleTransport,
    transportOptions: {
        colors: {
            info: "blue",
            warn: "yellow",
            error: "red",
        }
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

    // Utilise `keyof typeof log` pour garantir que `level` est une clé valide de `log`
    if (level in log) {
        log[level as keyof typeof log](`${message} (from ${callerFile})`, ...args);
    } else {
        console.warn(`Niveau de log invalide : ${level}`);
    }
};

// Exposer directement les niveaux de log comme un objet
const loggerInstance = {
    info: (message: string, ...args: any[]) => logWithFile('info', message, ...args),
    warn: (message: string, ...args: any[]) => logWithFile('warn', message, ...args),
    error: (message: string, ...args: any[]) => logWithFile('error', message, ...args),
    debug: (message: string, ...args: any[]) => logWithFile('debug', message, ...args),
};

export default loggerInstance;
