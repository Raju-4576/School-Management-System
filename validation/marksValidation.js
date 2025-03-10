const Joi = require("joi");

const marksValidationSchema = Joi.object({
  subject1: Joi.number().min(0).max(100).required().messages({
    "number.base": "Subject 1 must be a number.",
    "number.min": "Subject 1 cannot be less than 0.",
    "number.max": "Subject 1 cannot be greater than 100.",
    "any.required": "Subject 1 is required.",
  }),

  subject2: Joi.number().min(0).max(100).required().messages({
    "number.base": "Subject 2 must be a number.",
    "number.min": "Subject 2 cannot be less than 0.",
    "number.max": "Subject 2 cannot be greater than 100.",
    "any.required": "Subject 2 is required.",
  }),

  subject3: Joi.number().min(0).max(100).required().messages({
    "number.base": "Subject 3 must be a number.",
    "number.min": "Subject 3 cannot be less than 0.",
    "number.max": "Subject 3 cannot be greater than 100.",
    "any.required": "Subject 3 is required.",
  }),

  subject4: Joi.number().min(0).max(100).required().messages({
    "number.base": "Subject 4 must be a number.",
    "number.min": "Subject 4 cannot be less than 0.",
    "number.max": "Subject 4 cannot be greater than 100.",
    "any.required": "Subject 4 is required.",
  }),

  subject5: Joi.number().min(0).max(100).required().messages({
    "number.base": "Subject 5 must be a number.",
    "number.min": "Subject 5 cannot be less than 0.",
    "number.max": "Subject 5 cannot be greater than 100.",
    "any.required": "Subject 5 is required.",
  }),
});

module.exports = marksValidationSchema;
