import axios from "axios";

export const login = (email: string, password: string) =>
    axios.post("/api/auth/login", { email, password });

export const register = (data: { name?: string; email?: string; password: string }) =>
    axios.post("/api/auth/register", data);

export const refreshToken = () => axios.post("/api/auth/refresh");

export const logout = () => axios.post("/api/auth/logout");