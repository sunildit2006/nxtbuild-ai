import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'https://nxtbuild-ai.onrender.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const get = (url, config = {}) => api.get(url, config);

export const post = (url, data, config = {}) =>
  api.post(url, data, config);

export const put = (url, data, config = {}) =>
  api.put(url, data, config);

export const del = (url, config = {}) =>
  api.delete(url, config);

export default api;