// models/orderModel.js
const { query } = require('../config/database');

// --- Order Operations ---

const createOrder = async (userId, totalAmount, shippingAddress, paymentMethod, paymentStatus = 'pending') => {
  const res = await query(
    `INSERT INTO orders (user_id, total_amount, shipping_address, payment_method, payment_status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [userId, totalAmount, shippingAddress, paymentMethod, paymentStatus]
  );
  return res.rows[0];
};

const getOrderById = async (orderId) => {
  const res = await query(`
    SELECT
      o.id, o.user_id, o.order_date, o.total_amount, o.status,
      o.shipping_address, o.payment_method, o.payment_status,
      o.delivery_agent_id, o.created_at, o.updated_at,
      u.username AS customer_username, u.email AS customer_email,
      da.id AS agent_profile_id, dau.username AS agent_username
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN delivery_agents da ON o.delivery_agent_id = da.id
    LEFT JOIN users dau ON da.user_id = dau.id
    WHERE o.id = $1
  `, [orderId]);
  return res.rows[0];
};

const getAllOrders = async () => {
  const res = await query(`
    SELECT
      o.id, o.user_id, o.order_date, o.total_amount, o.status,
      o.shipping_address, o.payment_method, o.payment_status,
      o.delivery_agent_id, o.created_at, o.updated_at,
      u.username AS customer_username, u.email AS customer_email,
      da.id AS agent_profile_id, dau.username AS agent_username
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN delivery_agents da ON o.delivery_agent_id = da.id
    LEFT JOIN users dau ON da.user_id = dau.id
    ORDER BY o.order_date DESC
  `);
  return res.rows;
};

const getOrdersByUserId = async (userId) => {
  const res = await query(`
    SELECT
      o.id, o.user_id, o.order_date, o.total_amount, o.status,
      o.shipping_address, o.payment_method, o.payment_status,
      o.delivery_agent_id, o.created_at, o.updated_at,
      da.id AS agent_profile_id, dau.username AS agent_username
    FROM orders o
    LEFT JOIN delivery_agents da ON o.delivery_agent_id = da.id
    LEFT JOIN users dau ON da.user_id = dau.id
    WHERE o.user_id = $1
    ORDER BY o.order_date DESC
  `, [userId]);
  return res.rows;
};

const updateOrderStatus = async (orderId, newStatus) => {
  const res = await query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [newStatus, orderId]
  );
  return res.rows[0];
};

const updateOrderPaymentStatus = async (orderId, newPaymentStatus) => {
  const res = await query(
    'UPDATE orders SET payment_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [newPaymentStatus, orderId]
  );
  return res.rows[0];
};

const assignDeliveryAgentToOrder = async (orderId, deliveryAgentId) => {
  const res = await query(
    'UPDATE orders SET delivery_agent_id = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [deliveryAgentId, orderId]
  );
  return res.rows[0];
};

// --- Order Item Operations ---

const createOrderItem = async (orderId, productId, productVariantId, quantity, priceAtPurchase) => {
  const res = await query(
    `INSERT INTO order_items (order_id, product_id, product_variant_id, quantity, price_at_purchase)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [orderId, productId, productVariantId, quantity, priceAtPurchase]
  );
  return res.rows[0];
};

const getOrderItemsByOrderId = async (orderId) => {
  const res = await query(`
    SELECT
      oi.id AS order_item_id, oi.product_id, oi.product_variant_id, oi.quantity, oi.price_at_purchase,
      p.name AS product_name, p.image_url,
      pv.attribute_name, pv.attribute_value, pv.additional_price
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
    WHERE oi.order_id = $1
    ORDER BY p.name;
  `, [orderId]);
  return res.rows;
};


module.exports = {
  createOrder,
  getOrderById,
  getAllOrders,
  getOrdersByUserId,
  updateOrderStatus,
  updateOrderPaymentStatus,
  assignDeliveryAgentToOrder,
  createOrderItem,
  getOrderItemsByOrderId,
};