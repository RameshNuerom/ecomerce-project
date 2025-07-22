exports.seed = async function(knex) {
  // Step 1: Delete product_variants → products → categories (order matters)
  await knex('product_variants').del();
  await knex('products').del();
  await knex('categories').del();

  // Step 2: Insert parent categories
  const [menId, womenId, kidsId, accessoriesId] = await knex('categories').insert([
    { name: 'Men', description: 'Fashion for Men', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Women', description: 'Fashion for Women', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Kids', description: 'Fashion for Kids', created_at: knex.fn.now(), updated_at: knex.fn.now() },
    { name: 'Accessories', description: 'Fashion Accessories', created_at: knex.fn.now(), updated_at: knex.fn.now() },
  ], ['id']); // Return the IDs of the inserted rows

  // Step 3: Insert subcategories
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
