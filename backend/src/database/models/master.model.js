module.exports = (sequelize, Sequelize) => {
  const Master = sequelize.define(
    'Master',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        field: 'sort_order',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      tableName: 'masters',
      underscored: true,
      paranoid: false,
      indexes: [
        { unique: true, fields: ['category', 'code'] },
      ],
    }
  );

  return Master;
};
