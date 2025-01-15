import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfilesService } from '@/src/services/UserProfilesService';

interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    birthdate: string;
    profile_picture: string;
}

interface UserProfilesContextType {
    createProfile: (profileData: Partial<UserProfile>) => Promise<UserProfile>;
    getProfile: (userId: string) => Promise<UserProfile>;
    updateProfile: (userId: string, profileData: Partial<UserProfile>) => Promise<UserProfile>;
    deleteProfile: (userId: string) => Promise<void>;
}

const UserProfilesContext = createContext<UserProfilesContextType | undefined>(undefined);

export const UserProfilesProvider = ({ children }: { children: ReactNode }) => {
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

    return (
        <UserProfilesContext.Provider value={{ createProfile, getProfile, updateProfile, deleteProfile }}>
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
