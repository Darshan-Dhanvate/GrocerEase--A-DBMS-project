// controllers/reportController.js
// Contains the logic for generating sales and inventory reports.

import db from '../config/db.js';

// @desc    Get top-selling products based on a time period
// @route   GET /api/reports/top-products?period=7days
// @access  Private/Admin
export const getTopSellingProducts = async (req, res) => {
    try {
        const { period } = req.query; // e.g., '7days', '30days', 'alltime'
        let whereClause = '';

        // Dynamically build the date filter for the SQL query
        if (period === '7days') {
            whereClause = `WHERE b.bill_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`;
        } else if (period === '30days') {
            whereClause = `WHERE b.bill_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`;
        }
        // If 'alltime' or anything else, the whereClause remains empty, so all bills are included.

        const sql = `
            SELECT 
                p.product_name,
                p.brand,
                SUM(bi.quantity_sold) AS total_quantity_sold
            FROM Bill_Items bi
            JOIN Products p ON bi.product_id = p.product_id
            JOIN Bills b ON bi.bill_id = b.bill_id
            ${whereClause}
            GROUP BY p.product_id, p.product_name, p.brand
            ORDER BY total_quantity_sold DESC
            LIMIT 10; 
        `; // We limit to the top 10 products

        const [topProducts] = await db.query(sql);
        res.status(200).json(topProducts);

    } catch (error) {
        console.error('Error generating top-selling products report:', error);
        res.status(500).json({ message: 'Server error while generating report.' });
    }
};

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

// @desc    Get daily sales grouped by category for the pie chart
// @route   GET /api/reports/sales-by-category
// @access  Private/Admin
export const getSalesByCategory = async (req, res) => {
    try {
        const sql = `
            SELECT 
                COALESCE(p.category, 'Uncategorized') as category,
                SUM(bi.total_price) as total_sales
            FROM Bill_Items bi
            JOIN Bills b ON bi.bill_id = b.bill_id
            JOIN Products p ON bi.product_id = p.product_id
            WHERE DATE(b.bill_date) = CURDATE()
            GROUP BY p.category
            ORDER BY total_sales DESC;
        `;

        const [categorySales] = await db.query(sql);
        res.status(200).json(categorySales);

    } catch (error) {
        console.error('Error generating sales by category report:', error);
        res.status(500).json({ message: 'Server error while generating category report.' });
    }
};
