// frontend/src/services/authService.js
import apiClient from './api.js';

/**
 * Sends a login request to the backend.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} - The response data, including the token and user info.
 */
export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        // If login is successful, store the token and user data
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    } catch (error) {
        console.error("Login service error:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Sends a signup request to the backend.
 * @param {object} userData - { name, email, password }
 * @returns {Promise<object>} - The response data.
 */
export const signup = async (userData) => {
    try {
        const response = await apiClient.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        console.error("Signup service error:", error.response?.data || error.message);
        throw error.response?.data || error;
    }
};

/**
 * Logs the user out by removing their data from local storage.
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};