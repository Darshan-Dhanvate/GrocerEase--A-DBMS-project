// frontend/src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- THIS IS THE NEW PART: The Request Interceptor ---
// This function will run before every single request is sent from our frontend.
apiClient.interceptors.request.use(
  (config) => {
    // 1. Get the token from localStorage.
    const token = localStorage.getItem('token');
    
    // 2. If the token exists, add it to the 'Authorization' header.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // 3. Return the modified request configuration.
    return config;
  },
  (error) => {
    // Handle any errors that occur during the request setup.
    return Promise.reject(error);
  }
);

export default apiClient;