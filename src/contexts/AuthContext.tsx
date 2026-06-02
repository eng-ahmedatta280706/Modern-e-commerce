import React, {
    createContext,
    useEffect,
    useState,
} from "react";
import { login, logout, register } from "../api/auth";
import api from "../services/api";
import type { AuthUser } from "../types/User";

interface AuthContextType {
    isAuthenticated: boolean;
    loading: boolean;
    user: AuthUser | null;
    loginUser: (identifier: string, password: string) => Promise<void>; // identifier = email أو username
    logoutUser: () => Promise<void>;
    registerUser: (data: { name?: string; username?: string; email?: string; password: string }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "token";
const USER_ID_KEY = "userId";
const USER_KEY = "user";

const normalizeUser = (rawUser: any): AuthUser | null => {
    if (!rawUser) return null;

    return {
        ...rawUser,
        id: rawUser.id ?? rawUser._id ?? rawUser.userId ?? rawUser.uid ?? "",
        role: rawUser.role,
    } as AuthUser;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(localStorage.getItem(TOKEN_KEY)));
    const [loading, setLoading] = useState<boolean>(() => Boolean(localStorage.getItem(TOKEN_KEY)));
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const stored = localStorage.getItem(USER_KEY);
            return stored ? (JSON.parse(stored) as AuthUser) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        const bootstrap = async () => {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const stored = localStorage.getItem(USER_KEY);
                if (stored) {
                    setUser(JSON.parse(stored) as AuthUser);
                } else {
                    const response = await api.get('/auth/me');
                    const fetchedUser = normalizeUser(response.data?.user);
                    if (fetchedUser) {
                        setUser(fetchedUser);
                        localStorage.setItem(USER_KEY, JSON.stringify(fetchedUser));
                        if (fetchedUser.id) localStorage.setItem(USER_ID_KEY, String(fetchedUser.id));
                        if (fetchedUser.role) localStorage.setItem('userRole', String(fetchedUser.role));
                    }
                }

                setIsAuthenticated(true);
            } catch (err) {
                console.error('Failed to bootstrap auth state:', err);
                localStorage.removeItem(TOKEN_KEY);
                localStorage.removeItem(USER_ID_KEY);
                localStorage.removeItem(USER_KEY);
                localStorage.removeItem('userRole');
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, []);

    const persistAuth = (nextUser: AuthUser | null, token?: string) => {
        if (token) localStorage.setItem(TOKEN_KEY, token);
        if (nextUser) {
            localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
            if (nextUser.id) localStorage.setItem(USER_ID_KEY, String(nextUser.id));
            if (nextUser.role) localStorage.setItem("userRole", String(nextUser.role));
        }
        setUser(nextUser);
        setIsAuthenticated(Boolean(token || nextUser));
    };

    const loginUser = async (identifier: string, password: string) => {
        setLoading(true);
        try {
            if (!identifier || !password) throw new Error("Username/Email and password are required");
            // هنا الـ API لازم يكون قادر يتعامل مع identifier سواء كان email أو username
            const response = await login(identifier, password);
            const nextUser = normalizeUser(response.data?.user);
            persistAuth(nextUser, response.data?.token);
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
            setUser(null);
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_ID_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem("userRole");
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
            const response = await register(data);
            const nextUser = normalizeUser(response.data?.user);
            persistAuth(nextUser, response.data?.token);
        } catch (err) {
            console.error("Register failed:", err);
            setIsAuthenticated(false);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        isAuthenticated,
        loading,
        user,
        loginUser,
        logoutUser,
        registerUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};