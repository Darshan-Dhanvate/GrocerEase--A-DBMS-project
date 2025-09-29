// backend/controllers/billingController.js
// Contains the logic for processing sales and managing bills.

import db from '../config/db.js';

// @desc    Create a new bill and handle customer creation/linking
// @route   POST /api/billing
// @access  Private/Cashier
export const createBill = async (req, res) => {
    let connection;
    try {
        const {
            // New optional fields from the frontend
            customer_name,
            customer_mobile,
            // Existing fields
            discount_percentage,
            tax_percentage,
            items
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Cannot create a bill with no items.' });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        let customer_id = null;

        // --- NEW CUSTOMER LOGIC ---
        // Only process customer info if a name or mobile number is provided.
        if (customer_name || customer_mobile) {
            // Step 1: Check if a customer exists with the given mobile number.
            if (customer_mobile) {
                const [existingCustomer] = await connection.query('SELECT customer_id FROM Customers WHERE contact_no = ?', [customer_mobile]);
                if (existingCustomer.length > 0) {
                    customer_id = existingCustomer[0].customer_id;
                }
            }

            // Step 2: If no customer was found, create a new one.
            if (!customer_id && customer_name) { // A name is required to create a new customer
                const createCustomerSql = 'INSERT INTO Customers (customer_name, contact_no) VALUES (?, ?)';
                const [newCustomerResult] = await connection.query(createCustomerSql, [customer_name, customer_mobile || null]);
                customer_id = newCustomerResult.insertId;
            }
        }
        // --- END OF NEW CUSTOMER LOGIC ---


        // --- Stock Check & Calculation Logic (No Changes Here) ---
        let sub_total = 0;
        const itemPromises = items.map(async (item) => {
            const [productRows] = await connection.query('SELECT product_name, selling_price, quantity_in_stock FROM Products WHERE product_id = ?', [item.product_id]);
            if (productRows.length === 0) {
                throw new Error(`Product with ID ${item.product_id} not found.`);
            }
            const product = productRows[0];
            if (product.quantity_in_stock < item.quantity_sold) {
                throw new Error(`Not enough stock for ${product.product_name}. Available: ${product.quantity_in_stock}, Requested: ${item.quantity_sold}.`);
            }
            const total_price = product.selling_price * item.quantity_sold;
            sub_total += total_price;
            return { ...item, selling_price: product.selling_price, total_price };
        });

        const processedItems = await Promise.all(itemPromises);
        
        const discount_amount = sub_total * (discount_percentage / 100);
        const taxable_amount = sub_total - discount_amount;
        const tax_amount = taxable_amount * (tax_percentage / 100);
        const net_amount = taxable_amount + tax_amount;


        // --- MODIFIED: Insert into Bills Table ---
        // The customer_id (which can be null or a number) is now included.
        const billSql = 'INSERT INTO Bills (customer_id, sub_total, discount_percentage, discount_amount, tax_percentage, tax_amount, net_amount) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const billValues = [customer_id, sub_total, discount_percentage, discount_amount, tax_percentage, tax_amount, net_amount];
        const [billResult] = await connection.query(billSql, billValues);
        const newBillId = billResult.insertId;

        
        // --- Bill Items & Stock Update Logic (No Changes Here) ---
        const billItemPromises = processedItems.map(item => {
            const itemSql = 'INSERT INTO Bill_Items (bill_id, product_id, quantity_sold, price_per_unit, total_price) VALUES (?, ?, ?, ?, ?)';
            connection.query(itemSql, [newBillId, item.product_id, item.quantity_sold, item.selling_price, item.total_price]);
            
            const stockSql = 'UPDATE Products SET quantity_in_stock = quantity_in_stock - ? WHERE product_id = ?';
            connection.query(stockSql, [item.quantity_sold, item.product_id]);
        });
        await Promise.all(billItemPromises);


        // Commit and Release (No Changes Here)
        await connection.commit();
        res.status(201).json({ message: 'Bill created successfully!', billId: newBillId });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error creating bill:', error);
        res.status(500).json({ message: error.message || 'Server error while creating bill.' });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Get all bills
// @route   GET /api/billing
// @access  Public
export const getAllBills = async (req, res) => {
    try {
        const sql = `
            SELECT b.*, c.customer_name 
            FROM Bills b
            LEFT JOIN Customers c ON b.customer_id = c.customer_id
            ORDER BY b.bill_date DESC;
        `;
        const [bills] = await db.query(sql);
        res.status(200).json(bills);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ message: 'Server error while fetching bills.' });
    }
};

// @desc    Get a single bill with its items
// @route   GET /api/billing/:id
// @access  Public
export const getBillById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the main bill details
        const billSql = `
            SELECT b.*, c.customer_name, c.contact_no 
            FROM Bills b
            LEFT JOIN Customers c ON b.customer_id = c.customer_id
            WHERE b.bill_id = ?;
        `;
        const [bill] = await db.query(billSql, [id]);

        if (bill.length === 0) {
            return res.status(404).json({ message: 'Bill not found.' });
        }

        // Fetch the associated bill items
        const itemsSql = `
            SELECT bi.*, p.product_name, p.unit 
            FROM Bill_Items bi
            JOIN Products p ON bi.product_id = p.product_id
            WHERE bi.bill_id = ?;
        `;
        const [items] = await db.query(itemsSql, [id]);

        res.status(200).json({ ...bill[0], items });

    } catch (error) {
        console.error('Error fetching bill by ID:', error);
        res.status(500).json({ message: 'Server error while fetching bill details.' });
    }
};