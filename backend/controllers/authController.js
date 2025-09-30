// backend/controllers/authController.js
import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide name, email, and password.' });
        }

        // Check if user already exists
        const [existingUser] = await db.query('SELECT user_id FROM Users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the new user to the database
        const sql = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [name, email, hashedPassword]);

        res.status(201).json({ message: 'User registered successfully!', userId: result.insertId });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during user registration.' });
    }
};


// @desc    Authenticate a user and get a token
// @route   POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // Find the user by email
        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' }); // Use a generic message
        }
        const user = users[0];

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // If credentials are correct, create a JWT
        const payload = {
            id: user.user_id,
            name: user.name,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1d', // Token expires in 1 day
        });

        res.status(200).json({
            message: 'Logged in successfully!',
            token: token,
            user: { name: user.name, role: user.role }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};