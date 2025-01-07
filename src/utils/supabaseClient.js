import { createClient } from '@supabase/supabase-js';

// Remplace les valeurs ci-dessous par les valeurs de ton propre projet Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

console.log('### process.env: ', process.env);

export const supabase = createClient(supabaseUrl, supabaseKey);
