// services/customer/orderService.js
const cartModel = require('../../models/cartModel');
const orderModel = require('../../models/orderModel');
const productModel = require('../../models/productModel'); // For stock updates
const { query } = require('../../config/database'); // For transaction


const placeOrder = async (userId, shippingAddress, paymentMethod) => {
  const client = await query.getClient(); // Get a client for transaction

  try {
    await client.query('BEGIN'); // Start transaction

    // 1. Get the user's cart with details
    const cart = await cartModel.getCartByUserId(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      const error = new Error('Cart is empty. Cannot place an order.');
      error.statusCode = 400;
      throw error;
    }

    let totalAmount = 0;
    const orderItemsToCreate = [];

    // 2. Validate stock and calculate total amount for each item
    for (const item of cart.items) {
      let currentPrice;
      let availableStock;

      if (item.product_variant_id) {
        const variant = await productModel.getProductVariantById(item.product_variant_id);
        if (!variant || variant.product_id !== item.product_id) {
            throw new Error(`Variant ${item.product_variant_id} not found or mismatch for product ${item.product_id}.`);
        }
        currentPrice = item.base_price + variant.additional_price;
        availableStock = variant.stock_quantity;
      } else {
        const product = await productModel.getProductById(item.product_id);
        if (!product) {
            throw new Error(`Product ${item.product_id} not found.`);
        }
        currentPrice = product.price;
        availableStock = product.stock_quantity;
      }

      if (item.quantity > availableStock) {
        const error = new Error(`Insufficient stock for ${item.product_name}${item.attribute_value ? ` (${item.attribute_value})` : ''}. Requested: ${item.quantity}, Available: ${availableStock}`);
        error.statusCode = 400;
        throw error;
      }

      totalAmount += currentPrice * item.quantity;
      orderItemsToCreate.push({
        productId: item.product_id,
        productVariantId: item.product_variant_id,
        quantity: item.quantity,
        priceAtPurchase: currentPrice,
      });
    }

    // 3. Create the order
    const order = await orderModel.createOrder(userId, totalAmount, shippingAddress, paymentMethod);

    // 4. Create order items and update stock for each
    for (const itemData of orderItemsToCreate) {
      await orderModel.createOrderItem(
        order.id,
        itemData.productId,
        itemData.productVariantId,
        itemData.quantity,
        itemData.priceAtPurchase
      );

      // Deduct stock
      if (itemData.productVariantId) {
        await productModel.updateProductVariantStock(itemData.productVariantId, -itemData.quantity);
      } else {
        await productModel.updateProductStock(itemData.productId, -itemData.quantity);
      }
    }

    // 5. Clear the user's cart after successful order placement
    await cartModel.clearCartItems(cart.id);

    await client.query('COMMIT'); // Commit transaction
    return order;

  } catch (error) {
    await client.query('ROLLBACK'); // Rollback on error
    throw error; // Re-throw the error for global error handler
  } finally {
    client.release(); // Release the client back to the pool
  }
};

const getCustomerOrders = async (userId) => {
  const orders = await orderModel.getOrdersByUserId(userId);

  // For each order, fetch its items
  for (const order of orders) {
    order.items = await orderModel.getOrderItemsByOrderId(order.id);
  }
  return orders;
};

const getCustomerOrderDetails = async (userId, orderId) => {
  const order = await orderModel.getOrderById(orderId);
  if (!order || order.user_id !== parseInt(userId)) {
    const error = new Error('Order not found or does not belong to the user.');
    error.statusCode = 404;
    throw error;
  }
  order.items = await orderModel.getOrderItemsByOrderId(order.id);
  return order;
};

// ... (other customer-specific order related services like cancel order, if applicable)

module.exports = {
  placeOrder,
  getCustomerOrders,
  getCustomerOrderDetails,
};