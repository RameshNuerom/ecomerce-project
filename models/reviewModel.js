// models/reviewModel.js
const { query } = require('../config/database');

const createReview = async (productId, userId, rating, reviewText) => {
  const res = await query(
    `INSERT INTO product_reviews (product_id, user_id, rating, review_text)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [productId, userId, rating, reviewText]
  );
  return res.rows[0];
};

const getReviewById = async (reviewId) => {
  const res = await query('SELECT * FROM product_reviews WHERE id = $1', [reviewId]);
  return res.rows[0];
};

const getReviewByProductAndUser = async (productId, userId) => {
    const res = await query(
        'SELECT * FROM product_reviews WHERE product_id = $1 AND user_id = $2',
        [productId, userId]
    );
    return res.rows[0];
};

const getReviewsByProductId = async (productId) => {
  const res = await query(
    `SELECT pr.*, u.username AS reviewer_username, u.email AS reviewer_email
     FROM product_reviews pr
     JOIN users u ON pr.user_id = u.id
     WHERE pr.product_id = $1
     ORDER BY pr.created_at DESC`,
    [productId]
  );
  return res.rows;
};

const getReviewsByUserId = async (userId) => {
  const res = await query(
    `SELECT pr.*, p.name AS product_name, p.image_url
     FROM product_reviews pr
     JOIN products p ON pr.product_id = p.id
     WHERE pr.user_id = $1
     ORDER BY pr.created_at DESC`,
    [userId]
  );
  return res.rows;
};

const updateReview = async (reviewId, rating, reviewText) => {
  const res = await query(
    `UPDATE product_reviews
     SET rating = COALESCE($1, rating),
         review_text = COALESCE($2, review_text),
         updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [rating, reviewText, reviewId]
  );
  return res.rows[0];
};

const deleteReview = async (reviewId) => {
  const res = await query('DELETE FROM product_reviews WHERE id = $1 RETURNING *', [reviewId]);
  return res.rows[0];
};

const getAverageRatingAndCount = async (productId) => {
    const res = await query(
        `SELECT
            COALESCE(AVG(rating), 0)::numeric(3,2) AS average_rating,
            COUNT(id) AS review_count
         FROM product_reviews
         WHERE product_id = $1`,
        [productId]
    );
    return res.rows[0];
};

module.exports = {
  createReview,
  getReviewById,
  getReviewByProductAndUser,
  getReviewsByProductId,
  getReviewsByUserId,
  updateReview,
  deleteReview,
  getAverageRatingAndCount,
};