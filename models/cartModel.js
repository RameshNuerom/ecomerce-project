// models/cartModel.js
const { query } = require('../config/database');

// --- Cart Operations ---

// Find or create a cart for a user
const findOrCreateCart = async (userId) => {
  let cart = await query('SELECT * FROM carts WHERE user_id = $1', [userId]);
  if (cart.rows.length === 0) {
    const newCart = await query('INSERT INTO carts (user_id) VALUES ($1) RETURNING *', [userId]);
    cart = newCart;
  }
  return cart.rows[0];
};

// Get a user's cart with all its items (and product/variant details)
const getCartByUserId = async (userId) => {
  const cartRes = await query('SELECT * FROM carts WHERE user_id = $1', [userId]);
  const cart = cartRes.rows[0];

  if (!cart) {
    return null; // Or throw an error, depending on desired behavior
  }

  // Get cart items with product and variant details
  const itemsRes = await query(`
    SELECT
      ci.id AS cart_item_id,
      ci.product_id,
      ci.product_variant_id,
      ci.quantity,
      p.name AS product_name,
      p.price AS base_price,
      p.image_url,
      pv.attribute_name,
      pv.attribute_value,
      pv.additional_price,
      p.stock_quantity AS product_stock, -- Stock of base product
      COALESCE(pv.stock_quantity, p.stock_quantity) AS available_stock -- Actual stock based on variant or base product
    FROM cart_items ci
    JOIN products p ON ci.product_id = p.id
    LEFT JOIN product_variants pv ON ci.product_variant_id = pv.id
    WHERE ci.cart_id = $1
    ORDER BY p.name;
  `, [cart.id]);

  cart.items = itemsRes.rows;
  return cart;
};

// --- Cart Item Operations ---

// Add a product (or variant) to cart or update quantity if it exists
const addOrUpdateCartItem = async (cartId, productId, productVariantId, quantity) => {
  const res = await query(`
    INSERT INTO cart_items (cart_id, product_id, product_variant_id, quantity)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (cart_id, product_id, product_variant_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = NOW()
    RETURNING *;
  `, [cartId, productId, productVariantId, quantity]);
  return res.rows[0];
};

// Update specific cart item quantity
const updateCartItemQuantity = async (cartItemId, newQuantity) => {
  const res = await query(
    'UPDATE cart_items SET quantity = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [newQuantity, cartItemId]
  );
  return res.rows[0];
};

// Remove item from cart
const removeCartItem = async (cartItemId) => {
  const res = await query('DELETE FROM cart_items WHERE id = $1 RETURNING *', [cartItemId]);
  return res.rows[0];
};

// Clear all items from a cart
const clearCartItems = async (cartId) => {
  await query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  return { message: 'Cart items cleared.' };
};

module.exports = {
  findOrCreateCart,
  getCartByUserId,
  addOrUpdateCartItem,
  updateCartItemQuantity,
  removeCartItem,
  clearCartItems,
};