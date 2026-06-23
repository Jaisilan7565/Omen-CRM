'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ── 1. Add fields to accounts ──────────────────────────────────────────
    await queryInterface.addColumn('accounts', 'category', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'organization_profile', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'sub_industry', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'linkedin_page', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'year_established', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'employee_size', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'annual_revenue_range', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'market_segment', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'offices_count', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'global_presence', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.addColumn('accounts', 'countries_operation', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'parent_company_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'accounts', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('accounts', 'gst_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'pan_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'cin_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'payment_terms', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'credit_limit', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'tax_exemption_status', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.addColumn('accounts', 'billing_street2', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'shipping_location', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'shipping_street', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'shipping_city', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'shipping_country', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'shipping_phone', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'primary_contact_name', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'primary_contact_designation', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'primary_contact_department', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'primary_contact_email', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'primary_contact_mobile', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'primary_contact_phone', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'primary_contact_linkedin', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'cloud_provider', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'data_centre_provider', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'system_integrator', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'security_partner', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'tech_platforms', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'digital_initiatives', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'existing_contracts', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'renewal_dates', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'lead_source', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'account_source', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'referral_partner', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'account_priority', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'account_tier', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'strategic_account', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.addColumn('accounts', 'estimated_revenue', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'current_spend', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'competitor_info', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'key_challenges', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'next_action', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'next_follow_up_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'existing_customer', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    });
    await queryInterface.addColumn('accounts', 'current_products', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'previous_orders', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'last_purchase_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'active_opportunities', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('accounts', 'expected_deal_size', {
      type: Sequelize.DECIMAL(18, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'expected_closure_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'probability_closure', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'territory', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'region', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'business_unit', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('accounts', 'data_quality_score', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.addColumn('accounts', 'updated_by', {
      type: Sequelize.UUID,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    // ── 2. Create contacts table ───────────────────────────────────────────
    await queryInterface.createTable('contacts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      account_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'accounts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      contact_type: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      kyc_category: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mobile_number1: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      mobile_number2: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      landline_number: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      job_function: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      designation: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      department: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      employee_level: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      employee_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      joining_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      buying_role: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      decision_authority: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      budget_ownership: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      technical_evaluator: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      influencer_score: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      relationship_strength: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      preferred_comm_mode: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      preferred_contact_time: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      time_zone: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      language_preference: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      marketing_consent: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      do_not_contact: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      anniversary_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      linkedin_profile: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      assistant_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      assistant_contact: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      personal_interests: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reporting_to: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'contacts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      account_manager: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      customer_success_manager: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      pre_sales_owner: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      relationship_owner: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      account_team: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      engagement_frequency: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      last_meeting_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      next_follow_up_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      contact_priority: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      relationship_score: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      influence_level: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      decision_making_power: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      customer_sentiment: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      last_interaction_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      last_interaction_notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reporting_function: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      reporting_to_text: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      manager_location: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      manager_function: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      manager_designation: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      manager_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      manager_email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      manager_mobile: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      data_quality_score: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      duplicate_contact_check: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      association_status: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updated_by: {
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
      },
    });

    await queryInterface.addIndex('contacts', ['account_id'], { name: 'contacts_account_id_idx' });
    await queryInterface.addIndex('contacts', ['email'], { name: 'contacts_email_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('contacts');

    await queryInterface.removeColumn('accounts', 'category');
    await queryInterface.removeColumn('accounts', 'organization_profile');
    await queryInterface.removeColumn('accounts', 'sub_industry');
    await queryInterface.removeColumn('accounts', 'linkedin_page');
    await queryInterface.removeColumn('accounts', 'year_established');
    await queryInterface.removeColumn('accounts', 'employee_size');
    await queryInterface.removeColumn('accounts', 'annual_revenue_range');
    await queryInterface.removeColumn('accounts', 'market_segment');
    await queryInterface.removeColumn('accounts', 'offices_count');
    await queryInterface.removeColumn('accounts', 'global_presence');
    await queryInterface.removeColumn('accounts', 'countries_operation');
    await queryInterface.removeColumn('accounts', 'parent_company_id');
    await queryInterface.removeColumn('accounts', 'gst_number');
    await queryInterface.removeColumn('accounts', 'pan_number');
    await queryInterface.removeColumn('accounts', 'cin_number');
    await queryInterface.removeColumn('accounts', 'payment_terms');
    await queryInterface.removeColumn('accounts', 'credit_limit');
    await queryInterface.removeColumn('accounts', 'tax_exemption_status');
    await queryInterface.removeColumn('accounts', 'billing_street2');
    await queryInterface.removeColumn('accounts', 'shipping_location');
    await queryInterface.removeColumn('accounts', 'shipping_street');
    await queryInterface.removeColumn('accounts', 'shipping_city');
    await queryInterface.removeColumn('accounts', 'shipping_country');
    await queryInterface.removeColumn('accounts', 'shipping_phone');
    await queryInterface.removeColumn('accounts', 'primary_contact_name');
    await queryInterface.removeColumn('accounts', 'primary_contact_designation');
    await queryInterface.removeColumn('accounts', 'primary_contact_department');
    await queryInterface.removeColumn('accounts', 'primary_contact_email');
    await queryInterface.removeColumn('accounts', 'primary_contact_mobile');
    await queryInterface.removeColumn('accounts', 'primary_contact_phone');
    await queryInterface.removeColumn('accounts', 'primary_contact_linkedin');
    await queryInterface.removeColumn('accounts', 'cloud_provider');
    await queryInterface.removeColumn('accounts', 'data_centre_provider');
    await queryInterface.removeColumn('accounts', 'system_integrator');
    await queryInterface.removeColumn('accounts', 'security_partner');
    await queryInterface.removeColumn('accounts', 'tech_platforms');
    await queryInterface.removeColumn('accounts', 'digital_initiatives');
    await queryInterface.removeColumn('accounts', 'existing_contracts');
    await queryInterface.removeColumn('accounts', 'renewal_dates');
    await queryInterface.removeColumn('accounts', 'lead_source');
    await queryInterface.removeColumn('accounts', 'account_source');
    await queryInterface.removeColumn('accounts', 'referral_partner');
    await queryInterface.removeColumn('accounts', 'account_priority');
    await queryInterface.removeColumn('accounts', 'account_tier');
    await queryInterface.removeColumn('accounts', 'strategic_account');
    await queryInterface.removeColumn('accounts', 'estimated_revenue');
    await queryInterface.removeColumn('accounts', 'current_spend');
    await queryInterface.removeColumn('accounts', 'competitor_info');
    await queryInterface.removeColumn('accounts', 'key_challenges');
    await queryInterface.removeColumn('accounts', 'next_action');
    await queryInterface.removeColumn('accounts', 'next_follow_up_date');
    await queryInterface.removeColumn('accounts', 'existing_customer');
    await queryInterface.removeColumn('accounts', 'current_products');
    await queryInterface.removeColumn('accounts', 'previous_orders');
    await queryInterface.removeColumn('accounts', 'last_purchase_date');
    await queryInterface.removeColumn('accounts', 'active_opportunities');
    await queryInterface.removeColumn('accounts', 'expected_deal_size');
    await queryInterface.removeColumn('accounts', 'expected_closure_date');
    await queryInterface.removeColumn('accounts', 'probability_closure');
    await queryInterface.removeColumn('accounts', 'territory');
    await queryInterface.removeColumn('accounts', 'region');
    await queryInterface.removeColumn('accounts', 'business_unit');
    await queryInterface.removeColumn('accounts', 'data_quality_score');
    await queryInterface.removeColumn('accounts', 'updated_by');
  },
};
