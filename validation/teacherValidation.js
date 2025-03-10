const Joi = require("joi");
const name = ["teacher", "Teacher", "student", "Student", "admin", "Admin"];
const batch = [
  "Morning",
  "morning",
  "MORNING",
  "AFTERNOON",
  "Afternoon",
  "afternoon",
];
const teacherValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(10).required().messages({
    "string.empty": "Name is Should not empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must be at most 10 characters long.",
    "any.required": "Name field is required.",
  }),

  email: Joi.string()
    .email()
    .custom((value, helpers) => {
      if (value !== value.toLowerCase()) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
      "any.required": "Email field is required.",
      "any.invalid": "Email must be in lowercase.",
    }),

  password: Joi.string()
    .min(6)
    .max(10)
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{6,}$"))
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password must be at most 10 characters long.",
      "any.required": "Password field is required.",
      "string.pattern.base": "In the password one number and one character.",
    }),

  role: Joi.string()
    .valid(...name)
    .required()
    .messages({
      "any.only": "Role must be 'Teacher','Student' or 'Admin' .",
      "string.empty": "Role is required.",
      "any.required": "Role field is required.",
    }),

  class: Joi.array()
    .items(
      Joi.string()
        .trim()
        .min(1)
        .messages({ "string.empty": "Class cannot be empty." })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Class must be an array of strings.",
      "array.min": "At least one class is required.",
      "any.required": "Class field is required.",
    }),

  sub: Joi.array()
    .items(
      Joi.string()
        .trim()
        .min(1)
        .messages({ "string.empty": "Subject cannot be empty." })
    )
    // .min(1)
    .required()
    .messages({
      "array.base": "Subjects must be an array of strings.",
      "array.min": "At least one subject is required.",
      "any.required": "Subjects field is required.",
    }),

  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),

  address: Joi.string().max(255).required().messages({
    "string.max": "Address must not exceed 255 characters.",
    "any.required": "Address number is required.",
    "string.empty": "address is required.",
  }),

  batch: Joi.string()
    .valid(...batch)
    .required()
    .messages({
      "any.only": "Batch must be either 'morning' or 'afternoon'.",
      "string.empty": "Batch is required.",
      "any.required": "Batch field is required.",
    }),
  join_date: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "Join date must be in the format DD-MM-YYYY.",
      "string.empty": "Join date is not Empty.",
      "any.required": "Join date field is required.",
    }),
});

module.exports = teacherValidationSchema;
