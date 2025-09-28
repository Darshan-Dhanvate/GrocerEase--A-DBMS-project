// src/utils/formatters.js
// This file contains helper functions for formatting data consistently throughout the app.

/**
 * Formats a number or a string-based number into the Indian Rupee currency format.
 * @param {number | string} amount - The amount to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (amount) => {
    // --- THIS IS THE CORRECTED LOGIC ---
    // 1. Convert the incoming amount (which might be a string) to a floating-point number.
    const numericAmount = parseFloat(amount);

    // 2. Check if the result is a valid number. If not, return a default value.
    if (isNaN(numericAmount)) {
        return '₹0.00';
    }

    // 3. Format the now-guaranteed numeric value.
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(numericAmount);
};

/**
 * Formats a date string or Date object into a more readable format (e.g., 24 Sep 2025).
 * @param {string | Date} dateString - The date to format.
 * @returns {string} The formatted date string, or 'N/A' if the date is invalid.
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return 'N/A';
    }

    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
};