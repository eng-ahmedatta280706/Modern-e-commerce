import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  ListOrdered,
  BarChart3,
  Bell,
  User2,
} from 'lucide-react';
import type { NavItem } from './DashboardLayout';

export const SELLER_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/seller', icon: <LayoutDashboard size={18} /> },
  { label: 'My Products', href: '/seller/products', icon: <ShoppingBag size={18} /> },
  { label: 'Orders', href: '/seller/orders', icon: <ListOrdered size={18} /> },
  { label: 'Analytics', href: '/seller/analytics', icon: <BarChart3 size={18} /> },
  { label: 'Notifications', href: '/seller/notifications', icon: <Bell size={18} /> },
  { label: 'Profile', href: '/seller/profile', icon: <User2 size={18} /> },
];

export default SELLER_NAV;
