const db = require('../src/database/models');
const kycService = require('../src/modules/kyc/kyc.service');

async function test() {
  try {
    // Sanjay Kumar's email is s.kumar@techglora.com
    const firstAccount = await db.Account.findOne();
    if (!firstAccount) {
      console.error('No account found');
      return;
    }

    const firstContact = await db.Contact.findOne();
    if (!firstContact) {
      console.error('No contact found');
      return;
    }

    console.log('--- Creating duplicate email KYC ---');
    const duplicateKyc = await kycService.create({
      accountId: firstAccount.id,
      contactType: 'Influencer',
      kycCategory: 'Individual',
      firstName: 'Sanjay Clone',
      lastName: 'Kumar',
      email: 's.kumar@techglora.com', // Duplicate email
      mobileNumber1: '+91 99999 99999',
      jobFunction: 'IT',
      designation: 'Architect',
      department: 'Infrastructure',
    }, firstContact.id);

    console.log('Created duplicate KYC:', {
      id: duplicateKyc.id,
      firstName: duplicateKyc.firstName,
      email: duplicateKyc.email,
      duplicateContactCheck: duplicateKyc.duplicateContactCheck,
      associationStatus: duplicateKyc.associationStatus,
    });

    // Cleanup
    await db.Kyc.destroy({ where: { id: duplicateKyc.id }, force: true });
    console.log('Cleaned up successfully');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

test();
