// migrations/YYYYMMDDHHMMSS_create_categories_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('categories', function(table) {
    table.increments('id').primary();
    table.string('name', 255).unique().notNullable();
    table.text('description'); // nullable by default
    table.integer('parent_category_id').unsigned(); // nullable by default
    table.timestamps(true, true);

    table.foreign('parent_category_id').references('id').inTable('categories').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('categories');
};