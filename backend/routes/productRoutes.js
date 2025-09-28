// routes/productRoutes.js
// This file defines the API endpoints (routes) related to products.
// It maps each route to a specific controller function.

import express from 'express';
const router = express.Router();

// Import the controller functions that will handle the request logic
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

// Define the routes for the /api/products endpoint

// Chaining routes for the same path '/'
// GET /api/products -> Fetches all products
// POST /api/products -> Creates a new product
router.route('/')
    .get(getAllProducts)
    .post(createProduct);

// Chaining routes for a specific product ID '/:id'
// GET /api/products/:id -> Fetches a single product
// PUT /api/products/:id -> Updates a single product
// DELETE /api/products/:id -> Deletes a single product
router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

// Export the router to be used in the main server.js file
export default router;
