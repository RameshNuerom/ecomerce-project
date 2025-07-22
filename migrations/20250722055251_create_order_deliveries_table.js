// migrations/YYYYMMDDHHMMSS_create_order_deliveries_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('order_deliveries', function(table) {
    table.increments('id').primary();
    table.integer('order_id').unique().notNullable().unsigned();
    table.integer('delivery_agent_id').unsigned(); // nullable
    table.string('tracking_number', 255).unique(); // nullable
    table.specificType('delivery_status', 'delivery_status_enum').notNullable().defaultTo('assigned');
    table.timestamp('assigned_at').defaultTo(knex.fn.now());
    table.timestamp('picked_up_at'); // nullable
    table.timestamp('delivered_at'); // nullable
    table.timestamps(true, true);

    table.foreign('order_id').references('id').inTable('orders').onDelete('CASCADE');
    table.foreign('delivery_agent_id').references('id').inTable('delivery_agents').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('order_deliveries');
};