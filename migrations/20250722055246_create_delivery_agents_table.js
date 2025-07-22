// migrations/YYYYMMDDHHMMSS_create_delivery_agents_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('delivery_agents', function(table) {
    table.increments('id').primary();
    table.integer('user_id').unique().notNullable().unsigned(); // Links to a user with role 'delivery_agent'
    table.string('company_name', 255); // nullable
    table.string('contact_number', 20); // nullable
    table.specificType('status', 'delivery_agent_status_enum').notNullable().defaultTo('available');
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('delivery_agents');
};