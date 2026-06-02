import api from "../services/api";

export const login = (identfire: string, password: string) => {
    return api.post("/auth/login", { email: identfire, password });
}

export const register = (data: { name?: string; username?: string; email?: string; password: string }) => {
    return api.post("/auth/register", data);
}

export const refreshToken = () => {
    return api.post("/auth/refresh");
}

export const logout = () => {
    return api.post("/auth/logout");
}