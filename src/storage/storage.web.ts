interface Storage {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
}

const webStorage: Storage = {
    setItem: async (key: string, value: string) => {
        console.log('### webStorage :: setItem', key, value);

        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error(`Erreur lors de la sauvegarde de la clé ${key}:`, error);
            throw new Error('Unable to save item');
        }
    },

    getItem: async (key: string) => {
        console.log('### webStorage :: getItem :: key: ', key);

        try {
            const value = localStorage.getItem(key);

            console.log('### webStorage :: getItem :: value: ', value);

            return value;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la clé ${key}:`, error);
            return null;
        }
    },

    removeItem: async (key: string) => {
        console.log('### webStorage :: removeItem :: key: ', key);

        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Erreur lors de la suppression de la clé ${key}:`, error);
            throw new Error('Unable to remove item');
        }
    },
};

export default webStorage;
