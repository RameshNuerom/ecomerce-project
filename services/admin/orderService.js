// services/admin/orderService.js
const orderModel = require('../../models/orderModel');
const deliveryAgentModel = require('../../models/deliveryAgentModel'); // For assigning agents
const notificationService = require('../notificationService'); // Import notification service

const getAllOrders = async () => {
  const orders = await orderModel.getAllOrders();
  // For each order, fetch its items to provide complete details
  for (const order of orders) {
    order.items = await orderModel.getOrderItemsByOrderId(order.id);
  }
  return orders;
};

const getOrderDetails = async (orderId) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }
  order.items = await orderModel.getOrderItemsByOrderId(order.id);
  return order;
};

const updateOrderStatus = async (orderId, newStatus) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  // Validate new status against ENUM values
  const allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
  if (!allowedStatuses.includes(newStatus)) {
    const error = new Error(`Invalid order status '${newStatus}'. Allowed: ${allowedStatuses.join(', ')}.`);
    error.statusCode = 400;
    throw error;
  }

  const updatedOrder = await orderModel.updateOrderStatus(orderId, newStatus);
  return updatedOrder;
};

const assignDeliveryAgentToOrder = async (orderId, agentId) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  const agent = await deliveryAgentModel.getDeliveryAgentById(agentId);
  if (!agent) {
    const error = new Error('Delivery agent not found.');
    error.statusCode = 404;
    throw error;
  }

  const updatedOrder = await orderModel.assignDeliveryAgent(orderId, agentId);

  // --- Send Email Notification to Customer ---
  const customer = await userModel.findUserById(updatedOrder.user_id);
  if (customer && customer.email) {
    const customerSubject = `Your Order #${updatedOrder.id} is Assigned to a Delivery Agent`;
    const customerBody = `
      <p>Dear ${customer.username || 'Customer'},</p>
      <p>Your order <strong>#${updatedOrder.id}</strong> has been assigned to a delivery agent.</p>
      <p>Delivery Agent: ${agent.name} (Contact: ${agent.phone_number || 'N/A'})</p>
      <p>Current Status: <strong>${updatedOrder.status.toUpperCase()}</strong></p>
      <p>We'll notify you as it progresses towards delivery.</p>
      <p>Best regards,<br>Your E-commerce Team</p>
    `;
    await notificationService.sendEmail(customer.email, customerSubject, customerBody);
  }

  // --- Send Email Notification to Delivery Agent ---
  // Assuming delivery agents are also users with an email. If not, adapt this.
  const agentUser = await userModel.findUserById(agent.user_id); // Assuming delivery agent has a linked user account
  if (agentUser && agentUser.email) {
    const agentSubject = `New Delivery Assignment: Order #${updatedOrder.id}`;
    const agentBody = `
      <p>Dear ${agentUser.username || 'Delivery Agent'},</p>
      <p>You have a new delivery assignment for order <strong>#${updatedOrder.id}</strong>.</p>
      <p>Customer Name: ${customer.username || 'N/A'}</p>
      <p>Customer Address: ${updatedOrder.shipping_address}</p>
      <p>Total Amount: $${updatedOrder.total_amount.toFixed(2)}</p>
      <p>Please log in to your portal to view details and update status.</p>
      <p>Thank you,<br>E-commerce Admin</p>
    `;
    await notificationService.sendEmail(agentUser.email, agentSubject, agentBody);
  }
  // --- End Email Notification ---

  return updatedOrder;
};

const updateOrderPaymentStatus = async (orderId, newPaymentStatus) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  // Validate new payment status
  const allowedPaymentStatuses = ['pending', 'paid', 'refunded'];
  if (!allowedPaymentStatuses.includes(newPaymentStatus)) {
    const error = new Error(`Invalid payment status '${newPaymentStatus}'. Allowed: ${allowedPaymentStatuses.join(', ')}.`);
    error.statusCode = 400;
    throw error;
  }

  const updatedOrder = await orderModel.updateOrderPaymentStatus(orderId, newPaymentStatus);
  return updatedOrder;
};

const assignDeliveryAgent = async (orderId, deliveryAgentId) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  const agent = await deliveryAgentModel.getDeliveryAgentById(deliveryAgentId);
  if (!agent) {
    const error = new Error('Delivery agent not found.');
    error.statusCode = 404;
    throw error;
  }

  const updatedOrder = await orderModel.assignDeliveryAgentToOrder(orderId, deliveryAgentId);
  return updatedOrder;
};

module.exports = {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  updateOrderPaymentStatus,
  assignDeliveryAgent,
};