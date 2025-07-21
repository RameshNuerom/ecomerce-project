// services/deliveryAgent/deliveryAgentService.js
const deliveryAgentModel = require('../../models/deliveryAgentModel');
const orderModel = require('../../models/orderModel'); // To get/update assigned orders

const getAgentProfile = async (userId) => {
  const agentProfile = await deliveryAgentModel.getDeliveryAgentByUserId(userId);
  if (!agentProfile) {
    const error = new Error('Delivery agent profile not found for this user.');
    error.statusCode = 404;
    throw error;
  }
  return agentProfile;
};

const updateAgentAvailabilityStatus = async (userId, newStatus) => {
  const agentProfile = await deliveryAgentModel.getDeliveryAgentByUserId(userId);
  if (!agentProfile) {
    const error = new Error('Delivery agent profile not found for this user.');
    error.statusCode = 404;
    throw error;
  }

  const allowedStatuses = ['available', 'unavailable', 'on_delivery']; // Must match your agent_status_enum
  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error(`Invalid availability status '${newStatus}'. Allowed: ${allowedStatuses.join(', ')}.`);
    error.statusCode = 400;
    throw error;
  }

  const updatedAgent = await deliveryAgentModel.updateDeliveryAgent(agentProfile.id, newStatus);
  return updatedAgent;
};

const getAssignedOrders = async (userId) => {
  const agentProfile = await deliveryAgentModel.getDeliveryAgentByUserId(userId);
  if (!agentProfile) {
    const error = new Error('Delivery agent profile not found for this user.');
    error.statusCode = 404;
    throw error;
  }

  // Get orders where this agent is assigned
  const orders = await orderModel.getAllOrders(); // Fetch all, then filter
  const assignedOrders = orders.filter(order => order.delivery_agent_id === agentProfile.id);

  // For each assigned order, fetch its items for full details
  for (const order of assignedOrders) {
    order.items = await orderModel.getOrderItemsByOrderId(order.id);
  }

  return assignedOrders;
};

const updateAssignedOrderStatus = async (userId, orderId, newStatus) => {
  const agentProfile = await deliveryAgentModel.getDeliveryAgentByUserId(userId);
  if (!agentProfile) {
    const error = new Error('Delivery agent profile not found for this user.');
    error.statusCode = 404;
    throw error;
  }

  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  // Ensure the order is assigned to *this* delivery agent
  if (order.delivery_agent_id !== agentProfile.id) {
    const error = new Error('This order is not assigned to you.');
    error.statusCode = 403; // Forbidden
    throw error;
  }

  // Define allowed status transitions for delivery agents
  const allowedTransitions = {
    'processing': ['shipped'],
    'shipped': ['delivered', 'returned'],
    // Agents generally cannot change to 'pending', 'cancelled'
  };

  const currentStatus = order.status;
  const validNextStatuses = allowedTransitions[currentStatus] || [];

  if (!validNextStatuses.includes(newStatus)) {
    const error = new Error(`Invalid status transition from '${currentStatus}' to '${newStatus}'.`);
    error.statusCode = 400;
    throw error;
  }

  const updatedOrder = await orderModel.updateOrderStatus(orderId, newStatus);
  return updatedOrder;
};

module.exports = {
  getAgentProfile,
  updateAgentAvailabilityStatus,
  getAssignedOrders,
  updateAssignedOrderStatus,
};