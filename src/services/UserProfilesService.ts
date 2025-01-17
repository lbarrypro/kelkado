import SupabaseSingleton from '@/src/utils/supabaseClient';
import logger from '@/src/utils/logger';

export class UserProfilesService {
    private supabase = SupabaseSingleton.getInstance(); // Utilisation du Singleton

    async createProfile(profileData: Record<string, any>) {
        logger.debug('UserProfilesService :: createProfile :: profileData: ', profileData);

        const { data, error } = await this.supabase
            .from('user_profiles')
            .insert(profileData)
            .single();
        if (error) throw error;

        logger.debug('UserProfilesService :: createProfile :: data: ', data);
        logger.debug('UserProfilesService :: createProfile :: error: ', error);

        return data;
    }

    async getProfile(userId: string) {
        logger.debug('UserProfilesService :: getProfile :: userId: ', userId);

        const { data, error } = await this.supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;

        logger.debug('UserProfilesService :: getProfile :: data: ', data);
        logger.debug('UserProfilesService :: getProfile :: error: ', error);

        return data;
    }

    async updateProfile(userId: string, profileData: Record<string, any>) {
        logger.debug('UserProfilesService :: updateProfile :: userId: ', userId);
        logger.debug('UserProfilesService :: updateProfile :: profileData: ', profileData);

        const { data, error } = await this.supabase
            .from('user_profiles')
            .update(profileData)
            .eq('id', userId)
            .single();
        if (error) throw error;

        logger.debug('UserProfilesService :: updateProfile :: data: ', data);
        logger.debug('UserProfilesService :: updateProfile :: error: ', error);

        return data;
    }

    async deleteProfile(userId: string) {
        logger.debug('UserProfilesService :: deleteProfile :: userId: ', userId);

        const { data, error } = await this.supabase
            .from('user_profiles')
            .delete()
            .eq('id', userId);
        if (error) throw error;

        logger.debug('UserProfilesService :: deleteProfile :: data: ', data);
        logger.debug('UserProfilesService :: deleteProfile :: error: ', error);

        return data;
    }

    async getFollowerCount(userId: string) {
        const { count, error } = await this.supabase
            .from('followers')
            .select('*', { count: 'exact', head: true })
            .eq('followed_id', userId); // Utilisateur suivi

        if (error) {
            console.error('Error fetching follower count:', error);
            throw error;
        }
        return count;
    }

    async getFollowingCount(userId: string) {
        const { count, error } = await this.supabase
            .from('followers')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', userId); // Utilisateur qui suit

        if (error) {
            console.error('Error fetching following count:', error);
            throw error;
        }
        return count;
    };
}
