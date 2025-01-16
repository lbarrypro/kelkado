import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfilesService } from '@/src/services/UserProfilesService';
import { UserProfile, UserProfilesContextType } from '@/src/interfaces/UserProfileInterface';

const UserProfilesContext = createContext<UserProfilesContextType | undefined>(undefined);

export const UserProfilesProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<UserProfile | null>(null);
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
        <UserProfilesContext.Provider value={{ userData, setUserData, createProfile, getProfile, updateProfile, deleteProfile }}>
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
