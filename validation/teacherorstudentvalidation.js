const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const teacherOrStudentValidation = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,10}$/)
    .required(),
  role: Joi.string().valid("student", "teacher").required(),
  dob: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  gender: Joi.string().valid("male", "female", "other").required(),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .required(),
  address: Joi.string().max(200).required(),
  join_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  admission_date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  hobby: Joi.array().items(Joi.string().trim().min(3).max(30)).min(2),
  class: Joi.array().items(Joi.string().trim().min(2).max(10)),
  sub: Joi.array().items(Joi.string().trim().min(3).max(30)).min(2),
  batch: Joi.string().valid("morning", "afternoon"),
  teacherId: Joi.objectId(),
  classId: Joi.objectId(),
});

module.exports = teacherOrStudentValidation;
