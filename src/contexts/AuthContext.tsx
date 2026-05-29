import React, {
    createContext,
    useState,
    useMemo
} from "react";
import { login, logout, register } from "../api/auth";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    loginUser: (identifier: string, password: string) => Promise<void>; // identifier = email أو username
    logoutUser: () => Promise<void>;
    registerUser: (data: { name?: string; username?: string; email?: string; password: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    const loginUser = async (identifier: string, password: string) => {
        setLoading(true);
        try {
            if (!identifier || !password) throw new Error("Username/Email and password are required");
            // هنا الـ API لازم يكون قادر يتعامل مع identifier سواء كان email أو username
            await login(identifier, password);
            setIsAuthenticated(true);
        } catch (err) {
            console.error("Login failed:", err);
            setIsAuthenticated(false);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async () => {
        setLoading(true);
        try {
            await logout();
            setIsAuthenticated(false);
        } catch (err) {
            console.error("Logout failed:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (data: { name?: string; username?: string; email?: string; password: string }) => {
        setLoading(true);
        try {
            if ((!data.username && !data.email) || !data.password) {
                throw new Error("Username or Email and password are required");
            }
            await register(data);
            setIsAuthenticated(true);
        } catch (err) {
            console.error("Register failed:", err);
            setIsAuthenticated(false);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(() => ({
        isAuthenticated,
        loading,
        loginUser,
        logoutUser,
        registerUser
    }), [isAuthenticated, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};