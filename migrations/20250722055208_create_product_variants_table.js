// migrations/YYYYMMDDHHMMSS_create_product_variants_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('product_variants', function(table) {
    table.increments('id').primary();
    table.integer('product_id').notNullable().unsigned();
    table.string('attribute_name', 100).notNullable();
    table.string('attribute_value', 100).notNullable();
    table.decimal('additional_price', 10, 2).defaultTo(0.00);
    table.integer('stock_quantity').notNullable();
    table.timestamps(true, true);

    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('product_variants');
};