// models/productModel.js
const { query } = require('../config/database');

// --- Product Operations ---
const createProduct = async (name, description, price, stockQuantity, categoryId, imageUrl) => {
  const res = await query(
    'INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, description, price, stockQuantity, categoryId, imageUrl]
  );
  return res.rows[0];
};

const getAllProducts = async () => {
  // Join with categories to get category name
  const res = await query(`
    SELECT
      p.id, p.name, p.description, p.price, p.stock_quantity,
      p.image_url, p.created_at, p.updated_at,
      c.id AS category_id, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.name
  `);
  return res.rows;
};

const getProductById = async (id) => {
  const res = await query(`
    SELECT
      p.id, p.name, p.description, p.price, p.stock_quantity,
      p.image_url, p.created_at, p.updated_at,
      c.id AS category_id, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.id = $1
  `, [id]);
  return res.rows[0];
};

const updateProduct = async (id, name, description, price, stockQuantity, categoryId, imageUrl) => {
  const res = await query(
    'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, image_url = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
    [name, description, price, stockQuantity, categoryId, imageUrl, id]
  );
  return res.rows[0];
};

const deleteProduct = async (id) => {
  // `ON DELETE CASCADE` on product_variants ensures variants are deleted automatically.
  // No need for explicit check here if you trust your foreign key constraints.
  const res = await query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

// --- Product Variant Operations ---
const createProductVariant = async (productId, attributeName, attributeValue, additionalPrice, stockQuantity) => {
  const res = await query(
    'INSERT INTO product_variants (product_id, attribute_name, attribute_value, additional_price, stock_quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [productId, attributeName, attributeValue, additionalPrice, stockQuantity]
  );
  return res.rows[0];
};

const getProductVariants = async (productId) => {
  const res = await query('SELECT * FROM product_variants WHERE product_id = $1 ORDER BY attribute_name, attribute_value', [productId]);
  return res.rows;
};

const getProductVariantById = async (id) => {
  const res = await query('SELECT * FROM product_variants WHERE id = $1', [id]);
  return res.rows[0];
};

const updateProductVariant = async (id, attributeName, attributeValue, additionalPrice, stockQuantity) => {
  const res = await query(
    'UPDATE product_variants SET attribute_name = $1, attribute_value = $2, additional_price = $3, stock_quantity = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
    [attributeName, attributeValue, additionalPrice, stockQuantity, id]
  );
  return res.rows[0];
};

const deleteProductVariant = async (id) => {
  const res = await query('DELETE FROM product_variants WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

const updateProductStock = async (productId, quantityChange) => {
  // quantityChange can be negative to deduct stock
  const res = await query(
    'UPDATE products SET stock_quantity = stock_quantity + $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [quantityChange, productId]
  );
  return res.rows[0];
};

const updateProductVariantStock = async (variantId, quantityChange) => {
  // quantityChange can be negative to deduct stock
  const res = await query(
    'UPDATE product_variants SET stock_quantity = stock_quantity + $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [quantityChange, variantId]
  );
  return res.rows[0];
};

const searchProductsByName = async (searchTerm) => {
    const res = await query(
        `SELECT p.*, c.name AS category_name
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.name ILIKE $1
         ORDER BY p.name`,
        [`%${searchTerm}%`] // ILIKE for case-insensitive contains
    );
    return res.rows;
};

const getFilteredProducts = async (
  categoryId = null,
  searchTerm = null,
  minPrice = null,
  maxPrice = null,
  sortBy = null, // e.g., 'price_asc', 'price_desc', 'name_asc', 'name_desc'
  limit = null,
  offset = null
) => {
  let queryText = `
    SELECT p.*, c.name AS category_name
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const queryParams = [];
  let paramIndex = 1;

  if (categoryId) {
    queryText += ` AND p.category_id = $${paramIndex++}`;
    queryParams.push(categoryId);
  }

  if (searchTerm) {
    // Search by product name or description
    queryText += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex++})`;
    queryParams.push(`%${searchTerm}%`);
  }

  if (minPrice !== null && minPrice !== undefined) {
    queryText += ` AND p.price >= $${paramIndex++}`;
    queryParams.push(minPrice);
  }

  if (maxPrice !== null && maxPrice !== undefined) {
    queryText += ` AND p.price <= $${paramIndex++}`;
    queryParams.push(maxPrice);
  }

  // Sorting
  switch (sortBy) {
    case 'price_asc':
      queryText += ` ORDER BY p.price ASC`;
      break;
    case 'price_desc':
      queryText += ` ORDER BY p.price DESC`;
      break;
    case 'name_asc':
      queryText += ` ORDER BY p.name ASC`;
      break;
    case 'name_desc':
      queryText += ` ORDER BY p.name DESC`;
      break;
    default:
      queryText += ` ORDER BY p.created_at DESC`; // Default sort
  }

  if (limit !== null && limit !== undefined) {
    queryText += ` LIMIT $${paramIndex++}`;
    queryParams.push(limit);
  }

  if (offset !== null && offset !== undefined) {
    queryText += ` OFFSET $${paramIndex++}`;
    queryParams.push(offset);
  }

  const res = await query(queryText, queryParams);
  return res.rows;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductVariant,
  getProductVariants,
  getProductVariantById,
  updateProductVariant,
  deleteProductVariant,
  updateProductStock,
  updateProductVariantStock,
  searchProductsByName,
  getFilteredProducts
};