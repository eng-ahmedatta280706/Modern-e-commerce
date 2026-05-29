import api from './api';

export interface LoginPayload {
  identifier: string; // email or username
  password: string;
}

export interface RegisterPayload {
  name?: string;
  username?: string;
  email?: string;
  password: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post('/auth/login', { email: payload.identifier, password: payload.password }),

  register: (payload: RegisterPayload) =>
    api.post('/auth/register', payload),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: () =>
    api.post('/auth/refresh'),
};
