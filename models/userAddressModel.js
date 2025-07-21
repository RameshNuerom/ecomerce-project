// models/userAddressModel.js
const { query } = require('../config/database');

const createUserAddress = async (userId, addressData) => {
  const { address_line1, address_line2, city, state, postal_code, country, is_default = false, label } = addressData;
  const res = await query(
    `INSERT INTO user_addresses (user_id, address_line1, address_line2, city, state, postal_code, country, is_default, label)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [userId, address_line1, address_line2, city, state, postal_code, country, is_default, label]
  );
  return res.rows[0];
};

const getUserAddresses = async (userId) => {
  const res = await query(
    'SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
    [userId]
  );
  return res.rows;
};

const getUserAddressById = async (addressId) => {
  const res = await query('SELECT * FROM user_addresses WHERE id = $1', [addressId]);
  return res.rows[0];
};

const updateUserAddress = async (addressId, addressData) => {
  const { address_line1, address_line2, city, state, postal_code, country, is_default, label } = addressData;
  const res = await query(
    `UPDATE user_addresses
     SET address_line1 = COALESCE($1, address_line1),
         address_line2 = COALESCE($2, address_line2),
         city = COALESCE($3, city),
         state = COALESCE($4, state),
         postal_code = COALESCE($5, postal_code),
         country = COALESCE($6, country),
         is_default = COALESCE($7, is_default),
         label = COALESCE($8, label),
         updated_at = NOW()
     WHERE id = $9
     RETURNING *`,
    [address_line1, address_line2, city, state, postal_code, country, is_default, label, addressId]
  );
  return res.rows[0];
};

const deleteUserAddress = async (addressId) => {
  const res = await query('DELETE FROM user_addresses WHERE id = $1 RETURNING *', [addressId]);
  return res.rows[0];
};

// Helper to set all other addresses to not default for a user
const unsetOtherDefaultAddresses = async (userId, excludeAddressId) => {
  await query(
    'UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1 AND id != $2 AND is_default = TRUE',
    [userId, excludeAddressId]
  );
};

// Helper to check if a user has any addresses
const hasUserAddresses = async (userId) => {
  const res = await query('SELECT COUNT(*) FROM user_addresses WHERE user_id = $1', [userId]);
  return parseInt(res.rows[0].count) > 0;
};


module.exports = {
  createUserAddress,
  getUserAddresses,
  getUserAddressById,
  updateUserAddress,
  deleteUserAddress,
  unsetOtherDefaultAddresses,
  hasUserAddresses,
};