export interface UserProfile {
    id: string;
    username: string;
    email: string;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
}

export interface FollowData {
    follower_id: string;
    followed_id: string;
}

export interface UserProfileService {
    createProfile(profileData: Record<string, any>): Promise<UserProfile>;
    getProfile(userId: string): Promise<UserProfile>;
    updateProfile(userId: string, profileData: Record<string, any>): Promise<UserProfile>;
    deleteProfile(userId: string): Promise<any>;
    getFollowerCount(userId: string): Promise<number>;
    getFollowingCount(userId: string): Promise<number>;
    getOtherUsers(currentUserId: string): Promise<UserProfile[]>;
    getFollowedUsers(userId: string): Promise<string[]>;
    followUser(followerId: string, followedId: string): Promise<any>;
}
