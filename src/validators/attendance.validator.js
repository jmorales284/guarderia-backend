const Joi = require('joi');

const registerAttendance = Joi.object({
  child_id: Joi.number().integer().required(),
  att_date: Joi.date().required(),
  check_in: Joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).allow('', null),
  check_out: Joi.string().pattern(/^\d{2}:\d{2}(:\d{2})?$/).allow('', null),
  status: Joi.string().valid('present','absent','late','left_early').required(),
  origin: Joi.string().valid('manual','automatic').default('manual'),
  justification: Joi.string().allow('')
});

module.exports = { registerAttendance };
