export interface UserProfile {
    id: string;
    username: string;
    birthdate: string;
    profile_picture: string;
}

export interface UserProfilesContextType {
    createProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
    getProfile: (userId: string) => Promise<UserProfile>;
    updateProfile: (userId: string, profileData: Partial<UserProfile>) => Promise<UserProfile>;
    deleteProfile: (userId: string) => Promise<void>;
    userData: UserProfile | null;
    setUserData: (data: UserProfile) => void;
}
