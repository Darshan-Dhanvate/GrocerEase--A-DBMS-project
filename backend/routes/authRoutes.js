// backend/routes/authRoutes.js
import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// Public route for user registration
router.post('/signup', signup);

// Public route for user login
router.post('/login', login);

export default router;