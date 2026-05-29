import api from '../services/api';

export const userService = {
  getProfile: () => api.get('/users/profile'),
  getOrdersCount: () => api.get('/users/orders/count'),
  getStats: () => api.get('/users/stats'),
  updateProfile: (data: Partial<{ name: string; address: string; phoneNumber: string }>) =>
    api.put('/users/profile', data),
};
