import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor — attach auth token if present
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

/**
 * Sends a password reset request to the backend.
 *
 * Adjust the endpoint path to match your Express API.
 */

export interface ForgotPasswordResponse {
  message?: string;
}

export interface ForgotPasswordRequestOptions {
  signal?: AbortSignal;
}

export async function forgotPassword(
  email: string,
  options: ForgotPasswordRequestOptions = {}
): Promise<ForgotPasswordResponse> {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
    "http://localhost:5000/api";

  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email }),
    signal: options.signal,
  });

  let data: ForgotPasswordResponse | null = null;

  try {
    data = (await response.json()) as ForgotPasswordResponse;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || "Something went wrong while sending the reset link."
    );
  }

  return data ?? {};
}


