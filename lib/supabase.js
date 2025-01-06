import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Récupérer les variables d'environnement
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseAnonKey) {
	console.error('Erreur : Supabase URL ou clé manquante dans les variables d\'environnement');
	throw new Error('Les variables d\'environnement Supabase sont manquantes.');
}

console.log('supabaseUrl: ', supabaseUrl);
console.log('supabaseAnonKey: ', supabaseAnonKey);

// Créer le client Supabase si les variables sont valides
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: Platform.OS !== "web",
		detectSessionInUrl: false,
	},
});

console.log('Client Supabase créé avec succès');
