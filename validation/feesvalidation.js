const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const feesJoiSchema = Joi.object({
  s_id: Joi.objectId().messages({
    "any.required": "Student ID is required.",
    "string.pattern.base": "Invalid Student ID format.",
  }),

  a_id: Joi.objectId().messages({
    "any.required": "Teacher ID is required.",
    "string.pattern.base": "Invalid Teacher ID format.",
  }),

  // c_id: Joi.objectId().messages({
  //   "any.required": "Class ID is required.",
  //   "string.pattern.base": "Invalid Class ID format.",
  // }),

  total_fees: Joi.number().messages({
    "number.base": "Total fees amount must be a number.",
  }),

  // paid_fees: Joi.object({
  //   paid_date: Joi.string()
  //     .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/)
  //     .messages({
  //       "string.pattern.base":
  //         "paid fees date must be in the format DD-MM-YYYY.",
  //     }),
  //   amt: Joi.number().required().min(0).messages({
  //     "number.base": "paid fees amount must be a number.",
  //     "number.min": "paid fees amount cannot be negative.",
  //     "any.required": "paid fees amount is required.",
  //   }),
  // }).messages({
  //   "object.base": "paid fees must be an object containing date and amount.",
  //   // "any.required": "paid_fees is required.",
  // }),

  // remain_fees: Joi.object({
  //   remain_amt: Joi.number().min(0).messages({
  //     "number.base": "Remaining fees amount must be a number.",
  //     "number.min": "Remaining fees amount cannot be negative.",
  //     //   "any.required": "Remaining fees amount is required.",
  //   }),
  //   due_date: Joi.string()
  //     .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/)
  //     .messages({
  //       "string.pattern.base": "Due date must be in the format DD-MM-YYYY.",
  //       // "any.required": "remain fees due_date required.",
  //     }),
  // }).messages({
  //   "object.base":
  //     "Remaining fees must be an object containing amount and due date.",
  //   // "any.required": "remain_fees is required.",
  // }),

  status: Joi.string()
    .valid("paid", "pending", "partial", "overdue")
    .lowercase()
    .trim()
    .messages({
      "any.only":
        'Status must be one of "paid", "pending", "partial", or "overdue".',
    }),
  amt: Joi.number().min(0).required().messages({
    "number.base": " amount must be a number.",
    "number.min": " amount cannot be negative.",
    "any.required": "amount is required.",
  }),
  due_date: Joi.string()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/)
    .messages({
      "string.pattern.base": "Due date must be in the format DD-MM-YYYY.",
      // "any.required": "remain fees due_date required.",
    }),
    paid_date: Joi.string()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/)
    .messages({
      "string.pattern.base": "Due date must be in the format DD-MM-YYYY.",
      // "any.required": "remain fees due_date required.",
    }),
});

module.exports = feesJoiSchema;
