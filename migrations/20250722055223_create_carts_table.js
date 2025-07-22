// migrations/YYYYMMDDHHMMSS_create_carts_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('carts', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unique().notNullable().unsigned(); // Each user has one cart
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('carts');
};