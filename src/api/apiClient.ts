
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Spring Boot default port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in requests
apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response && response.status === 401) {
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    } else if (response && response.status === 403) {
      // Forbidden
      toast.error('You do not have permission to perform this action');
    } else if (response && response.status >= 500) {
      // Server error
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
