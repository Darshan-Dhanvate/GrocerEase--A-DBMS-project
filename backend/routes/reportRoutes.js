// backend/routes/reportRoutes.js
// Defines API endpoints for generating various reports.

import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // <-- ADD THIS LINE
import {
    getDailySalesReport,
    getLowStockReport,
    getExpiryAlertReport,
    getTopSellingProducts,
    getSalesByCategory  // <-- IMPORT the new function
} from '../controllers/reportController.js';

const router = express.Router();

// --- Report Routes ---

// Route to get a summary of sales for the current day
router.get('/sales/daily', protect, getDailySalesReport);

// Route to get a list of products that are below their low-stock threshold
router.get('/stock/low', protect, getLowStockReport);

// Route to get a list of products expiring soon (e.g., within the next 30 days)
router.get('/stock/expiring', protect, getExpiryAlertReport);

// --- NEW ROUTE ---
// Route for the product recommender system
router.get('/top-products', protect, getTopSellingProducts);

// Route for the sales-by-category pie chart data
router.get('/sales-by-category', protect, getSalesByCategory);

export default router;