import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken, isTokenValid, removeToken } from './tokenService';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a request interceptor to set auth token
api.interceptors.request.use(
  (config) => {
    // Validate token before each request
    if (isTokenValid()) {
      const token = getToken();
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized errors
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth data and redirect to login
      removeToken();
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Handle 429 Too Many Requests with retry
    if (error.response.status === 429 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Wait for 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      return api(originalRequest);
    }
    
    // Handle server errors
    if (error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

// Function to add retry capability
export const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  let retries = 0;
  
  const executeCall = async () => {
    try {
      return await apiCall();
    } catch (error) {
      if (retries < maxRetries && (!error.response || error.response.status >= 500)) {
        retries++;
        // Exponential backoff
        const retryDelay = delay * Math.pow(2, retries - 1);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return executeCall();
      }
      throw error;
    }
  };
  
  return executeCall();
};

export default api;