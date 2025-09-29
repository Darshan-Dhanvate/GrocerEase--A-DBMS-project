// frontend/src/services/billingService.js
// This file centralizes all API calls related to billing.

import apiClient from './api.js';

/**
 * --- NEW FUNCTION ---
 * Fetches a list of all bills from the backend.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getAllBills = async () => {
    try {
        const response = await apiClient.get('/billing');
        return response.data;
    } catch (error) {
        console.error("Error fetching all bills:", error);
        throw error;
    }
};

/**
 * Fetches the full details for a single bill by its ID.
 * @param {number} id - The ID of the bill to fetch.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getBillById = async (id) => {
    try {
        const response = await apiClient.get(`/billing/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching bill ${id}:`, error);
        throw error;
    }
};

/**
 * Creates a new bill.
 * @param {Object} billData - The data for the new bill.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const createBill = async (billData) => {
    try {
        const response = await apiClient.post('/billing', billData);
        return response.data;
    } catch (error) {
        console.error("Error creating bill:", error);
        throw error;
    }
};