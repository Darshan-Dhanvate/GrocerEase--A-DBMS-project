// src/services/billingService.js
// This file centralizes all API calls related to billing and sales transactions.

import apiClient from './api';

/**
 * Creates a new bill by sending the cart items and details to the backend.
 * @param {Object} billData - The data for the new bill, including items.
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

/**
 * Fetches the details of a single bill by its ID.
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
