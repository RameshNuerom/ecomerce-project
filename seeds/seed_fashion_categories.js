// seeds/YYYYMMDDHHMMSS_seed_fashion_categories.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries in the categories table before seeding
  // This ensures a clean slate for your 10 records.
  await knex('categories').del();

  // Insert parent categories first
  const [menId, womenId, kidsId, accessoriesId] = await knex('categories').insert([
    { name: 'Men', description: 'Fashion for Men', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Women', description: 'Fashion for Women', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Kids', description: 'Fashion for Kids', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Accessories', description: 'Fashion Accessories', created_at: knex.fn.now(), updated_at: knex.fn.now() },
  ], ['id']); // Return the IDs of the inserted rows

  // Insert subcategories with parent_category_id
  await knex('categories').insert([
    { name: 'T-Shirts', description: 'Casual T-Shirts', parent_category_id: menId.id, created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Jeans', description: 'Denim Jeans', parent_category_id: menId.id, created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Dresses', description: 'Elegant and Casual Dresses', parent_category_id: womenId.id, created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Kurtas', description: 'Traditional Indian Kurtas', parent_category_id: womenId.id, created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Footwear', description: 'Shoes, Sandals, and more', parent_category_id: accessoriesId.id, created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Watches', description: 'Wristwatches and Smartwatches', parent_category_id: accessoriesId.id, created_at: knex.fn.now(), updated_at: knex.fn.now() },
  ]);

  console.log('10 fashion categories seeded successfully!');
};