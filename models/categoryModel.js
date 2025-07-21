// models/categoryModel.js
const { query } = require('../config/database');

const createCategory = async (name, description, parentCategoryId) => {
  const res = await query(
    'INSERT INTO categories (name, description, parent_category_id) VALUES ($1, $2, $3) RETURNING *',
    [name, description, parentCategoryId]
  );
  return res.rows[0];
};

const getAllCategories = async () => {
  const res = await query('SELECT * FROM categories ORDER BY name');
  return res.rows;
};

const getCategoryById = async (id) => {
  const res = await query('SELECT * FROM categories WHERE id = $1', [id]);
  return res.rows[0];
};

const updateCategory = async (id, name, description, parentCategoryId) => {
  const res = await query(
    'UPDATE categories SET name = $1, description = $2, parent_category_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
    [name, description, parentCategoryId, id]
  );
  return res.rows[0];
};

const deleteCategory = async (id) => {
  // Check for products associated with this category before deleting (RESTRICT constraint)
  const productCountRes = await query('SELECT COUNT(*) FROM products WHERE category_id = $1', [id]);
  if (parseInt(productCountRes.rows[0].count) > 0) {
      throw new Error('Cannot delete category: Products are associated with this category. Please reassign or delete products first.');
  }

  // Check for child categories
  const childCategoryCountRes = await query('SELECT COUNT(*) FROM categories WHERE parent_category_id = $1', [id]);
  if (parseInt(childCategoryCountRes.rows[0].count) > 0) {
      throw new Error('Cannot delete category: Child categories exist. Please reassign or delete child categories first.');
  }

  const res = await query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
  return res.rows[0];
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
}; 
