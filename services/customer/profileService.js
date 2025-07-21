// services/customer/profileService.js
const userModel = require('../../models/userModel');

const getMyProfile = async (userId) => {
  const user = await userModel.findUserById(userId);
  if (!user) {
    // This should ideally not happen if middleware ensures user exists
    const error = new Error('User profile not found.');
    error.statusCode = 404;
    throw error;
  }
  // Exclude sensitive data like password hash
  const { password_hash, ...profile } = user;
  return profile;
};

const updateMyProfile = async (userId, userData) => {
  const { username, email, phoneNumber } = userData;

  // Optional: Basic validation
  if (email && !/\S+@\S+\.\S+/.test(email)) {
    const error = new Error('Invalid email format.');
    error.statusCode = 400;
    throw error;
  }
  // You might want to add more robust validation for phone number, uniqueness of email etc.

  // Check if email is already taken by another user
  if (email) {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser && existingUser.id !== parseInt(userId)) { // If email exists and belongs to a different user
      const error = new Error('Email already registered by another user.');
      error.statusCode = 409; // Conflict
      throw error;
    }
  }

  const updatedUser = await userModel.updateUserDetails(userId, username, email, phoneNumber);
  if (!updatedUser) {
    const error = new Error('Failed to update user profile.');
    error.statusCode = 500;
    throw error;
  }
  const { password_hash, ...profile } = updatedUser; // Exclude password hash
  return profile;
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};