// controllers/admin/userController.js
const userService = require('../../services/admin/userService');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params; // User ID to update
    const { role } = req.body; // New role for the user

    // Optional: Prevent an admin from demoting themselves
    // if (req.user && parseInt(req.user.id) === parseInt(id) && role !== 'admin') {
    //   const error = new Error('Admin cannot demote themselves from admin role via this endpoint.');
    //   error.statusCode = 403;
    //   throw error;
    // }

    const updatedUser = await userService.updateUserRole(id, role);
    res.status(200).json({ message: 'User role updated successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole
};