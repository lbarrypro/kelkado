import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import logger from '@/src/utils/logger';

class SupabaseSingleton {
    private static instance: SupabaseClient | null = null;

    private constructor() {
        // Empêche l'instanciation directe
    }

    public static getInstance(): SupabaseClient {
        if (!SupabaseSingleton.instance) {
            const supabaseUrl = Constants.expoConfig?.extra?.authProviderUrl || process.env.EXPO_PUBLIC_AUTHPROVIDER_URL;
            const supabaseKey = Constants.expoConfig?.extra?.authProviderKey || process.env.EXPO_PUBLIC_AUTHPROVIDER_KEY;

            if (!supabaseUrl || !supabaseKey) {
                throw new Error('SupabaseSingleton :: getInstance :: Supabase URL or Key is missing from configuration');
            }

            SupabaseSingleton.instance = createClient(supabaseUrl, supabaseKey);
            logger.info('SupabaseSingleton :: getInstance :: Supabase client initialized');
        }

        return SupabaseSingleton.instance;
    }
}

export default SupabaseSingleton;

// Réexporte SupabaseClient
export type { SupabaseClient };
