/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response: any) => response,
  (error: { response: { status: number; data: { message: any; }; }; }) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    const apiMessage = error.response?.data?.message;
    if (apiMessage) {
      const enriched: any = new Error(apiMessage);
      enriched.response = error.response;
      return Promise.reject(enriched);
    }
    return Promise.reject(error);
  }
);

export default http;
