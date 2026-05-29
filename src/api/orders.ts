import axios from "axios";

export const createOrder = (items: any, shippingMethod: string) =>
    axios.post("/api/orders", { items, shippingMethod });

export const getOrders = () => axios.get("/api/orders");

export const getOrderById = (orderId: string) => axios.get(`/api/orders/${orderId}`);

export const updateOrderStatus = (orderId: string, status: string) =>
    axios.put(`/api/orders/${orderId}/status`, { status });

export const deleteOrder = (items: any, shippingMethod: string) =>
    axios.delete("/api/orders", { data: { items, shippingMethod } });