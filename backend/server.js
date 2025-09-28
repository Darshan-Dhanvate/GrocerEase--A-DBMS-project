// server.js
// This is the main entry point for our backend application.
// It sets up the Express server, configures middleware, and connects all our routes.

import express from 'express';
import cors from 'cors';

// --- Initialization ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing for our frontend to access the API
app.use(cors());
// Enable the Express app to parse JSON formatted request bodies
app.use(express.json());

// --- Routes ---
// Import all the route modules
import productRoutes from './routes/productRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js'; // <-- NEW
import billingRoutes from './routes/billingRoutes.js';   // <-- NEW
import reportRoutes from './routes/reportRoutes.js';     // <-- NEW

// Tell the app to use the imported routes with their API prefixes
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes); // <-- NEW
app.use('/api/billing', billingRoutes);   // <-- NEW
app.use('/api/reports', reportRoutes);     // <-- NEW

// A simple root route to check if the server is running
app.get('/', (req, res) => {
    res.send('Grocery Store Backend API is running...');
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('You can access the API at http://localhost:3001');
});