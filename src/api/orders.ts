import axios from "axios";

export const createOrder = (items: any, shippingMethod: string) =>
    axios.post("/api/orders", { items, shippingMethod });

export const getOrders = () => axios.get("/api/orders");