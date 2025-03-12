const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const feesJoiSchema = Joi.object({
  s_id: Joi.objectId().messages({
    "any.required": "Student ID is required.",
    "string.pattern.base": "Invalid Student ID format.",
  }),

  t_id: Joi.objectId().messages({
    "any.required": "Teacher ID is required.",
    "string.pattern.base": "Invalid Teacher ID format.",
  }),

  c_id: Joi.objectId().messages({
    "any.required": "Class ID is required.",
    "string.pattern.base": "Invalid Class ID format.",
  }),

  last_fees: Joi.object({
    date: Joi.string()
      .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/)
      .messages({
        "string.pattern.base":
          "Last fees date must be in the format DD-MM-YYYY.",
      }),
    amt: Joi.number().required().min(0).messages({
      "number.base": "Last fees amount must be a number.",
      "number.min": "Last fees amount cannot be negative.",
      "any.required": "last fees amount is required.",
    }),
  })
    .required()
    .messages({
      "object.base": "Last fees must be an object containing date and amount.",
      "any.required": " Last_fees is required.",
    }),

  remain_fees: Joi.object({
    amt: Joi.number().min(0).messages({
      "number.base": "Remaining fees amount must be a number.",
      "number.min": "Remaining fees amount cannot be negative.",
      //   "any.required": "Remaining fees amount is required.",
    }),
    due_date: Joi.string()
      .required()
      .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/)
      .messages({
        "string.pattern.base": "Due date must be in the format DD-MM-YYYY.",
        "any.required": "due_date required.",
      }),
  })
    .required()
    .messages({
      "object.base":
        "Remaining fees must be an object containing amount and due date.",
      "any.required": "remain_fees is required.",
    }),

  status: Joi.string()
    .valid("paid", "pending", "partial", "overdue")
    .lowercase()
    .trim()
    .required()
    .messages({
      "any.only":
        'Status must be one of "paid", "pending", "partial", or "overdue".',
      "any.required": "Status is required.",
    }),
});

module.exports = feesJoiSchema;
