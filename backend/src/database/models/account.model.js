module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define(
    'Account',
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: { notEmpty: true },
      },
      accountType: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'account_type',
      },
      industry: {
        type: Sequelize.STRING(100),
        allowNull: true,
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
      annualRevenue: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
        field: 'annual_revenue',
      },
      employees: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      billingStreet:  { type: Sequelize.STRING(255), allowNull: true, field: 'billing_street'  },
      billingCity:    { type: Sequelize.STRING(100), allowNull: true, field: 'billing_city'    },
      billingState:   { type: Sequelize.STRING(100), allowNull: true, field: 'billing_state'   },
      billingCountry: { type: Sequelize.STRING(100), allowNull: true, field: 'billing_country' },
      billingZip:     { type: Sequelize.STRING(20),  allowNull: true, field: 'billing_zip'     },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active',
      },
      ownerId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'owner_id',
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'created_by',
      },
      // New CRM Expanded Fields
      category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      organizationProfile: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'organization_profile',
      },
      subIndustry: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'sub_industry',
      },
      linkedinPage: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'linkedin_page',
      },
      yearEstablished: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'year_established',
      },
      employeeSize: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'employee_size',
      },
      annualRevenueRange: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'annual_revenue_range',
      },
      marketSegment: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'market_segment',
      },
      officesCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'offices_count',
      },
      globalPresence: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'global_presence',
      },
      countriesOperation: {
        type: Sequelize.JSONB,
        allowNull: true,
        field: 'countries_operation',
      },
      parentCompanyId: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'parent_company_id',
      },
      gstNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'gst_number',
      },
      panNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'pan_number',
      },
      cinNumber: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'cin_number',
      },
      paymentTerms: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'payment_terms',
      },
      creditLimit: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
        field: 'credit_limit',
      },
      taxExemptionStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'tax_exemption_status',
      },
      billingStreet2: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'billing_street2',
      },
      shippingLocation: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'shipping_location',
      },
      shippingStreet: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'shipping_street',
      },
      shippingCity: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'shipping_city',
      },
      shippingCountry: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'shipping_country',
      },
      shippingPhone: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'shipping_phone',
      },
      primaryContactName: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'primary_contact_name',
      },
      primaryContactDesignation: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'primary_contact_designation',
      },
      primaryContactDepartment: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'primary_contact_department',
      },
      primaryContactEmail: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'primary_contact_email',
      },
      primaryContactMobile: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'primary_contact_mobile',
      },
      primaryContactPhone: {
        type: Sequelize.STRING(50),
        allowNull: true,
        field: 'primary_contact_phone',
      },
      primaryContactLinkedin: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'primary_contact_linkedin',
      },
      cloudProvider: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'cloud_provider',
      },
      dataCentreProvider: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'data_centre_provider',
      },
      systemIntegrator: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'system_integrator',
      },
      securityPartner: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'security_partner',
      },
      techPlatforms: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'tech_platforms',
      },
      digitalInitiatives: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'digital_initiatives',
      },
      existingContracts: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'existing_contracts',
      },
      renewalDates: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'renewal_dates',
      },
      leadSource: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'lead_source',
      },
      accountSource: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'account_source',
      },
      referralPartner: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'referral_partner',
      },
      accountPriority: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'account_priority',
      },
      accountTier: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'account_tier',
      },
      strategicAccount: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'strategic_account',
      },
      estimatedRevenue: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
        field: 'estimated_revenue',
      },
      currentSpend: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
        field: 'current_spend',
      },
      competitorInfo: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'competitor_info',
      },
      keyChallenges: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'key_challenges',
      },
      nextAction: {
        type: Sequelize.STRING(255),
        allowNull: true,
        field: 'next_action',
      },
      nextFollowUpDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'next_follow_up_date',
      },
      existingCustomer: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
        field: 'existing_customer',
      },
      currentProducts: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'current_products',
      },
      previousOrders: {
        type: Sequelize.TEXT,
        allowNull: true,
        field: 'previous_orders',
      },
      lastPurchaseDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'last_purchase_date',
      },
      activeOpportunities: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'active_opportunities',
      },
      expectedDealSize: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true,
        field: 'expected_deal_size',
      },
      expectedClosureDate: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        field: 'expected_closure_date',
      },
      probabilityClosure: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'probability_closure',
      },
      territory: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      region: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      businessUnit: {
        type: Sequelize.STRING(100),
        allowNull: true,
        field: 'business_unit',
      },
      dataQualityScore: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'data_quality_score',
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        field: 'updated_by',
      },
    },
    {
      tableName: 'accounts',
      underscored: true,
      paranoid: true,       // enables soft-delete via deletedAt
      deletedAt: 'deleted_at',
    }
  );

  Account.associate = (db) => {
    Account.belongsTo(db.Contact, { as: 'owner',   foreignKey: 'owner_id' });
    Account.belongsTo(db.Contact, { as: 'creator', foreignKey: 'created_by' });
    Account.belongsTo(db.Contact, { as: 'updater', foreignKey: 'updated_by' });
    Account.belongsTo(db.Account, { as: 'parentCompany', foreignKey: 'parent_company_id' });
    Account.hasMany(db.Account, { as: 'childCompanies', foreignKey: 'parent_company_id' });
    Account.hasMany(db.Kyc, { as: 'kycs', foreignKey: 'account_id' });
  };


  return Account;
};
