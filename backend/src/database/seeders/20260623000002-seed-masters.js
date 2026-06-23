'use strict';

const MASTERS = [
  // ── ACCOUNT TYPE ──────────────────────────────────────────────────────────
  { category: 'ACCOUNT_TYPE', code: 'ANALYST',      label: 'Analyst',            sort_order: 1 },
  { category: 'ACCOUNT_TYPE', code: 'COMPETITOR',   label: 'Competitor',          sort_order: 2 },
  { category: 'ACCOUNT_TYPE', code: 'CUSTOMER',     label: 'Customer',            sort_order: 3 },
  { category: 'ACCOUNT_TYPE', code: 'DISTRIBUTOR',  label: 'Distributor',         sort_order: 4 },
  { category: 'ACCOUNT_TYPE', code: 'INTEGRATOR',   label: 'Integrator',          sort_order: 5 },
  { category: 'ACCOUNT_TYPE', code: 'INVESTOR',     label: 'Investor',            sort_order: 6 },
  { category: 'ACCOUNT_TYPE', code: 'OTHER',        label: 'Other',               sort_order: 7 },
  { category: 'ACCOUNT_TYPE', code: 'PARTNER',      label: 'Partner',             sort_order: 8 },
  { category: 'ACCOUNT_TYPE', code: 'PRESS',        label: 'Press',               sort_order: 9 },
  { category: 'ACCOUNT_TYPE', code: 'PROSPECT',     label: 'Prospect',            sort_order: 10 },
  { category: 'ACCOUNT_TYPE', code: 'RESELLER',     label: 'Reseller',            sort_order: 11 },
  { category: 'ACCOUNT_TYPE', code: 'VENDOR',       label: 'Vendor',              sort_order: 12 },

  // ── INDUSTRY ─────────────────────────────────────────────────────────────
  { category: 'INDUSTRY', code: 'AEROSPACE',         label: 'Aerospace',                    sort_order: 1  },
  { category: 'INDUSTRY', code: 'AGRICULTURE',       label: 'Agriculture',                  sort_order: 2  },
  { category: 'INDUSTRY', code: 'AUTOMOTIVE',        label: 'Automotive',                   sort_order: 3  },
  { category: 'INDUSTRY', code: 'BANKING',           label: 'Banking',                      sort_order: 4  },
  { category: 'INDUSTRY', code: 'BIOTECHNOLOGY',     label: 'Biotechnology',                sort_order: 5  },
  { category: 'INDUSTRY', code: 'CHEMICALS',         label: 'Chemicals',                    sort_order: 6  },
  { category: 'INDUSTRY', code: 'COMMUNICATIONS',    label: 'Communications',               sort_order: 7  },
  { category: 'INDUSTRY', code: 'CONSTRUCTION',      label: 'Construction',                 sort_order: 8  },
  { category: 'INDUSTRY', code: 'CONSULTING',        label: 'Consulting',                   sort_order: 9  },
  { category: 'INDUSTRY', code: 'EDUCATION',         label: 'Education',                    sort_order: 10 },
  { category: 'INDUSTRY', code: 'ELECTRONICS',       label: 'Electronics',                  sort_order: 11 },
  { category: 'INDUSTRY', code: 'ENERGY',            label: 'Energy',                       sort_order: 12 },
  { category: 'INDUSTRY', code: 'ENGINEERING',       label: 'Engineering',                  sort_order: 13 },
  { category: 'INDUSTRY', code: 'ENTERTAINMENT',     label: 'Entertainment',                sort_order: 14 },
  { category: 'INDUSTRY', code: 'ENVIRONMENTAL',     label: 'Environmental',                sort_order: 15 },
  { category: 'INDUSTRY', code: 'FINANCE',           label: 'Finance',                      sort_order: 16 },
  { category: 'INDUSTRY', code: 'FOOD_BEVERAGE',     label: 'Food & Beverage',              sort_order: 17 },
  { category: 'INDUSTRY', code: 'GOVERNMENT',        label: 'Government',                   sort_order: 18 },
  { category: 'INDUSTRY', code: 'HEALTHCARE',        label: 'Healthcare',                   sort_order: 19 },
  { category: 'INDUSTRY', code: 'HOSPITALITY',       label: 'Hospitality',                  sort_order: 20 },
  { category: 'INDUSTRY', code: 'INSURANCE',         label: 'Insurance',                    sort_order: 21 },
  { category: 'INDUSTRY', code: 'LEGAL',             label: 'Legal',                        sort_order: 22 },
  { category: 'INDUSTRY', code: 'LOGISTICS',         label: 'Logistics / Transportation',   sort_order: 23 },
  { category: 'INDUSTRY', code: 'MANUFACTURING',     label: 'Manufacturing',                sort_order: 24 },
  { category: 'INDUSTRY', code: 'MEDIA',             label: 'Media',                        sort_order: 25 },
  { category: 'INDUSTRY', code: 'MINING',            label: 'Mining',                       sort_order: 26 },
  { category: 'INDUSTRY', code: 'NOT_FOR_PROFIT',    label: 'Not For Profit',               sort_order: 27 },
  { category: 'INDUSTRY', code: 'OTHER',             label: 'Other',                        sort_order: 28 },
  { category: 'INDUSTRY', code: 'PHARMACEUTICALS',   label: 'Pharmaceuticals',              sort_order: 29 },
  { category: 'INDUSTRY', code: 'REAL_ESTATE',       label: 'Real Estate',                  sort_order: 30 },
  { category: 'INDUSTRY', code: 'RETAIL',            label: 'Retail',                       sort_order: 31 },
  { category: 'INDUSTRY', code: 'TECHNOLOGY',        label: 'Technology',                   sort_order: 32 },
  { category: 'INDUSTRY', code: 'TELECOMMUNICATIONS',label: 'Telecommunications',           sort_order: 33 },
  { category: 'INDUSTRY', code: 'UTILITIES',         label: 'Utilities',                    sort_order: 34 },

  // ── LEAD SOURCE ───────────────────────────────────────────────────────────
  { category: 'LEAD_SOURCE', code: 'COLD_CALL',      label: 'Cold Call',           sort_order: 1 },
  { category: 'LEAD_SOURCE', code: 'EMAIL',          label: 'Email',               sort_order: 2 },
  { category: 'LEAD_SOURCE', code: 'EMPLOYEE',       label: 'Employee Referral',   sort_order: 3 },
  { category: 'LEAD_SOURCE', code: 'EXTERNAL_REF',   label: 'External Referral',   sort_order: 4 },
  { category: 'LEAD_SOURCE', code: 'INTERNAL_REF',   label: 'Internal Referral',   sort_order: 5 },
  { category: 'LEAD_SOURCE', code: 'ONLINE_STORE',   label: 'Online Store',        sort_order: 6 },
  { category: 'LEAD_SOURCE', code: 'OTHER',          label: 'Other',               sort_order: 7 },
  { category: 'LEAD_SOURCE', code: 'PARTNER',        label: 'Partner',             sort_order: 8 },
  { category: 'LEAD_SOURCE', code: 'PUBLIC_RELATION', label: 'Public Relations',   sort_order: 9 },
  { category: 'LEAD_SOURCE', code: 'TRADE_SHOW',     label: 'Trade Show',          sort_order: 10 },
  { category: 'LEAD_SOURCE', code: 'WEB_DOWNLOAD',   label: 'Web Download',        sort_order: 11 },
  { category: 'LEAD_SOURCE', code: 'WEB_RESEARCH',   label: 'Web Research',        sort_order: 12 },
  { category: 'LEAD_SOURCE', code: 'WORD_OF_MOUTH',  label: 'Word of Mouth',       sort_order: 13 },

  // ── ACCOUNT STATUS ────────────────────────────────────────────────────────
  { category: 'ACCOUNT_STATUS', code: 'ACTIVE',     label: 'Active',     sort_order: 1 },
  { category: 'ACCOUNT_STATUS', code: 'INACTIVE',   label: 'Inactive',   sort_order: 2 },
  { category: 'ACCOUNT_STATUS', code: 'ON_HOLD',    label: 'On Hold',    sort_order: 3 },
  { category: 'ACCOUNT_STATUS', code: 'CHURNED',    label: 'Churned',    sort_order: 4 },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const rows = MASTERS.map((m) => ({
      id: Sequelize.literal('gen_random_uuid()'),
      category: m.category,
      code: m.code,
      label: m.label,
      sort_order: m.sort_order,
      is_active: true,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert('masters', rows, {
      ignoreDuplicates: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('masters', null, {});
  },
};
