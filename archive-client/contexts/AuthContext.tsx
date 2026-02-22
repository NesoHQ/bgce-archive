"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthAPI, UserResponse } from '@/lib/auth-api';

interface AuthContextType {
    user: UserResponse | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: UserResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = AuthAPI.getToken();
        const savedUser = AuthAPI.getUser();

        if (token && savedUser) {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    const login = (token: string, userData: UserResponse) => {
        AuthAPI.saveToken(token);
        AuthAPI.saveUser(userData);
        setUser(userData);
    };

    const logout = () => {
        AuthAPI.logout();
        setUser(null);
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
