module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'full_name'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    },
    // ── Extended profile fields ────────────────────────────────────────────
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'employee_id',
    },
    designation: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    linkedinUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'linkedin_url',
    },
  }, {
    tableName: 'contacts',
    underscored: true
  });
  return Contact;
};
