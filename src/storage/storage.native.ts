import AsyncStorage from '@react-native-async-storage/async-storage';

interface Storage {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    removeItem: (key: string) => Promise<void>;
}

const nativeStorage: Storage = {
    setItem: async (key: string, value: string) => {
        try {
            await AsyncStorage.setItem(key, value);
        } catch (error) {
            throw new Error('Unable to save item');
        }
    },

    getItem: async (key: string) => {
        try {
            return await AsyncStorage.getItem(key);
        } catch (error) {
            return null;
        }
    },

    removeItem: async (key: string) => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            throw new Error('Unable to remove item');
        }
    },
};

export default nativeStorage;
