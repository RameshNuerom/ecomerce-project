// migrations/YYYYMMDDHHMMSS_create_addresses_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('addresses', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().unsigned();
    table.string('address_line1', 255).notNullable();
    table.string('address_line2', 255); // nullable by default
    table.string('city', 100).notNullable();
    table.string('state', 100).notNullable();
    table.string('postal_code', 20).notNullable();
    table.string('country', 100).notNullable();
    table.boolean('is_default').defaultTo(false);
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('addresses');
};