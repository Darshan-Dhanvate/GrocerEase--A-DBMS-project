// backend/server.js
// This is the main entry point for our backend application.

import express from 'express';
import cors from 'cors';

// Import all the route modules
import productRoutes from './routes/productRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import billingRoutes from './routes/billingRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
// ----> This is the new line you need to add <----
import adminRoutes from './routes/adminRoutes.js'; 

const app = express();
// Use a PORT from the environment or default to 3001
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Tell the app to use the imported routes with their API prefixes
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/reports', reportRoutes);
// ----> This is the new line you need to add <----
app.use('/api/admin', adminRoutes); 

// A simple root route to check if the server is running
app.get('/', (req, res) => {
    res.send('Grocery Store Backend API is running...');
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`You can access the API at http://localhost:${PORT}`);
});