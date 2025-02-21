// src/services/apiClient.js
import axios from 'axios';

const baseURL = 'https://awake-flying-gecko.glitch.me/api';
console.log(baseURL)

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

console.log('API URL before replace:', process.env.REACT_APP_API_BASE_URL);

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
    console.log(originalRequest);

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