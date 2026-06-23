const { Op } = require('sequelize');
const db = require('../../database/models');
const ApiError = require('../../common/api/ApiError');

// ── Column projection ────────────────────────────────────────────────────────
const KYC_ATTRS = [
  'id', 'accountId', 'contactType', 'kycCategory',
  'firstName', 'lastName', 'email', 'mobileNumber1', 'mobileNumber2', 'landlineNumber',
  'jobFunction', 'designation', 'department', 'employeeLevel', 'employeeId', 'joiningDate',
  'buyingRole', 'decisionAuthority', 'budgetOwnership', 'technicalEvaluator',
  'influencerScore', 'relationshipStrength',
  'preferredCommMode', 'preferredContactTime', 'timeZone', 'languagePreference',
  'marketingConsent', 'doNotContact',
  'dob', 'anniversaryDate', 'linkedinProfile',
  'assistantName', 'assistantContact', 'personalInterests', 'notes',
  'reportingTo', 'reportingFunction', 'reportingToText',
  'managerLocation', 'managerFunction', 'managerDesignation',
  'managerName', 'managerEmail', 'managerMobile',
  'accountManager', 'customerSuccessManager', 'preSalesOwner',
  'relationshipOwner', 'accountTeam',
  'engagementFrequency', 'lastMeetingDate', 'nextFollowUpDate',
  'contactPriority', 'lastInteractionDate', 'lastInteractionNotes',
  'relationshipScore', 'influenceLevel', 'decisionMakingPower',
  'customerSentiment', 'dataQualityScore', 'duplicateContactCheck', 'associationStatus',
  'createdBy', 'updatedBy', 'createdAt', 'updatedAt',
];

// ── Eager-load helpers ───────────────────────────────────────────────────────
const accountInclude = () => ({
  model: db.Account,
  as: 'account',
  attributes: ['id', 'name', 'accountType', 'industry'],
  required: false,
});

const managerInclude = () => ({
  model: db.Kyc,
  as: 'manager',
  attributes: ['id', 'firstName', 'lastName', 'designation', 'email'],
  required: false,
});

const ownerInclude = (as, fk) => ({
  model: db.Kyc,
  as,
  attributes: ['id', 'firstName', 'lastName', 'designation', 'email'],
  required: false,
});

// ── List ─────────────────────────────────────────────────────────────────────
const list = async ({ page, limit, search, accountId, contactType, sortBy, sortDir }) => {
  const offset = (page - 1) * limit;
  const where  = {};

  if (accountId)   where.accountId   = accountId;
  if (contactType) where.contactType = contactType;
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.iLike]: `%${search}%` } },
      { lastName:  { [Op.iLike]: `%${search}%` } },
      { email:     { [Op.iLike]: `%${search}%` } },
    ];
  }

  const dbSortBy =
    sortBy === 'firstName'         ? 'first_name' :
    sortBy === 'relationshipScore' ? 'relationship_score' :
    sortBy;

  const { count, rows } = await db.Kyc.findAndCountAll({
    where,
    limit,
    offset,
    order: [[dbSortBy, sortDir]],
    attributes: KYC_ATTRS,
    include: [
      accountInclude(),
      managerInclude(),
      ownerInclude('accManagerKyc', 'account_manager'),
      ownerInclude('csmKyc', 'customer_success_manager'),
      ownerInclude('preSalesKyc', 'pre_sales_owner'),
      ownerInclude('relOwnerKyc', 'relationship_owner'),
    ],
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
  const kyc = await db.Kyc.findByPk(id, {
    attributes: KYC_ATTRS,
    include: [
      accountInclude(),
      managerInclude(),
      ownerInclude('accManagerKyc', 'account_manager'),
      ownerInclude('csmKyc', 'customer_success_manager'),
      ownerInclude('preSalesKyc', 'pre_sales_owner'),
      ownerInclude('relOwnerKyc', 'relationship_owner'),
    ],
  });
  if (!kyc) throw new ApiError(404, 'KYC record not found');
  return kyc;
};

// ── Create ───────────────────────────────────────────────────────────────────
const create = async (payload, userId) => {
  // Validate that the referenced account exists
  const account = await db.Account.findByPk(payload.accountId);
  if (!account) throw new ApiError(404, 'Account not found');

  // Check for duplicates
  let duplicateContactCheck = false;
  const duplicateConditions = [];
  if (payload.email) {
    duplicateConditions.push({ email: { [Op.iLike]: payload.email.trim() } });
  }
  if (payload.mobileNumber1) {
    duplicateConditions.push({ mobileNumber1: payload.mobileNumber1.trim() });
  }
  if (duplicateConditions.length > 0) {
    const duplicate = await db.Kyc.findOne({
      where: {
        [Op.or]: duplicateConditions
      }
    });
    duplicateContactCheck = !!duplicate;
  }

  const associationStatus = account.status === 'active' ? 'Active' : 'Associated';

  const kyc = await db.Kyc.create({
    ...payload,
    duplicateContactCheck,
    associationStatus,
    createdBy: userId,
    updatedBy: userId,
  });
  return getById(kyc.id);
};

// ── Update ───────────────────────────────────────────────────────────────────
const update = async (id, payload, userId) => {
  const kyc = await getById(id);
  
  // Check for duplicates
  let duplicateContactCheck = false;
  const duplicateConditions = [];
  const emailVal = payload.email !== undefined ? payload.email : kyc.email;
  const mobileVal = payload.mobileNumber1 !== undefined ? payload.mobileNumber1 : kyc.mobileNumber1;
  
  if (emailVal) {
    duplicateConditions.push({ email: { [Op.iLike]: emailVal.trim() } });
  }
  if (mobileVal) {
    duplicateConditions.push({ mobileNumber1: mobileVal.trim() });
  }
  if (duplicateConditions.length > 0) {
    const duplicate = await db.Kyc.findOne({
      where: {
        id: { [Op.ne]: id },
        [Op.or]: duplicateConditions
      }
    });
    duplicateContactCheck = !!duplicate;
  }

  let associationStatus = kyc.associationStatus;
  const accountIdVal = payload.accountId !== undefined ? payload.accountId : kyc.accountId;
  if (accountIdVal) {
    const account = await db.Account.findByPk(accountIdVal);
    if (account) {
      associationStatus = account.status === 'active' ? 'Active' : 'Associated';
    }
  }

  await kyc.update({
    ...payload,
    duplicateContactCheck,
    associationStatus,
    updatedBy: userId
  });
  return getById(id);
};

// ── Soft-delete ──────────────────────────────────────────────────────────────
const remove = async (id) => {
  const kyc = await getById(id);
  await kyc.destroy(); // sets deleted_at via paranoid
};

module.exports = { list, getById, create, update, remove };
