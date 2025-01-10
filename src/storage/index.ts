// storage/index.ts
import { Platform } from 'react-native';

let storage;

if (Platform.OS === 'web') {
    storage = require('./storage.web').default;  // Charge le fichier web
} else {
    storage = require('./storage.native').default;  // Charge le fichier natif
}

export const setItem = storage.setItem;
export const getItem = storage.getItem;
export const removeItem = storage.removeItem;
