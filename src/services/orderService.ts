import api from './api';
import type { CartItem } from '../types/CartItem';
import type { ShippingMethod, PaymentMethod } from '../types/Order';

export interface CreateOrderPayload {
  items: CartItem[];
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  couponCode?: string;
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

  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),

  applyCoupon: (orderId: string, couponCode: string) =>
    api.post(`/orders/${orderId}/apply-coupon`, { couponCode }),

  removeCoupon: (orderId: string) =>
    api.delete(`/orders/${orderId}/remove-coupon`),

  getOrderSummary: () =>
    api.get('/orders/summary'),
};
