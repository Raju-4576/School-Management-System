const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const eventJoiSchema = Joi.object({
  eventName: Joi.string().min(3).max(100).trim().required(),
  eventPlace: Joi.string().min(10).max(300).trim().required(),
  eventDate: Joi.string()
    .pattern(/^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  from: Joi.string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i),

  to: Joi.string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i),


  organizers: Joi.array()
    .items(
      Joi.string().trim().min(2).max(30)
    )
    .min(2)
    .required(),

  className: Joi.array()
    .items(
      Joi.string().trim().min(2).max(30)
    )
    .min(1)
    .required(),
});


const eventUpdateJoiSchema = Joi.object({
  eventName: Joi.string().min(3).max(100).trim(),
  eventPlace: Joi.string().min(10).max(300).trim(),
  eventDate: Joi.string()
    .pattern(/^(20\d{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
  from: Joi.string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i),

  to: Joi.string()
    .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i),


  organizers: Joi.array()
    .items(
      Joi.string().trim().min(2).max(30)
    )
    .min(2),

  className: Joi.array()
    .items(
      Joi.string().trim().min(2).max(30)
    )
    .min(1),
});
module.exports = {eventJoiSchema,eventUpdateJoiSchema};
