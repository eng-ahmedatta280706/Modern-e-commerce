import type { CartItem } from './CartItem';

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type ShippingMethod = 'standard' | 'express' | 'pickup';
export type PaymentMethod = 'card' | 'paypal' | 'cod';

export interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  country: string;
}

export interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  trackingNumber?: string;
}

export const SHIPPING_COSTS: Record<ShippingMethod, number> = {
  standard: 5,
  express: 15,
  pickup: 0,
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'text-yellow-600 bg-yellow-100',
  processing: 'text-blue-600 bg-blue-100',
  shipped: 'text-purple-600 bg-purple-100',
  delivered: 'text-green-600 bg-green-100',
  cancelled: 'text-red-600 bg-red-100',
  refunded: 'text-gray-600 bg-gray-100',
};
