// migrations/YYYYMMDDHHMMSS_create_enum_types.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`
    CREATE TYPE user_role_enum AS ENUM ('customer', 'admin', 'delivery_agent');
    CREATE TYPE order_status_enum AS ENUM ('pending', 'processing', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled');
    CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'failed', 'refunded');
    CREATE TYPE delivery_agent_status_enum AS ENUM ('available', 'assigned', 'busy');
    CREATE TYPE delivery_status_enum AS ENUM ('assigned', 'picked_up', 'in_transit', 'delivered', 'failed');
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`
    DROP TYPE IF EXISTS user_role_enum;
    DROP TYPE IF EXISTS order_status_enum;
    DROP TYPE IF EXISTS payment_status_enum;
    DROP TYPE IF EXISTS delivery_agent_status_enum;
    DROP TYPE IF EXISTS delivery_status_enum;
  `);
};