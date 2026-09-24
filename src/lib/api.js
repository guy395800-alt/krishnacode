import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://krishnacodebackend.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to inject JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('nexgen_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('nexgen_access_token');
        localStorage.removeItem('nexgen_user');
        window.location.href = '/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export const getExportUrl = (path) => {
  const base = process.env.NEXT_PUBLIC_API_URL || 'https://krishnacodebackend.onrender.com/api/v1';
  const token = typeof window !== 'undefined' ? localStorage.getItem('nexgen_access_token') : null;
  return token ? `${base}/analytics/export/${path}?token=${token}` : `${base}/analytics/export/${path}`;
};
