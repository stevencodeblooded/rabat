// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL.replace('/v1', '') || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    // Handle specific error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired or invalid, attempt refresh or redirect to login
          localStorage.removeItem('token');
          window.location.href = '/auth';
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.error('Access Forbidden');
          break;
        case 500:
          // Server error
          console.error('Server Error');
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;