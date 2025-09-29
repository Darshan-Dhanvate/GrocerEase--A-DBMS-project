// backend/controllers/customerController.js
// This file contains the business logic for handling customer-related requests.

import db from '../config/db.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin
export const getAllCustomers = async (req, res) => {
    try {
        // A simple query to get all customers, ordered by name.
        const sql = 'SELECT * FROM Customers ORDER BY customer_name;';
        const [customers] = await db.query(sql);
        res.status(200).json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).json({ message: 'Server error while fetching customers.' });
    }
};