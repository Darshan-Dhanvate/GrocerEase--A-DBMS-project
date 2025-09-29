// controllers/productController.js
// This file contains the business logic for handling product-related requests.

import db from '../config/db.js';

// --- Controller Functions ---

// This function now intelligently filters products. By default, it only gets items
// that are active, in stock, and not expired - perfect for the POS.
// It also accepts a 'view' query parameter for the admin inventory page.
export const getAllProducts = async (req, res) => {
    try {
        const { view } = req.query; // e.g., ?view=unavailable or ?view=all

        let whereClause = `WHERE p.status = 'Active' AND p.quantity_in_stock > 0 AND (p.expiry_date IS NULL OR p.expiry_date >= CURDATE())`;

        if (view === 'unavailable') {
            whereClause = `WHERE p.status = 'Inactive' OR p.quantity_in_stock <= 0 OR p.expiry_date < CURDATE()`;
        } else if (view === 'all') {
            whereClause = ``; // No filter
        }

        const sql = `
            SELECT p.*, s.supplier_name 
            FROM Products p 
            LEFT JOIN Suppliers s ON p.supplier_id = s.supplier_id
            ${whereClause}
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

// @desc    Create a new product or reactivate an existing inactive one
// @route   POST /api/products
export const createProduct = async (req, res) => {
    try {
        let {
            product_name, category, brand, unit, cost_price, selling_price,
            quantity_in_stock, expiry_date, low_stock_threshold, supplier_id
        } = req.body;

        if (!product_name || !selling_price || !quantity_in_stock || !cost_price || !unit) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }
        
        if (expiry_date === '') {
            expiry_date = null;
        }

        // --- NEW LOGIC: CHECK FOR EXISTING PRODUCT ---
        const checkSql = `SELECT * FROM Products WHERE product_name = ? AND brand = ?`;
        const [existing] = await db.query(checkSql, [product_name, brand || '']);

        if (existing.length > 0) {
            const existingProduct = existing[0];
            // If product is already active, prevent duplicate creation
            if (existingProduct.status === 'Active') {
                return res.status(400).json({ message: `An active product named '${product_name}' from brand '${brand}' already exists.` });
            }

            // If product is inactive, reactivate and update it
            const reactivateSql = `
                UPDATE Products SET 
                status = 'Active', category = ?, unit = ?, cost_price = ?, 
                selling_price = ?, quantity_in_stock = ?, expiry_date = ?, 
                low_stock_threshold = ?, supplier_id = ?, updated_at = CURRENT_TIMESTAMP
                WHERE product_id = ?;
            `;
            const values = [
                category, unit, cost_price, selling_price,
                quantity_in_stock, expiry_date, low_stock_threshold, supplier_id,
                existingProduct.product_id
            ];
            await db.query(reactivateSql, values);
            return res.status(200).json({ message: 'Existing product reactivated and updated successfully!', productId: existingProduct.product_id });
        }

        // --- ORIGINAL LOGIC: CREATE NEW PRODUCT ---
        const createSql = `
            INSERT INTO Products (product_name, category, brand, unit, cost_price, selling_price, quantity_in_stock, expiry_date, low_stock_threshold, supplier_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [
            product_name, category, brand, unit, cost_price, selling_price,
            quantity_in_stock, expiry_date, low_stock_threshold, supplier_id
        ];

        const [result] = await db.query(createSql, values);
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

// This is now explicitly for deactivating.
export const deactivateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `UPDATE Products SET status = 'Inactive' WHERE product_id = ?;`;
        
        const [result] = await db.query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product deactivated successfully!' });
    } catch (error) {
        console.error('Error deactivating product:', error);
        res.status(500).json({ message: 'Server error while deactivating product.' });
    }
};

// This function handles the actual deletion from the database.
export const permanentlyDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Check if the product is part of any past transaction
        const checkSql = 'SELECT COUNT(*) as count FROM Bill_Items WHERE product_id = ?';
        const [rows] = await db.query(checkSql, [id]);
        
        if (rows[0].count > 0) {
            return res.status(400).json({ message: 'Cannot permanently delete. This product is part of a past transaction history.' });
        }

        // 2. If no history exists, proceed with deletion
        const deleteSql = 'DELETE FROM Products WHERE product_id = ?;';
        const [result] = await db.query(deleteSql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product permanently deleted successfully!' });

    } catch (error) {
        console.error('Error permanently deleting product:', error);
        res.status(500).json({ message: 'Server error during permanent deletion.' });
    }
};


