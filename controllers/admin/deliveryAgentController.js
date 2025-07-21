// controllers/admin/deliveryAgentController.js
const deliveryAgentService = require('../../services/admin/deliveryAgentService');

const registerDeliveryAgent = async (req, res, next) => {
  try {
    const { userId } = req.body; // The ID of the user to register as an agent
    const agent = await deliveryAgentService.registerDeliveryAgent(userId);
    res.status(201).json({ message: 'Delivery agent registered successfully.', agent });
  } catch (error) {
    next(error);
  }
};

const getAllDeliveryAgents = async (req, res, next) => {
  try {
    const agents = await deliveryAgentService.getAllDeliveryAgents();
    res.status(200).json(agents);
  } catch (error) {
    next(error);
  }
};

const getDeliveryAgentById = async (req, res, next) => {
  try {
    const { id } = req.params; // ID of the delivery_agents table entry
    const agent = await deliveryAgentService.getDeliveryAgentDetails(id);
    res.status(200).json(agent);
  } catch (error) {
    next(error);
  }
};

const updateDeliveryAgentStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // ID of the delivery_agents table entry
    const { status } = req.body; // New availability status
    const updatedAgent = await deliveryAgentService.updateDeliveryAgentStatus(id, status);
    res.status(200).json({ message: 'Delivery agent status updated successfully.', agent: updatedAgent });
  } catch (error) {
    next(error);
  }
};

const deleteDeliveryAgentProfile = async (req, res, next) => {
  try {
    const { id } = req.params; // ID of the delivery_agents table entry
    const deletedAgent = await deliveryAgentService.deleteDeliveryAgentProfile(id);
    if (!deletedAgent) {
      return res.status(404).json({ message: 'Delivery agent not found.' });
    }
    res.status(200).json({ message: 'Delivery agent profile deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerDeliveryAgent,
  getAllDeliveryAgents,
  getDeliveryAgentById,
  updateDeliveryAgentStatus,
  deleteDeliveryAgentProfile,
};