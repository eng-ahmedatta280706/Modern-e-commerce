import React, { createContext, useState, useEffect } from "react";
import { getUserProfile, getUserOrdersCount } from "../api/Users";

interface User {
    id: string;
    name: string;
    email: string;
    username?: string;
    address?: string;
    phoneNumber?: string;
    profilePic?: string;
    ordersCount?: number;
}

interface UserContextType {
    user: User | null;
    refreshUser: () => Promise<void>;
    deleteUser: () => void;
    switchUser: (newUser: User) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const refreshUser = async () => {
        try {
            const profileRes = await getUserProfile();
            const ordersRes = await getUserOrdersCount();
            setUser({
                ...profileRes.data,
                ordersCount: ordersRes.data.count,
            });
        } catch {
            setUser(null);
        }
    };

    const deleteUser = () => {
        setUser(null);
    }

    const switchUser = (newUser: User) => {
        setUser(newUser);
    };


    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, refreshUser, deleteUser, switchUser }}>
            {children}
        </UserContext.Provider>
    );
};