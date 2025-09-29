// frontend/src/services/reportService.js
// This file centralizes all API calls for generating reports.

import apiClient from './api.js';

/**
 * --- NEW FUNCTION ---
 * Fetches the top-selling products for a given time period.
 * @param {string} period - The time period ('7days', '30days', 'alltime').
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getTopSellingProducts = async (period) => {
    try {
        // We pass the selected period as a query parameter to the backend.
        const response = await apiClient.get(`/reports/top-products?period=${period}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top-selling products:", error);
        throw error;
    }
};

/**
 * Fetches the daily sales summary.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getDailySalesReport = async () => {
    try {
        const response = await apiClient.get('/reports/sales/daily');
        return response.data;
    } catch (error) {
        console.error("Error generating daily sales report:", error);
        throw error;
    }
};

/**
 * Fetches products that are low in stock.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getLowStockReport = async () => {
    try {
        const response = await apiClient.get('/reports/stock/low');
        return response.data;
    } catch (error) {
        console.error("Error generating low stock report:", error);
        throw error;
    }
};

/**
 * Fetches products that are expiring soon.
 * @returns {Promise<Object>} A promise that resolves to the server's response data.
 */
export const getExpiringReport = async () => {
    try {
        const response = await apiClient.get('/reports/stock/expiring');
        return response.data;
    } catch (error) {
        console.error("Error generating expiry alert report:", error);
        throw error;
    }
};