// routes/supplierRoutes.js
// This file defines the API endpoints (routes) for managing suppliers.

import express from 'express';
const router = express.Router();

// We will create these controller functions in the next step
import {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier
} from '../controllers/supplierController.js';

// --- Supplier Routes ---

// Route for getting all suppliers and creating a new one
router.route('/')
    .get(getAllSuppliers)
    .post(createSupplier);

// Route for getting, updating, and deleting a single supplier by their ID
router.route('/:id')
    .get(getSupplierById)
    .put(updateSupplier)
    .delete(deleteSupplier);

export default router;