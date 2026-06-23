const bcrypt = require('bcrypt');
const db = require('../src/database/models');

async function seedAdmin() {
  try {
    // Ensure connection is established
    await db.sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync is not needed since migrations ran, but let's check roles
    const [platformAdminRole, roleCreated] = await db.Role.findOrCreate({
      where: { code: 'PLATFORM_ADMIN' },
      defaults: {
        name: 'Platform Administrator'
      }
    });

    if (roleCreated) {
      console.log('PLATFORM_ADMIN role created successfully.');
    } else {
      console.log('PLATFORM_ADMIN role already exists.');
    }

    // Check if the admin user exists
    const adminEmail = 'jaisilan@gmail.com';
    const existingUser = await db.Contact.findOne({ where: { email: adminEmail } });

    if (!existingUser) {
      const passwordHash = await bcrypt.hash('jayking46', 10);
      const adminUser = await db.Contact.create({
        fullName: 'Platform Admin',
        email: adminEmail,
        password: passwordHash,
        status: 'active'
      });

      console.log('Admin user created successfully.');

      // Associate admin user with PLATFORM_ADMIN role
      await adminUser.addRole(platformAdminRole);
      console.log('Admin user associated with PLATFORM_ADMIN role.');
    } else {
      console.log('Admin user already exists.');
      
      // Ensure association exists
      const hasRole = await existingUser.hasRole(platformAdminRole);
      if (!hasRole) {
        await existingUser.addRole(platformAdminRole);
        console.log('Admin user associated with PLATFORM_ADMIN role.');
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
