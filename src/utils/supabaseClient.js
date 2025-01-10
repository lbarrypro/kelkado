import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Récupère les valeurs depuis app.config.ts
const supabaseUrl = Constants.expoConfig?.extra?.authProviderUrl;
const supabaseKey = Constants.expoConfig?.extra?.authProviderKey;

console.log('### supabase Client init: ', supabaseUrl, supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
