import apiClient from './apiClient';
import { useNotifications } from '../components/NotificationProvider';

export const authService = {
  async login(email, password) {
    console.log('Base URL:', apiClient.defaults.baseURL);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      return user;
    } catch (error) {
        console.error('Full error:', error.response || error);
      throw error.response ? error.response.data : new Error('Login failed');
    }
  },

  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Store token and user info
      localStorage.setItem('token', token);
      return user;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  },

  logout() {
    localStorage.removeItem('token');
  },

  async validateToken() {
    try {
      const response = await apiClient.get('/auth/validate');
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  },

  async forgotPassword(email) {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Password reset failed');
    }
  }
};