const Joi = require('joi');

const createContactSchema = Joi.object({
  fullName:    Joi.string().max(255).required(),
  email:       Joi.string().email().max(255).required(),
  status:      Joi.string().valid('active', 'inactive').default('active'),
  phone:       Joi.string().max(50).optional().allow(null, ''),
  employeeId:  Joi.string().max(50).optional().allow(null, ''),
  designation: Joi.string().max(255).optional().allow(null, ''),
  department:  Joi.string().max(255).optional().allow(null, ''),
  timezone:    Joi.string().max(100).optional().allow(null, ''),
  language:    Joi.string().max(50).optional().allow(null, ''),
  bio:         Joi.string().optional().allow(null, ''),
  location:    Joi.string().max(255).optional().allow(null, ''),
  linkedinUrl: Joi.string().uri().max(255).optional().allow(null, '').empty(''),
});

const updateContactSchema = Joi.object({
  fullName:    Joi.string().max(255).optional(),
  email:       Joi.string().email().max(255).optional(),
  status:      Joi.string().valid('active', 'inactive').optional(),
  phone:       Joi.string().max(50).optional().allow(null, ''),
  employeeId:  Joi.string().max(50).optional().allow(null, ''),
  designation: Joi.string().max(255).optional().allow(null, ''),
  department:  Joi.string().max(255).optional().allow(null, ''),
  timezone:    Joi.string().max(100).optional().allow(null, ''),
  language:    Joi.string().max(50).optional().allow(null, ''),
  bio:         Joi.string().optional().allow(null, ''),
  location:    Joi.string().max(255).optional().allow(null, ''),
  linkedinUrl: Joi.string().uri().max(255).optional().allow(null, '').empty(''),
});

const listContactsSchema = Joi.object({
  page:      Joi.number().integer().min(1).default(1),
  limit:     Joi.number().integer().min(1).max(100).default(20),
  search:    Joi.string().max(255).optional().allow(''),
  status:    Joi.string().valid('active', 'inactive').optional(),
  sortBy:    Joi.string().valid('fullName', 'email', 'createdAt').default('createdAt'),
  sortDir:   Joi.string().valid('ASC', 'DESC').default('DESC'),
});

module.exports = { createContactSchema, updateContactSchema, listContactsSchema };
