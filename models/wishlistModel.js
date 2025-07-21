// models/wishlistModel.js
const { query } = require('../config/database');

const addProductToWishlist = async (userId, productId) => {
  const res = await query(
    `INSERT INTO user_wishlists (user_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING
     RETURNING *`, // RETURNING * only if a row was inserted, not on DO NOTHING
    [userId, productId]
  );
  return res.rows[0]; // Will be undefined if ON CONFLICT DO NOTHING occurred
};

const getUserWishlist = async (userId) => {
  const res = await query(
    `SELECT uw.id AS wishlist_item_id, uw.created_at AS added_at,
            p.id AS product_id, p.name AS product_name, p.description AS product_description,
            p.price, p.image_url, p.stock_quantity,
            c.name AS category_name
     FROM user_wishlists uw
     JOIN products p ON uw.product_id = p.id
     JOIN categories c ON p.category_id = c.id
     WHERE uw.user_id = $1
     ORDER BY uw.created_at DESC`,
    [userId]
  );
  return res.rows;
};

const removeProductFromWishlist = async (wishlistId, userId) => {
  // Ensure the wishlist item belongs to the user before deleting
  const res = await query(
    `DELETE FROM user_wishlists WHERE id = $1 AND user_id = $2 RETURNING *`,
    [wishlistId, userId]
  );
  return res.rows[0];
};

const getWishlistItemByProductAndUser = async (userId, productId) => {
    const res = await query(
        `SELECT * FROM user_wishlists WHERE user_id = $1 AND product_id = $2`,
        [userId, productId]
    );
    return res.rows[0];
}

module.exports = {
  addProductToWishlist,
  getUserWishlist,
  removeProductFromWishlist,
  getWishlistItemByProductAndUser,
};