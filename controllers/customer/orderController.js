// controllers/customer/orderController.js
const orderService = require('../../services/customer/orderService');

const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user.id; // User ID from authenticated request
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      const error = new Error('Shipping address and payment method are required.');
      error.statusCode = 400;
      throw error;
    }

    const order = await orderService.placeOrder(userId, shippingAddress, paymentMethod);
    res.status(201).json({ message: 'Order placed successfully.', order });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getCustomerOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getMyOrderDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await orderService.getCustomerOrderDetails(userId, orderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getMyOrderDetails,
};