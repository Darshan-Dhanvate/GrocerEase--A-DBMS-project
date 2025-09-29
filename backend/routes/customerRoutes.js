// backend/routes/customerRoutes.js
// This file defines the API endpoints for customer-related actions.

import express from 'express';
import { getAllCustomers } from '../controllers/customerController.js';

const router = express.Router();

// Define the route for getting all customers.
router.get('/', getAllCustomers);

export default router;