// migrations/YYYYMMDDHHMMSS_create_orders_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('orders', function(table) {
    table.increments('id').primary();
    table.integer('user_id').notNullable().unsigned();
    table.integer('shipping_address_id').notNullable().unsigned();
    table.decimal('total_amount', 10, 2).notNullable();
    table.specificType('order_status', 'order_status_enum').notNullable().defaultTo('pending');
    table.specificType('payment_status', 'payment_status_enum').notNullable().defaultTo('pending');
    table.timestamp('order_date').defaultTo(knex.fn.now());
    table.timestamp('delivered_at'); // nullable by default
    table.timestamps(true, true);

    table.foreign('user_id').references('id').inTable('users').onDelete('RESTRICT');
    table.foreign('shipping_address_id').references('id').inTable('addresses').onDelete('RESTRICT');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('orders');
};