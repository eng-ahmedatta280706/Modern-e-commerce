import axios from "axios";

export const getUserProfile = () => axios.get("/api/users/profile");

export const getUserOrdersCount = () => axios.get("/api/users/orders/count");

export const getUserStats = () => axios.get("/api/users/stats");

export const updateUserProfile = (profileData: any) =>
    axios.put("/api/users/profile", profileData);

export const changeUserPassword = (currentPassword: string, newPassword: string) =>
    axios.post("/api/users/change-password", { currentPassword, newPassword });

export const deleteUserAccount = () => axios.delete("/api/users/profile");

export const getUserAddresses = () => axios.get("/api/users/addresses");

export const addUserAddress = (addressData: any) =>
    axios.post("/api/users/addresses", addressData);

export const updateUserAddress = (addressId: string, addressData: any) =>
    axios.put(`/api/users/addresses/${addressId}`, addressData);

export const deleteUserAddress = (addressId: string) => axios.delete(`/api/users/addresses/${addressId}`);