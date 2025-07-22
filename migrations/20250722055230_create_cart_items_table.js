// migrations/YYYYMMDDHHMMSS_create_cart_items_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('cart_items', function(table) {
    table.increments('id').primary();
    table.integer('cart_id').notNullable().unsigned();
    table.integer('product_id').notNullable().unsigned();
    table.integer('product_variant_id').unsigned(); // nullable
    table.integer('quantity').notNullable();
    table.decimal('price_at_add', 10, 2).notNullable();
    table.timestamps(true, true);

    table.foreign('cart_id').references('id').inTable('carts').onDelete('CASCADE');
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.foreign('product_variant_id').references('id').inTable('product_variants').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('cart_items');
};