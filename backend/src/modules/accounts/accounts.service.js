const { Op } = require('sequelize');
const db = require('../../database/models');
const ApiError = require('../../common/api/ApiError');

// ── Column projection ────────────────────────────────────────────────────────
const ACCOUNT_ATTRS = [
  'id', 'name', 'accountType', 'industry', 'website', 'phone', 'email',
  'annualRevenue', 'employees',
  'billingStreet', 'billingCity', 'billingState', 'billingCountry', 'billingZip',
  'description', 'status', 'ownerId', 'createdBy', 'createdAt', 'updatedAt',
  // New CRM B2B Fields
  'category', 'organizationProfile', 'subIndustry', 'linkedinPage', 'yearEstablished', 'employeeSize',
  'annualRevenueRange', 'marketSegment', 'officesCount', 'globalPresence', 'countriesOperation',
  'parentCompanyId', 'gstNumber', 'panNumber', 'cinNumber', 'paymentTerms', 'creditLimit',
  'taxExemptionStatus', 'billingStreet2', 'shippingLocation', 'shippingStreet', 'shippingCity',
  'shippingCountry', 'shippingPhone', 'primaryContactName', 'primaryContactDesignation',
  'primaryContactDepartment', 'primaryContactEmail', 'primaryContactMobile', 'primaryContactPhone',
  'primaryContactLinkedin', 'cloudProvider', 'dataCentreProvider', 'systemIntegrator',
  'securityPartner', 'techPlatforms', 'digitalInitiatives', 'existingContracts', 'renewalDates',
  'leadSource', 'accountSource', 'referralPartner', 'accountPriority', 'accountTier',
  'strategicAccount', 'estimatedRevenue', 'currentSpend', 'competitorInfo', 'keyChallenges',
  'nextAction', 'nextFollowUpDate', 'existingCustomer', 'currentProducts', 'previousOrders',
  'lastPurchaseDate', 'activeOpportunities', 'expectedDealSize', 'expectedClosureDate',
  'probabilityClosure', 'territory', 'region', 'businessUnit', 'dataQualityScore', 'updatedBy',
];

const ownerInclude = () => ({
  model: db.Contact,
  as: 'owner',
  attributes: ['id', 'fullName', 'email'],
  required: false,
});

const creatorInclude = () => ({
  model: db.Contact,
  as: 'creator',
  attributes: ['id', 'fullName', 'email'],
  required: false,
});

const updaterInclude = () => ({
  model: db.Contact,
  as: 'updater',
  attributes: ['id', 'fullName', 'email'],
  required: false,
});

const parentCompanyInclude = () => ({
  model: db.Account,
  as: 'parentCompany',
  attributes: ['id', 'name', 'industry'],
  required: false,
});

// ── List ─────────────────────────────────────────────────────────────────────
const list = async ({ page, limit, search, status, industry, sortBy, sortDir }) => {
  const offset = (page - 1) * limit;
  const where  = {};  // paranoid:true handles soft-delete filter automatically

  if (status)   where.status   = status;
  if (industry) where.industry = industry;
  if (search)   where.name     = { [Op.iLike]: `%${search}%` };

  const dbSortBy = sortBy === 'annualRevenue' ? 'annual_revenue' :
                   sortBy === 'estimatedRevenue' ? 'estimated_revenue' : sortBy;

  const { count, rows } = await db.Account.findAndCountAll({
    where,
    limit,
    offset,
    order: [[dbSortBy, sortDir]],
    attributes: ACCOUNT_ATTRS,
    include: [ownerInclude()],
  });

  return {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    data: rows,
  };
};

// ── Get one ──────────────────────────────────────────────────────────────────
const getById = async (id) => {
  const account = await db.Account.findByPk(id, {
    attributes: ACCOUNT_ATTRS,
    include: [
      ownerInclude(),
      creatorInclude(),
      updaterInclude(),
      parentCompanyInclude(),
    ],
  });
  if (!account) throw new ApiError(404, 'Account not found');
  return account;
};

// Helper to generate internal CRM controls automatically
const autoGenerateCRMControls = (payload) => {
  const updates = {};
  
  // 1. Data Quality Score calculation
  const scoringFields = [
    // Basic Details
    'name', 'ownerId', 'accountType', 'status', 'category', 'organizationProfile',
    'industry', 'subIndustry', 'website', 'linkedinPage',

    // Company Profile
    'yearEstablished', 'employeeSize', 'annualRevenueRange', 'marketSegment',
    'employees', 'officesCount', 'globalPresence', 'countriesOperation', 'parentCompanyId',

    // Compliance & Financials
    'gstNumber', 'panNumber', 'cinNumber', 'paymentTerms', 'creditLimit', 'taxExemptionStatus',

    // Address Info
    'billingStreet', 'billingStreet2', 'billingCity', 'billingState', 'billingCountry', 'billingZip',
    'shippingLocation', 'shippingStreet', 'shippingCity', 'shippingCountry', 'shippingPhone',

    // Primary Contact
    'primaryContactName', 'primaryContactDesignation', 'primaryContactDepartment',
    'primaryContactEmail', 'primaryContactMobile', 'primaryContactPhone', 'primaryContactLinkedin',

    // Technology Landscape
    'cloudProvider', 'dataCentreProvider', 'systemIntegrator', 'securityPartner',
    'techPlatforms', 'digitalInitiatives', 'existingContracts', 'renewalDates',

    // Sales Qualification
    'leadSource', 'accountSource', 'referralPartner', 'accountPriority', 'accountTier',
    'strategicAccount', 'estimatedRevenue', 'currentSpend', 'competitorInfo', 'keyChallenges',
    'nextAction', 'nextFollowUpDate',

    // Relationship Info
    'existingCustomer', 'currentProducts', 'previousOrders', 'lastPurchaseDate',
    'activeOpportunities', 'expectedDealSize', 'expectedClosureDate', 'probabilityClosure',

    // Description
    'description'
  ];
  let filledCount = 0;
  scoringFields.forEach(field => {
    const val = payload[field];
    if (val !== undefined && val !== null && val !== '') {
      if (Array.isArray(val)) {
        if (val.length > 0) {
          filledCount++;
        }
      } else {
        filledCount++;
      }
    }
  });
  updates.dataQualityScore = Math.round((filledCount / scoringFields.length) * 100);

  // 2. Region & Territory based on Country
  const country = (payload.billingCountry || payload.shippingCountry || '').trim().toLowerCase();
  if (['us', 'usa', 'united states', 'canada', 'brazil', 'mexico'].includes(country)) {
    updates.region = 'AMER';
    updates.territory = country === 'canada' ? 'Canada East' : 'US East Coast';
  } else if (['uk', 'united kingdom', 'germany', 'france', 'italy', 'spain', 'europe'].includes(country)) {
    updates.region = 'EMEA';
    updates.territory = 'Western Europe';
  } else if (['india', 'singapore', 'australia', 'japan', 'china', 'uae'].includes(country)) {
    updates.region = 'APAC';
    updates.territory = country === 'india' ? 'South-Asia (India)' : 'ASEAN Region';
  } else {
    updates.region = 'Global';
    updates.territory = 'International Territory';
  }

  // 3. Business Unit based on size
  const employees = Number(payload.employees || 0);
  const revenue = Number(payload.annualRevenue || 0);
  if (employees > 500 || revenue > 10000000) {
    updates.businessUnit = 'Enterprise Sales';
  } else if (employees > 100 || revenue > 2000000) {
    updates.businessUnit = 'Mid-Market Sales';
  } else {
    updates.businessUnit = 'SMB Sales';
  }

  return updates;
};

// ── Create ───────────────────────────────────────────────────────────────────
const create = async (payload, userId) => {
  const crmControls = autoGenerateCRMControls(payload);
  const account = await db.Account.create({
    ...payload,
    ...crmControls,
    createdBy: userId,
    ownerId: payload.ownerId || userId,
  });
  return getById(account.id);
};

// ── Update ───────────────────────────────────────────────────────────────────
const update = async (id, payload, userId) => {
  const account = await getById(id);
  const crmControls = autoGenerateCRMControls({ ...account.toJSON(), ...payload });
  await account.update({
    ...payload,
    ...crmControls,
    updatedBy: userId
  });
  return getById(id);
};

// ── Soft-delete ──────────────────────────────────────────────────────────────
const remove = async (id) => {
  const account = await getById(id);
  await account.destroy(); // sets deleted_at via paranoid
};

module.exports = { list, getById, create, update, remove };
