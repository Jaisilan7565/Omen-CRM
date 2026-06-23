'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Rename contacts table (old KYC representation) to kyc
    await queryInterface.renameTable('contacts', 'kyc');

    // 2. Rename users table (internal staff) to contacts
    await queryInterface.renameTable('users', 'contacts');

    // 3. Rename user_roles association table to contact_roles
    await queryInterface.renameTable('user_roles', 'contact_roles');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert renames
    await queryInterface.renameTable('contact_roles', 'user_roles');
    await queryInterface.renameTable('contacts', 'users');
    await queryInterface.renameTable('kyc', 'contacts');
  }
};
