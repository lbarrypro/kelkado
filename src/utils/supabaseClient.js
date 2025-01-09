import { createClient } from '@supabase/supabase-js';

// Remplace les valeurs ci-dessous par les valeurs de ton propre projet Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

console.log('### supabaseClient :: supabaseUrl: ', supabaseUrl);
console.log('### supabaseClient :: supabaseKey: ', supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);
