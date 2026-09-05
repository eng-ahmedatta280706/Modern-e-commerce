import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
  },
});

export interface ApiErrorBody {
  message?: string;
}

export interface ApiErrorResponse {
  data?: ApiErrorBody;
}

export interface ApiErrorLike {
  response?: ApiErrorResponse;
  code?: string;
  message?: string;
}

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong.',
): string => {
  const apiError = error as ApiErrorLike;
  return apiError.response?.data?.message ?? apiError.message ?? fallback;
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Sends a password reset request using the shared Axios client.
 */
export interface ForgotPasswordResponse {
  message?: string;
}

export interface ForgotPasswordRequestOptions {
  signal?: AbortSignal;
}

export async function forgotPassword(
  email: string,
  options: ForgotPasswordRequestOptions = {},
): Promise<ForgotPasswordResponse> {
  const { data } = await api.post<ForgotPasswordResponse>(
    '/auth/forgot-password',
    { email },
    { signal: options.signal },
  );

  return data ?? {};
}

export default api;
