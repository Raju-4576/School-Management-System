const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const studentValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.empty": "Name is not Empty.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name must be at most 50 characters long.",
    "any.required": "Name field is required.",
  }),

  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email is not empty.",
    "any.required": "Email field is required.",
  }),

  password: Joi.string()
    .min(6)
    .max(10)
    .pattern(new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{6,}$"))
    .required()
    .messages({
      "string.empty": "Password is not empty.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password must be at most 10 characters long.",
      "any.required": "Password field is required.",
      "string.pattern.base":
        "Password must contain at least one letter and one number.",
    }),

  role: Joi.string().valid("student").messages({
    "any.only": "Role must be 'student'.",
    "any.required": "role field is required.",
  }),

  DOB: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required()
    .messages({
      "string.empty": "Date of Birth is required.",
      "any.required": "Date of Birth is required.",
      "string.pattern.base": "Invalid DOB format. Use DD-MM-YYYY.",
    }),

  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "any.only": "Gender must be 'Male', 'Female' or 'Other'.",
    "any.required": "Gender is required.",
  }),

  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "string.empty": "Phone number is required.",
      "any.required": "Phone number is required.",
    }),

  address: Joi.string().max(200).required().messages({
    "string.max": "Address must not exceed 200 characters.",
    "any.required": "Address field is required.",
    "string.empty": "Address is required.",
  }),

  admission_date: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required()
    .messages({
      "string.empty": "Admission date is required.",
      "any.required": "Admission date is required.",
      "string.pattern.base": "Invalid date format. Use DD-MM-YYYY.",
    }),

  stream: Joi.string()
    .valid("COMMERCE", "SCIENCE", "ARTS", "GENERAL")
    .uppercase()
    .required()
    .messages({
      "any.only": "Stream must be either 'COMMERCE', 'SCIENCE', or 'ARTS'.",
      "any.required": "Stream is required.",
    }),
  hobby: Joi.array()
    .items(
      Joi.string().trim().min(3).max(30).messages({
        "string.empty": "hobby name cannot be empty.",
        "string.min": "hobby name must have at least 3 characters.",
        "string.max": "hobby name must not exceed 30 characters.",
        "string.base": "Each hobby must be a string.",
      })
    )
    .min(2)
    .required()
    .messages({
      "array.base": "Hobby must be an array of strings.",
      "array.min": "At least 2 hobby is required.",
      "any.required": "Hobby field is required.",
    }),
  t_id: Joi.objectId().messages({
    "any.required": "Teacher ID (t_id) is required.",
    "string.pattern.base": "Invalid Teacher ID format.",
  }),
  c_id: Joi.objectId().messages({
    "any.required": "Class ID (c_id) is required.",
    "string.pattern.base": "Invalid Class ID format.",
  }),
});

module.exports = studentValidationSchema;
