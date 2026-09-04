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
    api.post('/auth/login', payload.identifier.includes("@") ?
      { email: payload.identifier, password: payload.password } :
      { username: payload.identifier, password: payload.password }),

  register: (payload: RegisterPayload) =>
    api.post('/auth/register', payload),

  logout: () =>
    api.post('/auth/logout'),

  refreshToken: () =>
    api.post('/auth/refresh'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};
