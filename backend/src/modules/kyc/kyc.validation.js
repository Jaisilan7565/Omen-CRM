const Joi = require('joi');

const createKycSchema = Joi.object({
  // ── Required core ────────────────────────────────────────────────────────────
  accountId:   Joi.string().uuid().required(),
  contactType: Joi.string().max(100).required(),
  kycCategory: Joi.string().max(100).required(),
  firstName:   Joi.string().max(100).required(),
  email:       Joi.string().email().max(255).required(),
  mobileNumber1: Joi.string().max(50).required(),
  designation:   Joi.string().max(100).required(),
  department:  Joi.string().max(100).optional().allow(null, ''),

  // ── Basic Info ───────────────────────────────────────────────────────────────
  lastName:        Joi.string().max(100).optional().allow(null, ''),
  mobileNumber2:   Joi.string().max(50).optional().allow(null, ''),
  landlineNumber:  Joi.string().max(50).optional().allow(null, ''),
  jobFunction:   Joi.string().max(100).optional().allow(null, ''),
  employeeLevel:   Joi.string().max(100).optional().allow(null, ''),
  employeeId:      Joi.string().max(100).optional().allow(null, ''),
  joiningDate:     Joi.date().iso().optional().allow(null),

  // ── Buying & Influence ───────────────────────────────────────────────────────
  buyingRole:         Joi.array().items(Joi.string()).optional().allow(null),
  decisionAuthority:  Joi.string().max(100).optional().allow(null, ''),
  budgetOwnership:    Joi.boolean().optional().allow(null),
  technicalEvaluator: Joi.boolean().optional().allow(null),
  influencerScore:    Joi.number().integer().min(0).max(100).optional().allow(null),
  relationshipStrength: Joi.number().integer().min(0).max(100).optional().allow(null),

  // ── Communication Preferences ────────────────────────────────────────────────
  preferredCommMode:    Joi.array().items(Joi.string()).optional().allow(null),
  preferredContactTime: Joi.string().max(100).optional().allow(null, ''),
  timeZone:             Joi.string().max(100).optional().allow(null, ''),
  languagePreference:   Joi.string().max(100).optional().allow(null, ''),
  marketingConsent:     Joi.boolean().optional().allow(null),
  doNotContact:         Joi.boolean().optional().allow(null),

  // ── Personal ─────────────────────────────────────────────────────────────────
  dob:              Joi.date().iso().optional().allow(null),
  anniversaryDate:  Joi.date().iso().optional().allow(null),
  linkedinProfile:  Joi.string().uri().max(255).optional().allow(null, '').empty(''),
  assistantName:    Joi.string().max(100).optional().allow(null, ''),
  assistantContact: Joi.string().max(50).optional().allow(null, ''),
  personalInterests: Joi.array().items(Joi.string()).optional().allow(null),
  notes:            Joi.string().optional().allow(null, ''),

  // ── Reporting Hierarchy ──────────────────────────────────────────────────────
  reportingTo:      Joi.string().uuid().optional().allow(null, ''),
  reportingFunction:  Joi.string().max(100).optional().allow(null, ''),
  reportingToText:    Joi.string().max(255).optional().allow(null, ''),
  managerLocation:    Joi.string().max(100).optional().allow(null, ''),
  managerFunction:    Joi.string().max(100).optional().allow(null, ''),
  managerDesignation: Joi.string().max(100).optional().allow(null, ''),
  managerName:        Joi.string().max(100).optional().allow(null, ''),
  managerEmail:       Joi.string().email().max(255).optional().allow(null, ''),
  managerMobile:      Joi.string().max(50).optional().allow(null, ''),

  // ── Account Team Ownership ───────────────────────────────────────────────────
  accountManager:         Joi.string().uuid().optional().allow(null, ''),
  customerSuccessManager: Joi.string().uuid().optional().allow(null, ''),
  preSalesOwner:          Joi.string().uuid().optional().allow(null, ''),
  relationshipOwner:      Joi.string().uuid().optional().allow(null, ''),
  accountTeam:            Joi.array().items(Joi.string().uuid()).optional().allow(null),

  // ── Engagement Tracking ──────────────────────────────────────────────────────
  engagementFrequency:  Joi.string().max(100).optional().allow(null, ''),
  lastMeetingDate:      Joi.date().iso().optional().allow(null),
  nextFollowUpDate:     Joi.date().iso().optional().allow(null),
  contactPriority:      Joi.string().max(100).optional().allow(null, ''),
  lastInteractionDate:  Joi.date().iso().optional().allow(null),
  lastInteractionNotes: Joi.string().optional().allow(null, ''),

  // ── Scoring & Analytics ──────────────────────────────────────────────────────
  relationshipScore:    Joi.number().integer().min(0).max(100).optional().allow(null),
  influenceLevel:       Joi.string().max(100).optional().allow(null, ''),
  decisionMakingPower:  Joi.string().max(100).optional().allow(null, ''),
  customerSentiment:    Joi.string().max(100).optional().allow(null, ''),
  dataQualityScore:     Joi.number().integer().min(0).max(100).optional().allow(null),
  duplicateContactCheck: Joi.boolean().optional().allow(null),
  associationStatus:    Joi.string().max(100).optional().allow(null, ''),
});

const updateKycSchema = createKycSchema.fork(
  ['accountId', 'contactType', 'kycCategory', 'firstName', 'email', 'mobileNumber1', 'designation'],
  (schema) => schema.optional()
);

const listKycSchema = Joi.object({
  page:        Joi.number().integer().min(1).default(1),
  limit:       Joi.number().integer().min(1).max(100).default(20),
  search:      Joi.string().max(255).optional().allow(''),
  accountId:   Joi.string().uuid().optional(),
  contactType: Joi.string().max(100).optional().allow(''),
  sortBy:      Joi.string().valid('firstName', 'createdAt', 'relationshipScore', 'designation').default('createdAt'),
  sortDir:     Joi.string().valid('ASC', 'DESC').default('DESC'),
});

module.exports = { createKycSchema, updateKycSchema, listKycSchema };
