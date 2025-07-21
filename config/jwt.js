// config/jwt.js
require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h' // Default to 1 hour if not specified in .env
}; 
