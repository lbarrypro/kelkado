import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import { UserProfilesService } from '@/src/services/UserProfilesService';
import { UserProfile, UserProfilesContextType } from '@/src/interfaces/UserProfileInterface';

const UserProfilesContext = createContext<UserProfilesContextType | undefined>(undefined);

export const UserProfilesProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [otherUsers, setOtherUsers] = useState<UserProfile[]>([]);
    const [followedUsers, setFollowedUsers] = useState<UserProfile[]>([]);

    const service = new UserProfilesService();

    const createProfile = async (profileData: Partial<UserProfile>) => {
        return await service.createProfile(profileData);
    };

    const getProfile = async (userId: string) => {
        return await service.getProfile(userId);
    };

    const updateProfile = async (userId: string, profileData: Partial<UserProfile>) => {
        return await service.updateProfile(userId, profileData);
    };

    const deleteProfile = async (userId: string) => {
        return await service.deleteProfile(userId);
    };

    const getFollowerCount = async (userId: string) => {
        return await service.getFollowerCount(userId);
    };

    const getFollowingCount = async (userId: string) => {
        return await service.getFollowingCount(userId);
    };

    const getOtherUsers = async (currentUserId: string) => {
        return await service.getOtherUsers(currentUserId);
    };

    const getFollowedUsers = async (userId: string) => {
        const followed = await service.getFollowedUsers(userId);
        setFollowedUsers(followed);
        return followed;
    }

    const followUser = async (followerId: string, followedId: string) => {
        const followed = await service.followUser(followerId, followedId);
        getFollowedUsers(followerId);

        return followed;
    };

    useEffect(() => {
        if (userData) {
            getFollowedUsers(userData.id);
        }
    }, [userData]);

    return (
        <UserProfilesContext.Provider value={{
            userData,
            setUserData,
            createProfile,
            getProfile,
            updateProfile,
            deleteProfile,
            getFollowerCount,
            getFollowingCount,
            getOtherUsers,
            getFollowedUsers,
            followUser
        }}>
            {children}
        </UserProfilesContext.Provider>
    );
};

// Hook pour accéder au contexte
export const useUserProfiles = (): UserProfilesContextType => {
    const context = useContext(UserProfilesContext);
    if (!context) {
        throw new Error('useUserProfiles must be used within a UserProfilesProvider');
    }
    return context;
};
