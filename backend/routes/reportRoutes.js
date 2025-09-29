// backend/routes/reportRoutes.js
// Defines API endpoints for generating various reports.

import express from 'express';
import {
    getDailySalesReport,
    getLowStockReport,
    getExpiryAlertReport,
    getTopSellingProducts // <-- IMPORT the new function
} from '../controllers/reportController.js';

const router = express.Router();

// --- Report Routes ---

// Route to get a summary of sales for the current day
router.get('/sales/daily', getDailySalesReport);

// Route to get a list of products that are below their low-stock threshold
router.get('/stock/low', getLowStockReport);

// Route to get a list of products expiring soon (e.g., within the next 30 days)
router.get('/stock/expiring', getExpiryAlertReport);

// --- NEW ROUTE ---
// Route for the product recommender system
router.get('/top-products', getTopSellingProducts);

export default router;