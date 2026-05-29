import axios from "axios";

export const login = (identfire: string, password: string) => {
    if (identfire.includes("@")) {
        return axios.post("/api/auth/login", { email: identfire, password });
    } else {
        return axios.post("/api/auth/login", { username: identfire, password });
    }
}

export const register = (data: { name?: string; username?: string; email?: string; password: string }) => {
    return axios.post("/api/auth/register", data);
}

export const refreshToken = () => {
    return axios.post("/api/auth/refresh");
}

export const logout = () => {
    return axios.post("/api/auth/logout");
}