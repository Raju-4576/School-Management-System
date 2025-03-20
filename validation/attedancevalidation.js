const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const attendanceValidationSchema = Joi.object({
  studentId: Joi.objectId(),
  date: Joi.string(),
  status: Joi.string().valid("P", "A", "HO", "HD").uppercase().required(),
  remarks: Joi.string().trim(),
});

module.exports = attendanceValidationSchema;
