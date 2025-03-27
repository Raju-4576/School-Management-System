const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const feesJoiSchema = Joi.object({
  total_paid_fees: Joi.number(),
  total_fees: Joi.number(),
  status: Joi.string()
    .valid("paid", "partial", "overdue")
    .lowercase(),
  amt: Joi.number().min(0).required(),
  due_date: Joi.string().pattern(
    /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  ),
  paid_date: Joi.string().pattern(
    /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  ),
});

const updateFeesSchema = Joi.object({
  total_paid_fees: Joi.number(),
  total_fees: Joi.number(),
  status: Joi.string()
    .valid("paid", "pending", "partial", "overdue")
    .lowercase(),
  amt: Joi.number().min(0),
  due_date: Joi.string().pattern(
    /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  ),
  paid_date: Joi.string().pattern(
    /^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  ),
});

const statusValidation = Joi.object({

  status: Joi.string()
    .valid("paid", "partial", "overdue")
    .lowercase()
    .required()

});

const classNamevalidation=Joi.object({
  className: Joi.string()
      .required()
      .pattern(/^(?:[1-9]|1[0-2])[A-Z]$/),
})
const statusAndClassValidation = Joi.object({
  className: Joi.string()
    .required()
    .pattern(/^(?:[1-9]|1[0-2])[A-Z]$/).required(),
  status: Joi.string()
    .valid("paid", "partial", "overdue")
    .lowercase()
    .required()
})
module.exports = { feesJoiSchema, updateFeesSchema, statusValidation,statusAndClassValidation,classNamevalidation };
