// routes/billingRoutes.js
// Defines the API endpoints for creating and retrieving bills.

import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // <-- ADD THIS LINE
const router = express.Router();

// We will create these controller functions in the next file
import {
    createBill,
    getAllBills,
    getBillById
} from '../controllers/billingController.js';

// --- Billing Routes ---

// Route for getting all bills and creating a new one
router.route('/')
    .get(protect, getAllBills)
    .post(protect, createBill);

// Route for getting a single bill by its ID
router.route('/:id')
    .get(protect, getBillById);

export default router;