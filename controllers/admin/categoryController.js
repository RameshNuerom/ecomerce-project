// controllers/admin/categoryController.js
const categoryService = require('../../services/admin/categoryService');

const createCategory = async (req, res, next) => {
  try {
    const { name, description, parent_category_id } = req.body;
    const category = await categoryService.createCategory(name, description, parent_category_id);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryDetails(id);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, parent_category_id } = req.body;
    const updatedCategory = await categoryService.updateCategory(id, name, description, parent_category_id);
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedCategory = await categoryService.deleteCategory(id);
    if (!deletedCategory) { // Should not happen if service throws, but good for safety
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};