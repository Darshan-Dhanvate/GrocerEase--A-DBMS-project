// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// This is our protection middleware
export const protect = async (req, res, next) => {
    let token;

    // Check if the 'Authorization' header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from header (e.g., "Bearer eyJhbGci...")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using our secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Get user from the database using the ID in the token
            // We exclude the password field for security
            const [users] = await db.query('SELECT user_id, name, email, role FROM Users WHERE user_id = ?', [decoded.id]);
            
            if (users.length === 0) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // 4. Attach the user object to the request for later use in our controllers
            req.user = users[0];

            // 5. Move on to the next step (the actual route handler)
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};