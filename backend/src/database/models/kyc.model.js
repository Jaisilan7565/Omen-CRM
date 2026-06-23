module.exports = (sequelize, Sequelize) => {
  const Kyc = sequelize.define(
    'Kyc',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'account_id',
      },
      contactType: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'contact_type',
      },
      kycCategory: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'kyc_category',
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'last_name',
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: { isEmail: true },
      },
      mobileNumber1: {
        type: Sequelize.STRING(50),
        allowNull: false,
        field: 'mobile_number1',
      },
      mobileNumber2: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'mobile_number2',
      },
      landlineNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'landline_number',
      },
      jobFunction: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'job_function',
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      employeeLevel: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'employee_level',
      },
      employeeId: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'employee_id',
      },
      joiningDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'joining_date',
      },
      buyingRole: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: 'buying_role',
      },
      decisionAuthority: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'decision_authority',
      },
      budgetOwnership: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'budget_ownership',
      },
      technicalEvaluator: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'technical_evaluator',
      },
      influencerScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'influencer_score',
      },
      relationshipStrength: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'relationship_strength',
      },
      preferredCommMode: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: 'preferred_comm_mode',
      },
      preferredContactTime: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'preferred_contact_time',
      },
      timeZone: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'time_zone',
      },
      languagePreference: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'language_preference',
      },
      marketingConsent: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'marketing_consent',
      },
      doNotContact: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'do_not_contact',
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      anniversaryDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'anniversary_date',
      },
      linkedinProfile: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'linkedin_profile',
      },
      assistantName: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'assistant_name',
      },
      assistantContact: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'assistant_contact',
      },
      personalInterests: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: 'personal_interests',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reportingTo: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'reporting_to',
      },
      accountManager: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'account_manager',
      },
      customerSuccessManager: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'customer_success_manager',
      },
      preSalesOwner: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'pre_sales_owner',
      },
      relationshipOwner: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'relationship_owner',
      },
      accountTeam: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: 'account_team',
      },
      engagementFrequency: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'engagement_frequency',
      },
      lastMeetingDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'last_meeting_date',
      },
      nextFollowUpDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'next_follow_up_date',
      },
      contactPriority: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'contact_priority',
      },
      relationshipScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'relationship_score',
      },
      influenceLevel: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'influence_level',
      },
      decisionMakingPower: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'decision_making_power',
      },
      customerSentiment: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'customer_sentiment',
      },
      lastInteractionDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'last_interaction_date',
      },
      lastInteractionNotes: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'last_interaction_notes',
      },
      reportingFunction: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'reporting_function',
      },
      reportingToText: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'reporting_to_text',
      },
      managerLocation: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'manager_location',
      },
      managerFunction: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'manager_function',
      },
      managerDesignation: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'manager_designation',
      },
      managerName: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'manager_name',
      },
      managerEmail: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'manager_email',
      },
      managerMobile: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'manager_mobile',
      },
      dataQualityScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'data_quality_score',
      },
      duplicateContactCheck: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'duplicate_contact_check',
      },
      associationStatus: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'association_status',
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'created_by',
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'updated_by',
      },
    },
    {
      tableName: 'kyc',
      underscored: true,
      paranoid: true,       // enables soft-delete via deletedAt
      deletedAt: 'deleted_at',
    }
  );

  Kyc.associate = (db) => {
    Kyc.belongsTo(db.Account, { as: 'account', foreignKey: 'account_id' });
    Kyc.belongsTo(db.Kyc, { as: 'manager',          foreignKey: 'reporting_to' });
    Kyc.hasMany(db.Kyc,    { as: 'directReports',   foreignKey: 'reporting_to' });
    Kyc.belongsTo(db.Kyc,  { as: 'accManagerKyc',   foreignKey: 'account_manager' });
    Kyc.belongsTo(db.Kyc,  { as: 'csmKyc',          foreignKey: 'customer_success_manager' });
    Kyc.belongsTo(db.Kyc,  { as: 'preSalesKyc',     foreignKey: 'pre_sales_owner' });
    Kyc.belongsTo(db.Kyc,  { as: 'relOwnerKyc',     foreignKey: 'relationship_owner' });
    Kyc.belongsTo(db.Contact, { as: 'creator', foreignKey: 'created_by' });
    Kyc.belongsTo(db.Contact, { as: 'updater', foreignKey: 'updated_by' });
  };

  return Kyc;
};
