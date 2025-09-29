// frontend/src/services/customerService.js
// This file centralizes all API calls for fetching customer data.

import apiClient from './api.js';

/**
 * Fetches a list of all customers from the backend.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getAllCustomers = async () => {
    try {
        const response = await apiClient.get('/customers');
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};