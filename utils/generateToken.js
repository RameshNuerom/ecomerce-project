// utils/generateToken.js
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

module.exports = generateToken;