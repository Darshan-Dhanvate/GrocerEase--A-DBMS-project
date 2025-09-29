// routes/productRoutes.js
import express from 'express';
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
    .get(getAllProducts)
    .post(createProduct);

// --- MODIFIED ---
// We now have two distinct endpoints for deletion to ensure safety.

// This route is for deactivating a product (soft delete).
// We'll keep using the standard DELETE verb for this common action.
router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deactivateProduct); // Changed from deleteProduct

// This is a new, specific route for permanent deletion.
router.route('/permanent-delete/:id')
    .delete(permanentlyDeleteProduct);

export default router;
