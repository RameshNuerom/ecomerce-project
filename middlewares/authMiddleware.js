// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/jwt');
const userModel = require('../models/userModel');

// Middleware to protect routes (ensure user is logged in)
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, jwtSecret);

      // Attach user to the request object (excluding password hash)
      req.user = await userModel.findUserById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware for role-based access control
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: User role '${req.user ? req.user.role : 'none'}' is not authorized to access this resource.` });
    }
    next();
  };
};

// Convenience middleware for specific roles
const isAdmin = authorizeRoles('admin');
const isCustomer = authorizeRoles('customer');
const isDeliveryAgent = authorizeRoles('delivery_agent');

module.exports = {
  protect,
  authorizeRoles,
  isAdmin,
  isCustomer,
  isDeliveryAgent,
}; 
