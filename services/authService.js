// services/authService.js
const userModel = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const registerUser = async (username, email, password, phoneNumber, role = 'customer') => {
  // 1. Check if user already exists
  const existingUser = await userModel.findUserByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(password);

  // 3. Create user in database
  const newUser = await userModel.createUser(username, email, hashedPassword, phoneNumber, role);

  // 4. Generate JWT
  const token = generateToken(newUser.id, newUser.role);

  return { user: newUser, token };
};

const loginUser = async (email, password) => {
  // 1. Find user by email
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials.');
  }

  // 2. Compare provided password with stored hash
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials.');
  }

  // 3. Generate JWT
  const token = generateToken(user.id, user.role);

  // Return user info without password hash
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password_hash;

  return { user: userWithoutPassword, token };
};

module.exports = {
  registerUser,
  loginUser
}; 
