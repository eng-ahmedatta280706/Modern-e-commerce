import axios from "axios";

export const getUserProfile = () => axios.get("/api/users/profile");

export const getUserOrdersCount = () => axios.get("/api/users/orders/count");

export const getUserStats = () => axios.get("/api/users/stats");