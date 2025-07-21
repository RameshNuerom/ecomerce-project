// services/admin/categoryService.js
const categoryModel = require('../../models/categoryModel');

const createCategory = async (name, description, parentCategoryId) => {
  // Optional: Add validation logic here before interacting with model
  if (!name) {
    const error = new Error('Category name is required.');
    error.statusCode = 400; // Bad Request
    throw error;
  }
  // If parentCategoryId is provided, ensure it exists
  if (parentCategoryId) {
    const parentCategory = await categoryModel.getCategoryById(parentCategoryId);
    if (!parentCategory) {
      const error = new Error('Parent category not found.');
      error.statusCode = 404;
      throw error;
    }
  }

  const category = await categoryModel.createCategory(name, description, parentCategoryId);
  return category;
};

const getCategories = async () => {
  const categories = await categoryModel.getAllCategories();
  return categories;
};

const getCategoryDetails = async (id) => {
  const category = await categoryModel.getCategoryById(id);
  if (!category) {
    const error = new Error('Category not found.');
    error.statusCode = 404;
    throw error;
  }
  return category;
};

const updateCategory = async (id, name, description, parentCategoryId) => {
  const existingCategory = await categoryModel.getCategoryById(id);
  if (!existingCategory) {
    const error = new Error('Category not found.');
    error.statusCode = 404;
    throw error;
  }
  if (!name) {
    const error = new Error('Category name is required.');
    error.statusCode = 400;
    throw error;
  }

  // Prevent a category from being its own parent or forming a circular dependency
  if (parentCategoryId) {
    if (parseInt(parentCategoryId) === parseInt(id)) {
      const error = new Error('A category cannot be its own parent.');
      error.statusCode = 400;
      throw error;
    }
    const parentCategory = await categoryModel.getCategoryById(parentCategoryId);
    if (!parentCategory) {
      const error = new Error('Parent category not found.');
      error.statusCode = 404;
      throw error;
    }
    // Basic check for direct circular dependency (Category A -> Category B -> Category A)
    if (parentCategory.parent_category_id && parseInt(parentCategory.parent_category_id) === parseInt(id)) {
        const error = new Error('Circular parent-child relationship detected.');
        error.statusCode = 400;
        throw error;
    }
  }

  const updatedCategory = await categoryModel.updateCategory(id, name, description, parentCategoryId);
  return updatedCategory;
};

const deleteCategory = async (id) => {
  const existingCategory = await categoryModel.getCategoryById(id);
  if (!existingCategory) {
    const error = new Error('Category not found.');
    error.statusCode = 404;
    throw error;
  }
  const deletedCategory = await categoryModel.deleteCategory(id);
  return deletedCategory;
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
};