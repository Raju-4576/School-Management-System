const Joi = require("joi");

const adminValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,10}$/) //one character and one number 6 to 10
    .required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/) //always in lovwercase
    .required(),
});

const adminLoginValidationSchema = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,10}$/) //one character and one number 6 to 10
    .required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/) //always in lovwercase
    .required(),
});

const adminUpdateJoiSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50),
  password: Joi.string().pattern(
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,10}$/
  ), //one character and one number 6 to 10,
  email: Joi.string()
    .email()
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/), //always in lovwercase
});
module.exports = {
  adminValidationSchema,
  adminLoginValidationSchema,
  adminUpdateJoiSchema,
};
