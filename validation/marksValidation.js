const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const marksValidationSchema = Joi.object({
  studentId: Joi.objectId(),
  subjects: Joi.object()
    .pattern(Joi.string().min(2).max(30), Joi.number().min(0).max(100))
    .required(),
  result_date: Joi.string().pattern(
    /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  ),
  examNo: Joi.number().min(1).max(7).required(),
});

const marksUpdateValidationSchema = Joi.object({
  subjects: Joi.object().pattern(
    Joi.string().min(2).max(30),
    Joi.number().min(0).max(100)
  ),
  result_date: Joi.string().pattern(
    /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  ),
  examNo: Joi.number().min(1).max(7),
});

const showResultValidation = Joi.object({
  examNo: Joi.number().min(1).max(7).required(),
});

const topperValidation = Joi.object({
  className: Joi.string()
    .required()
    .pattern(/^(?:[1-9]|1[0-2])[A-Z]$/),
  examNo: Joi.number().min(1).max(7).required(),
});


const topperAllValidation = Joi.object({
  className: Joi.number().required(),
  examNo: Joi.number().min(1).max(7).required(),
});
module.exports = {
  marksValidationSchema,
  marksUpdateValidationSchema,
  showResultValidation,
  topperAllValidation,
  topperValidation
};
