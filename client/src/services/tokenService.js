import api from './api';
import { jwtDecode } from 'jwt-decode';

// Token storage keys
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'token_expiry';

// Get token from localStorage
export const getToken = () => localStorage.getItem(TOKEN_KEY);

// Set token in localStorage with expiry
export const setToken = (token) => {
  try {
    // Decode token to get expiry
    const decoded = jwtDecode(token);
    const expiryDate = new Date(decoded.exp * 1000);
    
    // Store token and expiry
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
    
    return true;
  } catch (error) {
    console.error('Error setting token:', error);
    return false;
  }
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  localStorage.removeItem(USER_KEY);
};

// Check if token is valid
export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const expiryStr = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryStr) return false;
    
    const expiry = new Date(expiryStr);
    const now = new Date();
    
    // Add 5 minute buffer for refresh
    const refreshBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
    const shouldRefresh = (expiry.getTime() - now.getTime()) < refreshBuffer;
    
    // Token is expired
    if (expiry <= now) {
      removeToken();
      return false;
    }
    
    // Token needs refresh
    if (shouldRefresh) {
      refreshToken();
    }
    
    return true;
  } catch (error) {
    console.error('Error validating token:', error);
    removeToken();
    return false;
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

// Initialize token refresh timer
export const initTokenRefresh = () => {
  // Check token every minute
  const intervalId = setInterval(() => {
    if (getToken()) {
      isTokenValid();
    } else {
      clearInterval(intervalId);
    }
  }, 60000);
  
  return intervalId;
};