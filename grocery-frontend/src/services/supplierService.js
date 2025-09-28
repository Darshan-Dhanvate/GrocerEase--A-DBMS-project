// src/services/supplierService.js
// This file centralizes all API calls related to suppliers.

import apiClient from './api';

/**
 * Fetches all suppliers from the backend.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getAllSuppliers = async () => {
    try {
        const response = await apiClient.get('/suppliers');
        return response.data;
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        throw error;
    }
};

/**
 * Creates a new supplier.
 * @param {Object} supplierData - The data for the new supplier.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const createSupplier = async (supplierData) => {
    try {
        const response = await apiClient.post('/suppliers', supplierData);
        return response.data;
    } catch (error) {
        console.error("Error creating supplier:", error);
        throw error;
    }
};

/**
 * Updates an existing supplier.
 * @param {number} id - The ID of the supplier to update.
 * @param {Object} supplierData - The updated data for the supplier.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const updateSupplier = async (id, supplierData) => {
    try {
        const response = await apiClient.put(`/suppliers/${id}`, supplierData);
        return response.data;
    } catch (error) {
        console.error(`Error updating supplier ${id}:`, error);
        throw error;
    }
};

/**
 * Deletes a supplier.
 * @param {number} id - The ID of the supplier to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const deleteSupplier = async (id) => {
    try {
        const response = await apiClient.delete(`/suppliers/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting supplier ${id}:`, error);
        throw error;
    }
};
