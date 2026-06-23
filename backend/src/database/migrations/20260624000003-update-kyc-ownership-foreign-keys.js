'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Null out existing values in these columns to prevent foreign key violation on schema change
    await queryInterface.sequelize.query(`
      UPDATE "kyc" 
      SET 
        "account_manager" = NULL, 
        "customer_success_manager" = NULL, 
        "pre_sales_owner" = NULL, 
        "relationship_owner" = NULL;
    `);

    // 2. Drop the old foreign keys pointing to contacts table
    await queryInterface.removeConstraint('kyc', 'contacts_account_manager_fkey');
    await queryInterface.removeConstraint('kyc', 'contacts_customer_success_manager_fkey');
    await queryInterface.removeConstraint('kyc', 'contacts_pre_sales_owner_fkey');
    await queryInterface.removeConstraint('kyc', 'contacts_relationship_owner_fkey');

    // 3. Add the new foreign keys pointing to kyc table
    await queryInterface.addConstraint('kyc', {
      fields: ['account_manager'],
      type: 'foreign key',
      name: 'contacts_account_manager_fkey',
      references: {
        table: 'kyc',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('kyc', {
      fields: ['customer_success_manager'],
      type: 'foreign key',
      name: 'contacts_customer_success_manager_fkey',
      references: {
        table: 'kyc',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('kyc', {
      fields: ['pre_sales_owner'],
      type: 'foreign key',
      name: 'contacts_pre_sales_owner_fkey',
      references: {
        table: 'kyc',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('kyc', {
      fields: ['relationship_owner'],
      type: 'foreign key',
      name: 'contacts_relationship_owner_fkey',
      references: {
        table: 'kyc',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Null out values to avoid violation when reverting
    await queryInterface.sequelize.query(`
      UPDATE "kyc" 
      SET 
        "account_manager" = NULL, 
        "customer_success_manager" = NULL, 
        "pre_sales_owner" = NULL, 
        "relationship_owner" = NULL;
    `);

    // 2. Drop new constraints
    await queryInterface.removeConstraint('kyc', 'contacts_account_manager_fkey');
    await queryInterface.removeConstraint('kyc', 'contacts_customer_success_manager_fkey');
    await queryInterface.removeConstraint('kyc', 'contacts_pre_sales_owner_fkey');
    await queryInterface.removeConstraint('kyc', 'contacts_relationship_owner_fkey');

    // 3. Add back original constraints referencing contacts table
    await queryInterface.addConstraint('kyc', {
      fields: ['account_manager'],
      type: 'foreign key',
      name: 'contacts_account_manager_fkey',
      references: {
        table: 'contacts',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('kyc', {
      fields: ['customer_success_manager'],
      type: 'foreign key',
      name: 'contacts_customer_success_manager_fkey',
      references: {
        table: 'contacts',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('kyc', {
      fields: ['pre_sales_owner'],
      type: 'foreign key',
      name: 'contacts_pre_sales_owner_fkey',
      references: {
        table: 'contacts',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('kyc', {
      fields: ['relationship_owner'],
      type: 'foreign key',
      name: 'contacts_relationship_owner_fkey',
      references: {
        table: 'contacts',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
};
