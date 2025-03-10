const Joi = require("joi");
// const name = [
//   "1A",
//   "1B",
//   "2A",
//   "2B",
//   "3A",
//   "3B",
//   "4A",
//   "4B",
//   "5A",
//   "5B",
//   "6A",
//   "6B",
//   "7A",
//   "7B",
//   "8A",
//   "8B",
//   "9A",
//   "9B",
//   "10A",
//   "10B",
//   "11A",
//   "11B",
//   "11C",
//   "12A",
//   "12B",
//   "12C",
// ];

const streamdata = ["COMMERCE", "SCIENCE", "ARTS", "GENERAL"];
const marksValidationSchema = Joi.object({
  c_name: Joi.string()
    .required()
    .pattern(/^(?:[1-9]|1[0-2])[A-Z]$/)
    .messages({
      "string.pattern.base":
        "Class name must be a number (1-12) followed by an uppercase letter (e.g., 7C, 10A).",
      "string.empty": "Class Name is Not empty.",
      "any.required": "Class name  is required.",
    }),
  fees: Joi.number().min(3000).required().messages({
    "number.base": "Fees must be a number.",
    "number.min": "Fees must be at least 3000.",
    "any.required": "Fees field is required.",
  }),

  subjects: Joi.array()
    .items(
      Joi.string().trim().min(2).max(30).messages({
        "string.empty": "Subject name cannot be empty.",
        "string.min": "Subject name must have at least 2 characters.",
        "string.max": "Subject name must not exceed 30 characters.",
        "string.base": "Each subject must be a string.",
      })
    )
    .min(4)
    .required()
    .messages({
      "array.base": "Subjects must be an array of strings.",
      "array.min": "At least 4 subject is required.",
      "any.required": "Subjects field is required.",
    }),
  class_stream: Joi.string()
    .valid(...streamdata)
    .uppercase()
    .messages({
      "any.only": "stream must be Commerce,Arts,Science and General",
      "string.empty": "class_stream is Not empty.",
    }),
});

module.exports = marksValidationSchema;
