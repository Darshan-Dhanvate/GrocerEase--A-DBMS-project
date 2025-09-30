// routes/adminRoutes.js
// This file defines the API endpoints for administrative actions.

import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // <-- ADD THIS LINE
import { clearTransactionHistory } from '../controllers/adminController.js';

const router = express.Router();

// Define the route for clearing history.
// We use the DELETE method as it's a destructive action.
router.delete('/clear-history', protect, clearTransactionHistory);

export default router;