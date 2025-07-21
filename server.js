// server.js
const express = require('express');
require('dotenv').config();
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const publicRoutes = require('./routes/publicRoutes');
const customerRoutes = require('./routes/customerRoutes');
const deliveryAgentRoutes = require('./routes/deliveryAgentRoutes'); // Import delivery agent routes
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API!');
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/delivery-agent', deliveryAgentRoutes); // Delivery Agent routes prefixed with /api/delivery-agent

// --- Database Connection ---
connectDB();

// --- Global Error Handler ---
app.use(errorHandler);

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});