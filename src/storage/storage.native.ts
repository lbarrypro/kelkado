import AsyncStorage from '@react-native-async-storage/async-storage';

interface Storage {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
}

const nativeStorage: Storage = {
    setItem: async (key: string, value: string) => {
        console.log('### nativeStorage :: setItem', key, value);

        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            console.error(`Erreur lors de la sauvegarde de la clé ${key}:`, error);
            throw new Error('Unable to save item');
        }
    },

    getItem: async (key: string) => {
        console.log('### nativeStorage :: getItem :: key: ', key);

        try {
            const value = await AsyncStorage.getItem(key);

            console.log('### nativeStorage :: getItem :: value: ', value);

            return value;
        } catch (error) {
            console.error(`Erreur lors de la récupération de la clé ${key}:`, error);
            return null;
        }
    },

    removeItem: async (key: string) => {
        console.log('### nativeStorage :: removeItem :: key: ', key);

        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.error(`Erreur lors de la suppression de la clé ${key}:`, error);
            throw new Error('Unable to remove item');
        }
    },
};

export default nativeStorage;
