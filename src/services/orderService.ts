import api from './api';
import type { CartItem } from '../types/CartItem';
import type { ShippingMethod, PaymentMethod } from '../types/Order';

export interface CreateOrderPayload {
  items: CartItem[];
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  shippingAddress: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
}

export const orderService = {
  createOrder: (payload: CreateOrderPayload) =>
    api.post('/orders', payload),

  getOrders: () =>
    api.get('/orders'),

  getOrderById: (id: string) =>
    api.get(`/orders/${id}`),

  cancelOrder: (id: string) =>
    api.patch(`/orders/${id}/cancel`),
};
