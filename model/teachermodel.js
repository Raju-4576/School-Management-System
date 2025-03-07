const Joi = require("joi");

const teacherValidationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required.",
      "string.min": "Name must be at least 3 characters long.",
      "string.max": "Name must be at most 50 characters long.",
      "any.required": "Name field is required.",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email field is required.",
    }),

  password: Joi.string()
    .min(6)
    .max(30)
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password must be at most 30 characters long.",
      "any.required": "Password field is required.",
    }),

  role: Joi.string()
    .valid("teacher", "admin")
    .required()
    .messages({
      "any.only": "Role must be either 'teacher' or 'admin'.",
      "string.empty": "Role is required.",
      "any.required": "Role field is required.",
    }),

  class: Joi.array()
    .items(Joi.string().trim().min(1).messages({ "string.empty": "Class cannot be empty." }))
    .min(1)
    .required()
    .messages({
      "array.base": "Class must be an array of strings.",
      "array.min": "At least one class is required.",
      "any.required": "Class field is required.",
    }),

  sub: Joi.array()
    .items(Joi.string().trim().min(1).messages({ "string.empty": "Subject cannot be empty." }))
    .min(1)
    .required()
    .messages({
      "array.base": "Subjects must be an array of strings.",
      "array.min": "At least one subject is required.",
      "any.required": "Subjects field is required.",
    }),

  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),

  address: Joi.string()
    .max(255)
    .messages({
      "string.max": "Address must not exceed 255 characters.",
    }),

  batch: Joi.string()
    .max(50)
    .messages({
      "string.max": "Batch must not exceed 50 characters.",
    }),
});

module.exports = teacherValidationSchema;
