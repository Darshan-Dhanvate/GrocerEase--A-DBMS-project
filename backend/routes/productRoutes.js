// routes/productRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // <-- ADD THIS LINE
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deactivateProduct, // Renamed from deleteProduct
    permanentlyDeleteProduct // New function
} from '../controllers/productController.js';

const router = express.Router();

// This route remains the same for getting all (filtered) products and creating new ones.
router.route('/')
    .get(protect, getAllProducts)
    .post(protect, createProduct);

// --- MODIFIED ---
// We now have two distinct endpoints for deletion to ensure safety.

// This route is for deactivating a product (soft delete).
// We'll keep using the standard DELETE verb for this common action.
router.route('/:id')
    .get(protect, getProductById)
    .put(protect, updateProduct)
    .delete(protect, deactivateProduct); // Changed from deleteProduct

// This is a new, specific route for permanent deletion.
router.route('/permanent-delete/:id')
    .delete(protect, permanentlyDeleteProduct);

export default router;
