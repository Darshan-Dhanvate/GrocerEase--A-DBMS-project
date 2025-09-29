// frontend/src/services/adminService.js
// This file centralizes all API calls for administrative tasks.

import apiClient from './api.js';

/**
 * Sends a request to the backend to clear all transaction history.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const clearTransactionHistory = async () => {
    try {
        // We use the DELETE method as this is a destructive action.
        const response = await apiClient.delete('/admin/clear-history');
        return response.data;
    } catch (error) {
        console.error("Error clearing transaction history:", error);
        // Rethrow the error so the component can catch it and show a message
        throw error;
    }
};