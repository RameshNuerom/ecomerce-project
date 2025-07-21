// routes/publicRoutes.js
const express = require('express');
const customerCategoryController = require('../controllers/customer/categoryController');
const customerProductController = require('../controllers/customer/productController');

const router = express.Router();

// --- Public Category Routes ---
router.get('/categories', customerCategoryController.getCategories);
router.get('/categories/:id', customerCategoryController.getCategoryById);

// --- Public Product Routes ---
router.get('/products', customerProductController.getProducts);
router.get('/products/:id', customerProductController.getProductById);

// You can add more public routes here, e.g., for search, recommendations, etc.

module.exports = router;