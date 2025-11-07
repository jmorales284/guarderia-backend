const Joi = require('joi');

const createStaff = Joi.object({
  user_id: Joi.number().integer().required(),
  document: Joi.string().required(),
  specific_role: Joi.string().valid('educator','assistant','admin','accounting').required(),
  shift_notes: Joi.string().allow('')
});

const updateStaff = Joi.object({
  document: Joi.string(),
  specific_role: Joi.string().valid('educator','assistant','admin','accounting'),
  shift_notes: Joi.string().allow(''),
  active: Joi.boolean()
});

module.exports = { createStaff, updateStaff };
