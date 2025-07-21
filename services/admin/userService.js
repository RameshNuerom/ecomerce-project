// services/admin/userService.js
const userModel = require('../../models/userModel');

const getAllUsers = async () => {
  const users = await userModel.getAllUsers();
  return users;
};

const updateUserRole = async (userId, newRole) => {
  // 1. Validate if user exists
  const user = await userModel.findUserById(userId);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // 2. Validate the new role against allowed enum values (client-side validation is good, but backend is critical)
  const allowedRoles = ['customer', 'admin', 'delivery_agent']; // Must match your user_role_enum
  if (!allowedRoles.includes(newRole)) {
    const error = new Error(`Invalid role '${newRole}'. Allowed roles are: ${allowedRoles.join(', ')}.`);
    error.statusCode = 400;
    throw error;
  }

  // 3. Prevent an admin from demoting themselves (optional but recommended for safety)
  // This check would require knowing the ID of the requesting admin user (from req.user.id)
  // For now, we'll assume the controller handles access, but a more robust check might be here if you implement it.

  // 4. Update the user's role in the database
  const updatedUser = await userModel.updateUserRole(userId, newRole);
  return updatedUser;
};

module.exports = {
  getAllUsers,
  updateUserRole
};