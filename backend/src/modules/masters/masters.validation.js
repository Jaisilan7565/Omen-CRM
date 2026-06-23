const Joi = require('joi');

const listMastersSchema = Joi.object({
  category: Joi.string().max(100).optional(),
});

module.exports = { listMastersSchema };
