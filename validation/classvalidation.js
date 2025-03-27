const Joi = require("joi");
const streamdata = ["commerce", "science", "arts", "general"];
const classValidationSchema = Joi.object({
  className: Joi.string()
    .required()
    .pattern(/^(?:[1-9]|1[0-2])[A-Z]$/),
  fees: Joi.number().min(3000).required(),
  subjects: Joi.array()
    .items(Joi.string().trim().min(2).max(30))
    .min(4)
    .required(),
  classStream: Joi.string().valid(...streamdata).required(),
});


const classUpdateValidationSchema = Joi.object({
  className: Joi.string()
    .pattern(/^(?:[1-9]|1[0-2])[A-Z]$/),
  fees: Joi.number().min(3000),
  subjects: Joi.array()
    .items(Joi.string().trim().min(2).max(30))
    .min(4),
  classStream: Joi.string().valid(...streamdata),
});

const streamValidation = Joi.object({
  classStream: Joi.string().valid(...streamdata).required(),
});
module.exports = {classValidationSchema,classUpdateValidationSchema,streamValidation};
