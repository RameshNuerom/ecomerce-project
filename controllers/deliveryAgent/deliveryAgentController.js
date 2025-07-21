// controllers/deliveryAgent/deliveryAgentController.js
const deliveryAgentService = require('../../services/deliveryAgent/deliveryAgentService');

const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // User ID from authenticated request
    const profile = await deliveryAgentService.getAgentProfile(userId);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

const updateMyAvailabilityStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.body;
    const updatedProfile = await deliveryAgentService.updateAgentAvailabilityStatus(userId, status);
    res.status(200).json({ message: 'Availability status updated successfully.', profile: updatedProfile });
  } catch (error) {
    next(error);
  }
};

const getMyAssignedOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await deliveryAgentService.getAssignedOrders(userId);
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

const updateAssignedOrderStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const { status } = req.body; // New order status
    const updatedOrder = await deliveryAgentService.updateAssignedOrderStatus(userId, orderId, status);
    res.status(200).json({ message: 'Order status updated successfully.', order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyAvailabilityStatus,
  getMyAssignedOrders,
  updateAssignedOrderStatus,
};