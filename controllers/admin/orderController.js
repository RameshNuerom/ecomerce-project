// controllers/admin/orderController.js
const orderService = require('../../services/admin/orderService');

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderDetails(orderId);
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({ message: 'Order status updated successfully.', order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

const updateOrderPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;
    const updatedOrder = await orderService.updateOrderPaymentStatus(orderId, paymentStatus);
    res.status(200).json({ message: 'Order payment status updated successfully.', order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

const assignDeliveryAgent = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { deliveryAgentId } = req.body;
    const updatedOrder = await orderService.assignDeliveryAgent(orderId, deliveryAgentId);
    res.status(200).json({ message: 'Delivery agent assigned successfully.', order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  updateOrderPaymentStatus,
  assignDeliveryAgent,
};