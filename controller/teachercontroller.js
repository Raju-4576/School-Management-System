const teacher = require("../model/teachermodel");
const teacherjoischema = require("../validation/teacherValidation");
exports.insertTeacherData = async (req, res) => {
  try {

    const email=req.body.email;
    const existEmail=await teacher.findOne({email})
    if(existEmail){
        return res.status(400).json({
            message:"Email already exist , please Enter another email"
          });
    }

    const { error } = teacherjoischema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }

    let data = await teacher.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Teacher created success",
      data,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.teacherLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    if (!email) {
     return res.status(400).json({
        message: "please enter email",
      });
    }
    if (!password) {
     return res.status(400).json({
        message: "please enter password",
      });
    }
    var data = teacher.findOne({ email: email, password: password });
    if (data) {
      res.status(200).json({
        message: "Login success",
      });
    } else {
      res.status(404).json({
        message: "Enter Correct Email or Address",
      });
    }
  } catch (error) {
    console.error(error);
  }
};
