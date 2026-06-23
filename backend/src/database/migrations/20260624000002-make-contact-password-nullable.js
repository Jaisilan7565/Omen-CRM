'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Drop contact_roles table
    await queryInterface.dropTable('contact_roles');
    
    // 2. Drop roles table
    await queryInterface.dropTable('roles');

    // 3. Drop password column from contacts table
    await queryInterface.removeColumn('contacts', 'password');
  },

  down: async (queryInterface, Sequelize) => {
    // Restore contacts.password column
    await queryInterface.addColumn('contacts', 'password', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Recreate roles table
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Recreate contact_roles table
    await queryInterface.createTable('contact_roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'contacts', key: 'id' },
        onDelete: 'CASCADE'
      },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  }
};
