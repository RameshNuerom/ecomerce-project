// seeds/YYYYMMDDHHMMSS_initial_admin_user.js
const bcrypt = require('bcryptjs'); // We need bcryptjs to hash the password

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries for demonstration.
  // In a real application, you might want to be more selective,
  // e.g., only delete specific test users or check if the admin already exists.
  // await knex('users').del(); // Uncomment if you want to clear all users before seeding

  const adminEmail = 'admin@example.com';
  const adminUsername = 'adminuser';
  const adminPassword = 'Admin@123'; // CHANGE THIS FOR PRODUCTION!

  // Check if an admin user already exists to prevent duplicates on re-seeding
  const existingAdmin = await knex('users').where({ email: adminEmail }).first();

  if (!existingAdmin) {
    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminPassword, 10); // 10 salt rounds

    // Insert the admin user record
    await knex('users').insert([
      {
        username: adminUsername,
        email: adminEmail,
        password_hash: hashedPassword,
        role: 'admin',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      }
    ]);
    console.log(`Admin user '${adminUsername}' seeded successfully.`);
  } else {
    console.log(`Admin user '${adminUsername}' already exists. Skipping seed.`);
  }
};