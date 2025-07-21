// controllers/authController.js
const authService = require('../services/authService');
const errorHandler = require('../middlewares/errorHandler'); // We will use this eventually

const register = async (req, res, next) => {
  try {
    const { username, email, password, phoneNumber, role } = req.body; // Role can be optional for customer registration
    const { user, token } = await authService.registerUser(username, email, password, phoneNumber, role);
    res.status(201).json({ message: 'User registered successfully', user, token });
  } catch (error) {
    // Pass error to the next middleware (error handler)
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({ message: 'Logged in successfully', user, token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
}; 
