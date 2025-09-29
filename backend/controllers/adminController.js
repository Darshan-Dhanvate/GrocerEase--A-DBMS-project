// controllers/adminController.js
// This file will contain powerful administrative functions, like clearing data.

import db from '../config/db.js';

// @desc    Clear all transaction history (Bills and Bill_Items)
// @route   DELETE /api/admin/clear-history
// @access  Private/Admin
export const clearTransactionHistory = async (req, res) => {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Delete all records from Bill_Items first due to foreign key constraints.
        await connection.query('DELETE FROM Bill_Items');
        
        // 2. Delete all records from the main Bills table.
        await connection.query('DELETE FROM Bills');

        // 3. If both succeed, commit the transaction.
        await connection.commit();

        res.status(200).json({ message: 'All transaction history has been successfully cleared.' });

    } catch (error) {
        // 4. If any error occurs, roll back all changes.
        if (connection) await connection.rollback();
        console.error('Error clearing transaction history:', error);
        res.status(500).json({ message: 'Server error while clearing transaction history.' });
    } finally {
        // 5. Always release the connection back to the pool.
        if (connection) connection.release();
    }
};
