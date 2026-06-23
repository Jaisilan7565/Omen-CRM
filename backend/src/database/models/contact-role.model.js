module.exports = (sequelize, DataTypes) => {
  const ContactRole = sequelize.define('ContactRole', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_id',
      references: { model: 'contacts', key: 'id' }
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'role_id',
      references: { model: 'roles', key: 'id' }
    }
  }, {
    tableName: 'contact_roles',
    underscored: true
  });
  return ContactRole;
};
