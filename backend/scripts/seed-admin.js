const db = require('../src/database/models');

async function seedAdmin() {
  try {
    // Ensure connection is established
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Check if the admin user exists
    const adminEmail = 'jaisilan@gmail.com';
    const [adminUser, created] = await db.Contact.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        fullName: 'Platform Admin',
        status: 'active'
      }
    });

    if (created) {
      console.log('Admin contact created successfully.');
    } else {
      console.log('Admin contact already exists.');
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin contact:', error);
    process.exit(1);
  }
}

seedAdmin();
