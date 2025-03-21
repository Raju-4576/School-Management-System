const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const attendanceValidationSchema = Joi.object({
  studentId: Joi.objectId(),
  date: Joi.string().pattern(/^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  status: Joi.string().valid("P", "A", "HO", "HD").uppercase().required(),
  remarks: Joi.string().trim(),
});


const updateAttedanceValidation = Joi.object({
  studentId: Joi.objectId(),
  date: Joi.string().pattern(/^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  status: Joi.string().valid("P", "A", "HO", "HD").uppercase(),
  remarks: Joi.string().trim(),
});

const monthValidation = Joi.object({
 month:Joi.number().min(1).max(12).required()
});

const statusValidation = Joi.object({
  status: Joi.string().valid("P", "A", "HO", "HD").uppercase().required(),
 });
module.exports = {attendanceValidationSchema,updateAttedanceValidation,monthValidation,statusValidation};
