// config/database.js
const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables from .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to test the database connection
const connectDB = async () => {
  try {
    await pool.query('SELECT 1'); // Simple query to check connection
    console.log('PostgreSQL database connected successfully!');
  } catch (err) {
    console.error('Error connecting to PostgreSQL database:', err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params), // Export a query method for convenience
  connectDB,
  pool // Export the pool directly if you need it elsewhere
};