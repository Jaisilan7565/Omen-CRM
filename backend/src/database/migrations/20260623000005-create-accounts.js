'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      account_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Ref: masters.code WHERE category=ACCOUNT_TYPE',
      },
      industry: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Ref: masters.code WHERE category=INDUSTRY',
      },
      website: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      annual_revenue: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
      },
      employees: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      billing_street: { type: Sequelize.STRING(255), allowNull: true },
      billing_city:   { type: Sequelize.STRING(100), allowNull: true },
      billing_state:  { type: Sequelize.STRING(100), allowNull: true },
      billing_country: { type: Sequelize.STRING(100), allowNull: true },
      billing_zip:    { type: Sequelize.STRING(20), allowNull: true },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: false,
        defaultValue: 'active',
      },
      owner_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Soft-delete timestamp',
      },
    });

    await queryInterface.addIndex('accounts', ['name'], { name: 'accounts_name_idx' });
    await queryInterface.addIndex('accounts', ['status'], { name: 'accounts_status_idx' });
    await queryInterface.addIndex('accounts', ['owner_id'], { name: 'accounts_owner_idx' });
    await queryInterface.addIndex('accounts', ['deleted_at'], { name: 'accounts_deleted_at_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('accounts');
  },
};
