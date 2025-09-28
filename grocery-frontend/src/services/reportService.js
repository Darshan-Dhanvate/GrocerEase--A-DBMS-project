// src/services/reportService.js
// This file centralizes all API calls for generating reports.

import apiClient from './api';

/**
 * Fetches the daily sales report.
 * @returns {Promise<Object>} A promise that resolves to the report data.
 */
export const getDailySalesReport = async () => {
    try {
        const response = await apiClient.get('/reports/sales/daily');
        return response.data;
    } catch (error) {
        console.error("Error fetching daily sales report:", error);
        throw error;
    }
};

/**
 * Fetches the low stock report.
 * @returns {Promise<Array>} A promise that resolves to an array of low stock items.
 */
export const getLowStockReport = async () => {
    try {
        const response = await apiClient.get('/reports/stock/low');
        return response.data;
    } catch (error) {
        console.error("Error fetching low stock report:", error);
        throw error;
    }
};

/**
 * Fetches the report of items expiring soon.
 * @returns {Promise<Array>} A promise that resolves to an array of expiring items.
 */
export const getExpiringReport = async () => {
    try {
        const response = await apiClient.get('/reports/stock/expiring');
        return response.data;
    } catch (error) {
        console.error("Error fetching expiring report:", error);
        throw error;
    }
};
