import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const errorMessage = (error.response?.data as any)?.message || 'An error occurred';
    
    switch (error.response?.status) {
      case 401:
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please log in again.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 409:
        toast.error(errorMessage);
        break;
      case 422:
        toast.error('Invalid data provided');
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
