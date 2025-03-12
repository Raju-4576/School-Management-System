const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const eventJoiSchema = Joi.object({
  Event_name: Joi.string().min(3).max(100).trim().required().messages({
    "string.base": "Event name must be a string.",
    "string.empty": "Event name is not Empty",
    "string.min": "Event name should have at least 3 characters.",
    "string.max": "Event name should not exceed 100 characters.",
    "any.required": "Event name is required.",
  }),
  Event_place: Joi.string().min(10).max(300).trim().required().messages({
    "string.base": "Event Place must be a string.",
    "string.empty": "Event Place is not Empty",
    "string.min": "Event Place should have at least 3 characters.",
    "string.max": "Event Place should not exceed 100 characters.",
    "any.required": "Event Place is required.",
  }),
  date: Joi.string()
    .pattern(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\d{4})$/)
    .messages({
      "string.pattern.base": "date must be in the format DD-MM-YYYY.",
      "string.empty": "date is not Empty.",
      //   "any.required": "date field is required.",
    }),
  time: Joi.object({
    from: Joi.string()
      .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i)
      .required()
      .messages({
        "string.base": "From time must be a string in 'hh:mm AM/PM' format.",
        "string.pattern.base":
          "From time format should be 12 hour so don't use 13:00 15:00  'hh:mm AM/PM' (e.g., 03:30[space]PM).",
        "any.required": "From time is required.",
      }),

    to: Joi.string()
      .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i)
      .required()
      .messages({
        "string.base": "To time must be a string in 'hh:mm AM/PM' format.",
        "string.pattern.base":
          "From time format should be 12 hour so don't use 13:00 15:00  'hh:mm AM/PM' (e.g., 05:30[space]PM).",
        "any.required": "To time is required.",
      }),
  }).messages({
    "object.base": "Time must be an object with 'from' and 'to' fields.",
    //   "any.required": "Time field is required.",
  }),

  Organizers: Joi.array()
    .items(
      Joi.string().trim().min(2).max(30).messages({
        "string.empty": "Organizers name cannot be empty.",
        "string.min": "Organizers name must have at least 2 characters.",
        "string.max": "Organizers name must not exceed 30 characters.",
        "string.base": "Each Organizers must be a string.",
      })
    )
    .min(2)
    .required()
    .messages({
      "array.base": "Organizers must be an array of strings.",
      "array.min": "At least 2 Organizers is required.",
      "any.required": "Organizers field is required.",
    }),

  t_id: Joi.objectId().messages({
    "string.pattern.base": "Invalid Teacher ID format.",
  }),
});

module.exports = eventJoiSchema;
