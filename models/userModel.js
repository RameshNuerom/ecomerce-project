// models/userModel.js
const { query } = require('../config/database');

const createUser = async (username, email, passwordHash, phoneNumber, role) => {
  const res = await query(
    'INSERT INTO users (username, email, password_hash, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, created_at',
    [username, email, passwordHash, phoneNumber, role]
  );
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const res = await query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const findUserById = async (id) => {
  const res = await query('SELECT id, username, email, phone_number, role, created_at FROM users WHERE id = $1', [id]);
  return res.rows[0];
};

const getAllUsers = async () => {
  // Exclude password_hash for security
  const res = await query('SELECT id, username, email, phone_number, role, created_at FROM users ORDER BY created_at DESC');
  return res.rows;
};

const updateUserRole = async (userId, newRole) => {
  const res = await query(
    'UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, email, role, updated_at',
    [newRole, userId]
  );
  return res.rows[0];
};

const updateUserDetails = async (userId, username, email, phoneNumber) => {
  const res = await query(
    `UPDATE users
     SET username = COALESCE($1, username),
         email = COALESCE($2, email),
         phone_number = COALESCE($3, phone_number),
         updated_at = NOW()
     WHERE id = $4
     RETURNING id, username, email, phone_number, role, created_at, updated_at`,
    [username, email, phoneNumber, userId]
  );
  return res.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUserRole,
  updateUserDetails
};