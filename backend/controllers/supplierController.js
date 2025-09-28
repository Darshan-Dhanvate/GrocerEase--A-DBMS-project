// controllers/supplierController.js
// Contains the business logic for handling supplier-related requests.

import db from '../config/db.js'; // Import the database connection

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Public
export const getAllSuppliers = async (req, res) => {
    try {
        const sql = 'SELECT * FROM Suppliers ORDER BY supplier_name;';
        const [suppliers] = await db.query(sql);
        res.status(200).json(suppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).json({ message: 'Server error while fetching suppliers.' });
    }
};

// @desc    Get a single supplier by ID
// @route   GET /api/suppliers/:id
// @access  Public
export const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT * FROM Suppliers WHERE supplier_id = ?;';
        const [supplier] = await db.query(sql, [id]);

        if (supplier.length === 0) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json(supplier[0]);
    } catch (error) {
        console.error('Error fetching supplier by ID:', error);
        res.status(500).json({ message: 'Server error while fetching supplier.' });
    }
};

// @desc    Create a new supplier
// @route   POST /api/suppliers
// @access  Private/Admin
export const createSupplier = async (req, res) => {
    try {
        const { supplier_name, contact_person, contact_no, address } = req.body;

        if (!supplier_name || !contact_no) {
            return res.status(400).json({ message: 'Supplier name and contact number are required.' });
        }

        const sql = 'INSERT INTO Suppliers (supplier_name, contact_person, contact_no, address) VALUES (?, ?, ?, ?);';
        const values = [supplier_name, contact_person, contact_no, address];

        const [result] = await db.query(sql, values);
        res.status(201).json({ message: 'Supplier created successfully!', supplierId: result.insertId });
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).json({ message: 'Server error while creating supplier.' });
    }
};

// @desc    Update an existing supplier
// @route   PUT /api/suppliers/:id
// @access  Private/Admin
export const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { supplier_name, contact_person, contact_no, address } = req.body;

        const sql = `
            UPDATE Suppliers SET 
            supplier_name = ?, contact_person = ?, contact_no = ?, address = ?, updated_at = CURRENT_TIMESTAMP
            WHERE supplier_id = ?;
        `;
        const values = [supplier_name, contact_person, contact_no, address, id];

        const [result] = await db.query(sql, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found or no new data to update.' });
        }
        res.status(200).json({ message: 'Supplier updated successfully!' });
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).json({ message: 'Server error while updating supplier.' });
    }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
export const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'DELETE FROM Suppliers WHERE supplier_id = ?;';
        
        const [result] = await db.query(sql, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Supplier not found.' });
        }
        res.status(200).json({ message: 'Supplier deleted successfully!' });
    } catch (error) {
        // This handles cases where you can't delete a supplier because they are linked to products or orders
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Cannot delete supplier. They are referenced by existing products or orders.' });
        }
        console.error('Error deleting supplier:', error);
        res.status(500).json({ message: 'Server error while deleting supplier.' });
    }
};