import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.0.7:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});