// api.ts
import { authClient } from "@/lib/auth-client";
import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Add request interceptor to attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = authClient.getToken();
    if (token) {
      if (!authClient.isAuthenticated()) {
        authClient.logout();
        return Promise.reject(new Error("Token expired"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh and error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token here if you have refresh token logic
      // await refreshToken();

      // Retry the original request with new token
      return api(originalRequest);
    }

    if (error.response?.status === 429) {
      // Rate limiting handling
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
