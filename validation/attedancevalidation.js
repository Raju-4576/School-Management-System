const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const attendanceValidationSchema = Joi.object({
  t_id: Joi.objectId().messages({
    "any.required": "Teacher ID (t_id) is required.",
    "string.pattern.base": "Invalid Teacher ID format.",
  }),
  s_id: Joi.objectId().messages({
    "any.required": "Student ID (s_id) is required.",
    "string.pattern.base": "Invalid Student ID format.",
  }),

  date: Joi.string().required().messages({
    "any.required": "Join date field is required.",
  }),

  status: Joi.string()
    .valid("present", "absent", "holiday", "half-day")
    .lowercase()
    .required()
    .messages({
      "any.only":
        "Status must be one of 'Present', 'Absent', 'Holiday', or 'Half-day'.",
      "any.required": "Status is required.",
    }),

  remarks: Joi.string()
    .valid("Late", "On-time", "None")
    .default("None")
    .messages({
      "any.only": "Remarks must be one of 'Late', 'On-time', or 'None'.",
    }),
});

module.exports = attendanceValidationSchema;
