'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING(50), allowNull: true,
    });
    await queryInterface.addColumn('users', 'employee_id', {
      type: Sequelize.STRING(50), allowNull: true,
    });
    await queryInterface.addColumn('users', 'designation', {
      type: Sequelize.STRING(255), allowNull: true,
    });
    await queryInterface.addColumn('users', 'department', {
      type: Sequelize.STRING(255), allowNull: true,
    });
    await queryInterface.addColumn('users', 'timezone', {
      type: Sequelize.STRING(100), allowNull: true,
    });
    await queryInterface.addColumn('users', 'language', {
      type: Sequelize.STRING(50), allowNull: true,
    });
    await queryInterface.addColumn('users', 'bio', {
      type: Sequelize.TEXT, allowNull: true,
    });
    await queryInterface.addColumn('users', 'location', {
      type: Sequelize.STRING(255), allowNull: true,
    });
    await queryInterface.addColumn('users', 'linkedin_url', {
      type: Sequelize.STRING(255), allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'employee_id');
    await queryInterface.removeColumn('users', 'designation');
    await queryInterface.removeColumn('users', 'department');
    await queryInterface.removeColumn('users', 'timezone');
    await queryInterface.removeColumn('users', 'language');
    await queryInterface.removeColumn('users', 'bio');
    await queryInterface.removeColumn('users', 'location');
    await queryInterface.removeColumn('users', 'linkedin_url');
  },
};
