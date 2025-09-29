// src/services/productService.js
// This file centralizes all API calls related to products.

import apiClient from './api.js';

/**
 * --- MODIFIED ---
 * Fetches products from the backend, with an optional view filter.
 * @param {string} view - The filter to apply (e.g., 'unavailable', 'all'). Defaults to only sellable items.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getAllProducts = async (view = 'default') => {
    try {
        // We use query params to tell the backend which filter to apply.
        const response = await apiClient.get(`/products?view=${view}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

/**
 * Creates a new product.
 * @param {Object} productData - The data for the new product.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const createProduct = async (productData) => {
    try {
        const response = await apiClient.post('/products', productData);
        return response.data;
    } catch (error) {
        console.error("Error creating product:", error);
        throw error;
    }
};

/**
 * Updates an existing product.
 * @param {number} id - The ID of the product to update.
 * @param {Object} productData - The updated data for the product.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const updateProduct = async (id, productData) => {
    try {
        const response = await apiClient.put(`/products/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error(`Error updating product ${id}:`, error);
        throw error;
    }
};

/**
 * --- RENAMED from deleteProduct to deactivateProduct ---
 * Deactivates a product (soft delete).
 * @param {number} id - The ID of the product to deactivate.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const deactivateProduct = async (id) => {
    try {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deactivating product ${id}:`, error);
        throw error;
    }
};

/**
 * --- NEW FUNCTION ---
 * Permanently deletes a product from the database.
 * @param {number} id - The ID of the product to permanently delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const permanentlyDeleteProduct = async (id) => {
    try {
        const response = await apiClient.delete(`/products/permanent-delete/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error permanently deleting product ${id}:`, error);
        throw error;
    }
};