// routes/adminRoutes.js
const express = require('express');
const { protect, isAdmin } = require('../middlewares/authMiddleware');
const categoryController = require('../controllers/admin/categoryController');
const productController = require('../controllers/admin/productController');
const userController = require('../controllers/admin/userController');
const deliveryAgentController = require('../controllers/admin/deliveryAgentController'); // Import delivery agent controller
const adminOrderController = require('../controllers/admin/orderController'); // Import admin order controller
// Import other admin controllers as you create them

const router = express.Router();

// All routes in this file will automatically be protected by `protect` and `isAdmin`
router.use(protect, isAdmin);

// --- Category Routes (Admin Only) ---
router.post('/categories', categoryController.createCategory); // <--- CHECK THIS LINE AND AROUND IT
router.get('/categories', categoryController.getCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', categoryController.updateCategory);
router.delete('/categories/:id', categoryController.deleteCategory);

// --- Product Routes (Admin Only) ---
router.post('/products', productController.createProduct); // <--- ALSO CHECK THIS LINE
router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

// --- Product Variant Routes (Admin Only) ---
router.post('/products/:productId/variants', productController.createProductVariant);
router.put('/variants/:variantId', productController.updateProductVariant);
router.delete('/variants/:variantId', productController.deleteProductVariant);

// --- User Management Routes (Admin Only) ---
router.get('/users', userController.getAllUsers);           // Get all users
router.put('/users/:id/role', userController.updateUserRole); // Update a user's role

// --- Delivery Agent Management Routes (Admin Only) ---
router.post('/delivery-agents', deliveryAgentController.registerDeliveryAgent);
router.get('/delivery-agents', deliveryAgentController.getAllDeliveryAgents);
router.get('/delivery-agents/:id', deliveryAgentController.getDeliveryAgentById);
router.put('/delivery-agents/:id/status', deliveryAgentController.updateDeliveryAgentStatus);
router.delete('/delivery-agents/:id', deliveryAgentController.deleteDeliveryAgentProfile);

// --- Order Management Routes (Admin Only) ---
router.get('/orders', adminOrderController.getAllOrders);
router.get('/orders/:orderId', adminOrderController.getOrderDetails);
router.put('/orders/:orderId/status', adminOrderController.updateOrderStatus);
router.put('/orders/:orderId/payment-status', adminOrderController.updateOrderPaymentStatus);
router.put('/orders/:orderId/assign-agent', adminOrderController.assignDeliveryAgent);

module.exports = router;