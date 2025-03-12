const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const attendanceValidationSchema = Joi.object({
  t_id: Joi.objectId().messages({
    "string.pattern.base": "Invalid Teacher ID format.",
  }),
  s_id: Joi.objectId().messages({
    "string.pattern.base": "Invalid Student ID format.",
  }),

  date: Joi.string().messages({
    "string.empty": "date field is not empty.",
  }),

  status: Joi.string()
    .valid("P", "A", "HO", "HD")
    .uppercase()
    .required()
    .messages({
      "any.only":
        "Status must be one of 'Present(p)', 'Absent(a)', 'Holiday(ho)', or 'Half-day(hd)'.",
      "any.required": "Status is required.",
    }),

  remarks: Joi.string().trim().messages({
    "any.only": "Remarks must be one of 'Late', 'On-time', or 'None'.",
    "string.empty": "remarks should not empty.",
  }),
});

module.exports = attendanceValidationSchema;
