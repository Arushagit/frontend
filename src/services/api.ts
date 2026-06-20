/**
 * Axios API service with JWT token management.
 *
 * Features:
 * - Base URL from VITE_API_URL environment variable
 * - Auto-attaches Bearer token to every request
 * - Auto-refreshes access token on 401 errors
 * - Redirects to /admin/login on refresh failure
 */
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api';

// ─── Token Helpers ──────────────────────────────────────────────────────────────
export const getAccessToken = (): string | null => localStorage.getItem('crm_access');
export const getRefreshToken = (): string | null => localStorage.getItem('crm_refresh');
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('crm_access', access);
  localStorage.setItem('crm_refresh', refresh);
};
export const clearTokens = () => {
  localStorage.removeItem('crm_access');
  localStorage.removeItem('crm_refresh');
  localStorage.removeItem('crm_admin');
};
export const isAuthenticated = (): boolean => !!getAccessToken();

// ─── Axios Instance ─────────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor — Attach Token ────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — Auto Refresh on 401 ────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error('No refresh token');

        const { data } = await axios.post(`${BASE_URL}/admin/token/refresh/`, { refresh });
        const newAccess = data.access;

        localStorage.setItem('crm_access', newAccess);
        api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── API Methods ────────────────────────────────────────────────────────────────

/** Submit contact form (public) */
export const submitContactForm = (data: { name: string; email: string; message: string }) =>
  api.post('/contact/', data);

/** Admin login */
export const adminLogin = (username: string, password: string) =>
  api.post('/admin/login/', { username, password });

/** Get dashboard stats */
export const getDashboardStats = () => api.get('/admin/stats/');

/** List enquiries with optional filters */
export const getEnquiries = (params?: {
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
}) => api.get('/admin/enquiries/', { params });

/** Get single enquiry */
export const getEnquiry = (id: number) => api.get(`/admin/enquiries/${id}/`);

/** Update enquiry status */
export const updateEnquiryStatus = (id: number, status: string) =>
  api.patch(`/admin/enquiries/${id}/`, { status });

/** Delete enquiry */
export const deleteEnquiry = (id: number) => api.delete(`/admin/enquiries/${id}/`);

export default api;
