// services/admin/deliveryAgentService.js
const deliveryAgentModel = require('../../models/deliveryAgentModel');
const userModel = require('../../models/userModel'); // To verify user and role

const registerDeliveryAgent = async (userId) => {
  // 1. Check if user exists
  const user = await userModel.findUserById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Check if user already has 'delivery_agent' role
  if (user.role !== 'delivery_agent') {
    const error = new Error(`User with ID ${userId} does not have the 'delivery_agent' role. Please update their role first.`);
    error.statusCode = 400; // Bad Request
    throw error;
  }

  // 3. Check if user is already registered as a delivery agent
  const existingAgent = await deliveryAgentModel.getDeliveryAgentByUserId(userId);
  if (existingAgent) {
    const error = new Error('User is already registered as a delivery agent.');
    error.statusCode = 409; // Conflict
    throw error;
  }

  // 4. Create the delivery agent entry
  const deliveryAgent = await deliveryAgentModel.createDeliveryAgent(userId);
  return deliveryAgent;
};

const getAllDeliveryAgents = async () => {
  const agents = await deliveryAgentModel.getAllDeliveryAgents();
  return agents;
};

const getDeliveryAgentDetails = async (agentId) => {
  const agent = await deliveryAgentModel.getDeliveryAgentById(agentId);
  if (!agent) {
    const error = new Error('Delivery agent not found.');
    error.statusCode = 404;
    throw error;
  }
  return agent;
};

const updateDeliveryAgentStatus = async (agentId, status) => {
  const existingAgent = await deliveryAgentModel.getDeliveryAgentById(agentId);
  if (!existingAgent) {
    const error = new Error('Delivery agent not found.');
    error.statusCode = 404;
    throw error;
  }

  // Validate status against allowed enum values (if you created an enum, otherwise hardcode)
  const allowedStatuses = ['available', 'unavailable', 'on_delivery']; // Must match your agent_status_enum
  if (!allowedStatuses.includes(status)) {
    const error = new Error(`Invalid status '${status}'. Allowed statuses are: ${allowedStatuses.join(', ')}.`);
    error.statusCode = 400;
    throw error;
  }

  const updatedAgent = await deliveryAgentModel.updateDeliveryAgent(agentId, status);
  return updatedAgent;
};

const deleteDeliveryAgentProfile = async (agentId) => {
  const existingAgent = await deliveryAgentModel.getDeliveryAgentById(agentId);
  if (!existingAgent) {
    const error = new Error('Delivery agent not found.');
    error.statusCode = 404;
    throw error;
  }
  const deletedAgent = await deliveryAgentModel.deleteDeliveryAgent(agentId);
  return deletedAgent;
};

module.exports = {
  registerDeliveryAgent,
  getAllDeliveryAgents,
  getDeliveryAgentDetails,
  updateDeliveryAgentStatus,
  deleteDeliveryAgentProfile,
};