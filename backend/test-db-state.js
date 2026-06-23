const db = require('./src/database/models');

async function run() {
  try {
    const contactCount = await db.Contact.count();
    const accountCount = await db.Account.count();
    const kycCount = await db.Kyc.count();
    console.log(`Current DB state:\n- Contacts: ${contactCount}\n- Accounts: ${accountCount}\n- KYCs: ${kycCount}`);
    
    if (accountCount > 0) {
      const accounts = await db.Account.findAll({ limit: 3 });
      console.log("Sample Accounts:", accounts.map(a => ({ id: a.id, name: a.name })));
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
