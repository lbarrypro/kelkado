interface Storage {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
}

const webStorage: Storage = {
    setItem: async (key: string, value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Erreur lors de la sauvegarde de la clé ${key}:`, error);
            throw new Error('Unable to save item');
        }
    },

    getItem: async (key: string) => {
        try {
            const value = localStorage.getItem(key);
            return value;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la clé ${key}:`, error);
            return null;
        }
    },

    removeItem: async (key: string) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Erreur lors de la suppression de la clé ${key}:`, error);
            throw new Error('Unable to remove item');
        }
    },
};

export default webStorage;
