// routes/deliveryAgentRoutes.js
const express = require('express');
const { protect, isDeliveryAgent } = require('../middlewares/authMiddleware');
const deliveryAgentController = require('../controllers/deliveryAgent/deliveryAgentController');

const router = express.Router();

// All routes in this file require authentication and the 'delivery_agent' role
router.use(protect, isDeliveryAgent);

// --- Delivery Agent Profile Routes ---
router.get('/profile', deliveryAgentController.getMyProfile);
router.put('/profile/availability', deliveryAgentController.updateMyAvailabilityStatus);

// --- Delivery Agent Order Management Routes ---
router.get('/orders', deliveryAgentController.getMyAssignedOrders);
router.put('/orders/:orderId/status', deliveryAgentController.updateAssignedOrderStatus);

module.exports = router;