import { AuthProviderInterface } from "@/src/providers/AuthProviderInterface";
import { User } from "@/src/interfaces/UserInterface";
import React from "react";

export interface AuthContextType {
    authProvider: AuthProviderInterface; // Le type du provider
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isVerified: boolean;
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
    loading: boolean;
}
