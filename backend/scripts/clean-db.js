const db = require('../src/database/models');

async function cleanDatabaseExceptAdmin() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');

    console.log('\n--- Cleaning Database ---');
    
    // Find platform admin
    const platformAdmin = await db.Contact.findOne({ where: { email: 'jaisilan@gmail.com' } });
    if (!platformAdmin) {
      console.log('Platform Admin not found. Please run seed:admin first.');
      if (require.main === module) {
        process.exit(1);
      } else {
        throw new Error('Platform Admin not found. Please run seed:admin first.');
      }
    }
    const adminId = platformAdmin.id;

    // Delete Kyc records
    await db.Kyc.destroy({ where: {} });
    console.log('KYC records cleared.');

    // Delete Account records
    await db.Account.destroy({ where: {} });
    console.log('Account records cleared.');

    // Delete Contacts except Platform Admin
    await db.Contact.destroy({
      where: {
        id: { [db.Sequelize.Op.ne]: adminId }
      }
    });
    console.log('Contact records cleared (except Platform Admin).');

    console.log('\nDatabase cleaned successfully (except Platform Admin)!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('Error cleaning database:', err);
    if (require.main === module) {
      process.exit(1);
    } else {
      throw err;
    }
  }
}

if (require.main === module) {
  cleanDatabaseExceptAdmin();
} else {
  module.exports = cleanDatabaseExceptAdmin;
}
