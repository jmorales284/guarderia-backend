const Joi = require('joi');

const createChild = Joi.object({
  full_name: Joi.string().required(),
  document: Joi.string().allow('', null),
  birth_date: Joi.date().required(),
  classroom_id: Joi.number().integer().allow(null),
  family_id: Joi.number().integer().allow(null),
  medical_info: Joi.string().allow('')
});

const updateChild = Joi.object({
  full_name: Joi.string(),
  document: Joi.string().allow('', null),
  birth_date: Joi.date(),
  classroom_id: Joi.number().integer().allow(null),
  family_id: Joi.number().integer().allow(null),
  medical_info: Joi.string().allow(''),
  active: Joi.boolean()
});

module.exports = { createChild, updateChild };
