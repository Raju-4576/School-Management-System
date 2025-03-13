const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const marksValidationSchema = Joi.object({
  t_id: Joi.objectId().messages({
    "any.required": "Teacher ID (t_id) is required.",
    "string.pattern.base": "Invalid Teacher ID format.",
  }),
  s_id: Joi.objectId().messages({
    "any.required": "Student ID (s_id) is required.",
    "string.pattern.base": "Invalid Student ID format.",
  }),
  subjects: Joi.object()
    .pattern(
      Joi.string().min(2).max(30).messages({
        "string.base": "Each subject name must be a string.",
        "string.empty": "Subject name cannot be empty.",
        "string.min": "Subject name must be at least 2 characters long.",
        "string.max": "Subject name must not exceed 30 characters.",
      }),
      Joi.number().min(0).max(100).messages({
        "number.base": "Marks must be a number.",
        "number.min": "Marks must be at least 0.",
        "number.max": "Marks cannot above 100.",
      })
    )
    .required()
    .messages({
      "object.base":
        "Subjects must be an object with subject names as keys and marks as values.",
      "any.required": "Subjects field is required.",
    }),
  result_date: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .messages({
      "string.pattern.base": "result date must be in the format DD-MM-YYYY.",
      "string.empty": "result date is not Empty.",
    }),

  total: Joi.number().messages({
    "number.base": "Total marks must be a number.",
  }),

  grade: Joi.string().valid("A+", "A", "B", "C", "F").messages({
    "any.only": "Grade must be one of A+, A, B, C, or F.",
  }),

  percentage: Joi.number().messages({
    "number.base": "Percentage must be a number.",
  }),
});

module.exports = marksValidationSchema;
