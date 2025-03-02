import api from './api';
import { useNavigate } from 'react-router-dom';

// Register a new user
export const register = async (username, password) => {
  try {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    const response = await api.post('/auth/register', { username, password });
    console.log('Response:', response);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    console.log('Error:', error);
    throw error.response?.data || { success: false, message: 'Registration failed' };
  }
};

// Login a user
export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

// Logout a user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  const baseUrl = process.env.PUBLIC_URL || '';
  window.location.href = `${baseUrl}/login`;
};

// Get current logged in user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Get user stats by username
export const getUserStats = async (username) => {
  try {
    const response = await api.get(`/auth/stats/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to get user stats' };
  }
};

// Get current user profile
export const getProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to get user profile' };
  }
};