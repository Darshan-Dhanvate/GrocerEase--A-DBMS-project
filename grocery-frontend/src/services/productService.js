// src/services/productService.js
// This file centralizes all API calls related to products.

import apiClient from './api';

/**
 * Fetches all products from the backend.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getAllProducts = async () => {
    try {
        const response = await apiClient.get('/products');
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
 * Deletes a product.
 * @param {number} id - The ID of the product to delete.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const deleteProduct = async (id) => {
    try {
        const response = await apiClient.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting product ${id}:`, error);
        throw error;
    }
};