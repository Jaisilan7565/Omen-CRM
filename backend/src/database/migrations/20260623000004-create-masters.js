'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('masters', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'e.g. ACCOUNT_TYPE, INDUSTRY, LEAD_SOURCE, ACCOUNT_STATUS',
      },
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: 'Unique key within category, e.g. TECHNOLOGY, RETAIL',
      },
      label: {
        type: Sequelize.STRING(200),
        allowNull: false,
        comment: 'Human-readable display label',
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    });

    // Composite unique index: category + code
    await queryInterface.addIndex('masters', ['category', 'code'], {
      unique: true,
      name: 'masters_category_code_unique',
    });

    // Index for fast category lookups
    await queryInterface.addIndex('masters', ['category', 'is_active', 'sort_order'], {
      name: 'masters_category_active_sort_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('masters');
  },
};
