// controllers/productController.js
// This file contains the business logic for handling product-related requests.

import db from '../config/db.js';

// --- Controller Functions ---

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
    try {
        const sql = `
            SELECT p.*, s.supplier_name 
            FROM Products p 
            LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id
            ORDER BY p.product_name;
        `;
        const [products] = await db.query(sql);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error while fetching products.' });
    }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT p.*, s.supplier_name 
            FROM Products p 
            LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id 
            WHERE p.product_id = ?;
        `;
        const [product] = await db.query(sql, [id]);

        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(product[0]);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Server error while fetching product.' });
    }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
    try {
        // Use 'let' to allow modification of expiry_date
        let {
            product_name, category, brand, unit, cost_price, selling_price,
            quantity_in_stock, expiry_date, low_stock_threshold, supplier_id
        } = req.body;
        
        // Basic validation
        if (!product_name || !selling_price || !quantity_in_stock || !cost_price || !unit) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }
        
        // --- THE FIX IS HERE ---
        // If expiry_date is sent as an empty string, convert it to null for the database.
        if (expiry_date === '') {
            expiry_date = null;
        }

        const sql = `
            INSERT INTO Products (product_name, category, brand, unit, cost_price, selling_price, quantity_in_stock, expiry_date, low_stock_threshold, supplier_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [
            product_name, category, brand, unit, cost_price, selling_price,
            quantity_in_stock, expiry_date, low_stock_threshold, supplier_id
        ];

        const [result] = await db.query(sql, values);
        res.status(201).json({ message: 'Product created successfully!', productId: result.insertId });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error while creating product.' });
    }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Use 'let' to allow modification of expiry_date
        let {
            product_name, category, brand, unit, cost_price, selling_price,
            quantity_in_stock, expiry_date, low_stock_threshold, supplier_id
        } = req.body;

        // --- THE FIX IS ALSO APPLIED HERE FOR CONSISTENCY ---
        if (expiry_date === '') {
            expiry_date = null;
        }

        const sql = `
            UPDATE Products SET 
            product_name = ?, category = ?, brand = ?, unit = ?, cost_price = ?, 
            selling_price = ?, quantity_in_stock = ?, expiry_date = ?, 
            low_stock_threshold = ?, supplier_id = ?, updated_at = CURRENT_TIMESTAMP
            WHERE product_id = ?;
        `;
        const values = [
            product_name, category, brand, unit, cost_price, selling_price,
            quantity_in_stock, expiry_date, low_stock_threshold, supplier_id, id
        ];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found or no new data to update.' });
        }
        res.status(200).json({ message: 'Product updated successfully!' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error while updating product.' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM Products WHERE product_id = ?;';
        
        const [result] = await db.query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Cannot delete product. It is referenced by existing bills or orders.' });
        }
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error while deleting product.' });
    }
};
