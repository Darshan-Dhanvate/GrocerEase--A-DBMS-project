// controllers/reportController.js
// Contains the logic for generating sales and inventory reports.

import db from '../config/db.js';

// @desc    Get daily sales report
// @route   GET /api/reports/sales/daily
// @access  Private/Admin
export const getDailySalesReport = async (req, res) => {
    try {
        const sql = `
            SELECT 
                COUNT(bill_id) AS total_bills,
                SUM(net_amount) AS total_sales
            FROM Bills
            WHERE DATE(bill_date) = CURDATE();
        `;
        const [report] = await db.query(sql);

        // --- THE FIX IS HERE ---
        // Safely check if the report has a row before trying to access its data.
        // This handles the edge case of a completely empty Bills table.
        const reportData = (report && report.length > 0) ? report[0] : { total_bills: 0, total_sales: null };

        const dailyReport = {
            total_bills: reportData.total_bills || 0,
            total_sales: reportData.total_sales || 0.00
        };

        res.status(200).json(dailyReport);
    } catch (error) {
        console.error('Error generating daily sales report:', error);
        res.status(500).json({ message: 'Server error while generating daily sales report.' });
    }
};

// @desc    Get low stock report
// @route   GET /api/reports/stock/low
// @access  Private/Admin
export const getLowStockReport = async (req, res) => {
    try {
        const sql = `
            SELECT 
                product_id,
                product_name,
                brand,
                quantity_in_stock,
                low_stock_threshold
            FROM Products
            WHERE quantity_in_stock <= low_stock_threshold
            ORDER BY quantity_in_stock ASC;
        `;
        const [lowStockItems] = await db.query(sql);
        res.status(200).json(lowStockItems);
    } catch (error) {
        console.error('Error generating low stock report:', error);
        res.status(500).json({ message: 'Server error while generating low stock report.' });
    }
};

// @desc    Get expiry alert report
// @route   GET /api/reports/stock/expiring
// @access  Private/Admin
export const getExpiryAlertReport = async (req, res) => {
    try {
        const sql = `
            SELECT
                product_id,
                product_name,
                brand,
                quantity_in_stock,
                expiry_date
            FROM Products
            WHERE expiry_date IS NOT NULL
              AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
            ORDER BY expiry_date ASC;
        `;
        const [expiringItems] = await db.query(sql);
        res.status(200).json(expiringItems);
    } catch (error) {
        console.error('Error generating expiry alert report:', error);
        res.status(500).json({ message: 'Server error while generating expiry alert report.' });
    }
};
