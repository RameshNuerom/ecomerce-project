// migrations/YYYYMMDDHHMMSS_create_products_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('products', function(table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable();
    table.text('description'); // nullable by default
    table.decimal('price', 10, 2).notNullable(); // 10 total digits, 2 after decimal
    table.integer('stock_quantity').notNullable();
    table.integer('category_id').notNullable().unsigned();
    table.string('image_url', 255); // nullable by default
    table.timestamps(true, true);

    table.foreign('category_id').references('id').inTable('categories').onDelete('RESTRICT'); // Don't delete category if products exist
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products');
};