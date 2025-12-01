import axios from 'axios';
import { API_URL } from '../configs/env';

// Axios instance configured with base URL and interceptors
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Optionally handle 401 to redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // Token expired or unauthorized
      // You can dispatch a logout or navigate to login
      // window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Convenience wrappers
export const get = (url, config) => api.get(url, config);
export const post = (url, data, config) => api.post(url, data, config);
export const put = (url, data, config) => api.put(url, data, config);
export const del = (url, config) => api.delete(url, config);
