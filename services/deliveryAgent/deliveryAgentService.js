// services/deliveryAgent/deliveryAgentService.js
const orderModel = require('../../models/orderModel');
const userModel = require('../../models/userModel'); // To get customer's email
const notificationService = require('../notificationService'); // Import notification service

// ... (existing functions: getAssignedOrders, getDeliveryAgentDetails, updateDeliveryAgentDetails)

const updateDeliveryStatus = async (orderId, newStatus, agentId) => {
  const order = await orderModel.getOrderById(orderId);

  if (!order) {
    const error = new Error('Order not found.');
    error.statusCode = 404;
    throw error;
  }

  // Ensure the agent is assigned to this order or is permitted to update (e.g., admin)
  if (order.delivery_agent_id !== parseInt(agentId)) {
    const error = new Error('Not authorized to update this order status.');
    error.statusCode = 403;
    throw error;
  }

  // Optional: Add logic for valid status transitions (e.g., 'pending' -> 'shipped' -> 'out_for_delivery' -> 'delivered')
  // For simplicity, any status update is currently allowed.

  const updatedOrder = await orderModel.updateOrderStatus(orderId, newStatus);

  // --- Send Email Notification to Customer ---
  const customer = await userModel.findUserById(updatedOrder.user_id);
  if (customer && customer.email) {
    const subject = `Your Order #${updatedOrder.id} Delivery Update: ${updatedOrder.status}`;
    let bodyText = `
      <p>Dear ${customer.username || 'Customer'},</p>
      <p>Good news! Your order <strong>#${updatedOrder.id}</strong> has been updated.</p>
      <p>New Delivery Status: <strong>${updatedOrder.status.toUpperCase()}</strong></p>
    `;

    if (newStatus === 'out_for_delivery') {
        bodyText += `<p>Your order is now out for delivery! Please be available to receive it at ${updatedOrder.shipping_address}.</p>`;
    } else if (newStatus === 'delivered') {
        bodyText += `<p>Your order has been successfully delivered! We hope you enjoy your purchase.</p><p>Please consider leaving a review for the products you received.</p>`;
    } else if (newStatus === 'cancelled') {
        bodyText += `<p>Unfortunately, your order has been cancelled. Please contact support for more details.</p>`;
    }

    bodyText += `<p>Thank you for shopping with us!<br>Your E-commerce Team</p>`;

    await notificationService.sendEmail(customer.email, subject, bodyText);
  }
  // --- End Email Notification ---

  return updatedOrder;
};

module.exports = {
  // ... existing exports
  updateDeliveryStatus,
};