// routes/reportRoutes.js
// Defines API endpoints for generating various reports.

import express from 'express';
const router = express.Router();

// We will create these controller functions in the next file
import {
    getDailySalesReport,
    getLowStockReport,
    getExpiryAlertReport
} from '../controllers/reportController.js';


// --- Report Routes ---

// Route to get a summary of sales for the current day
router.get('/sales/daily', getDailySalesReport);

// Route to get a list of products that are below their low-stock threshold
router.get('/stock/low', getLowStockReport);

// Route to get a list of products expiring soon (e.g., within the next 30 days)
router.get('/stock/expiring', getExpiryAlertReport);


export default router;