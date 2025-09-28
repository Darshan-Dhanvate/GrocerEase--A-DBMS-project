// config/db.js
// This file handles the connection to our MySQL database.

import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a connection pool. A pool is more efficient than a single connection
// as it manages multiple connections, which is better for handling concurrent requests.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// We export the promise-based version of the pool for use with async/await
// This makes our database queries cleaner in the controller files.
export default pool.promise();
