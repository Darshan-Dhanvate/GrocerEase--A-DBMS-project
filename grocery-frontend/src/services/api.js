// src/services/api.js
// This file configures a centralized Axios client for all our backend API requests.

import axios from 'axios';

// Create an instance of Axios with a predefined base URL.
// This means we don't have to type 'http://localhost:3001/api' for every request.
const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  OPTIONAL: Interceptors
  Interceptors allow you to run code before a request is sent or after a response is received.
  This is useful for things like automatically adding an authentication token to every
  request or for centralized error handling. For now, we will keep it simple.

  apiClient.interceptors.request.use(config => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  });
*/

export default apiClient;