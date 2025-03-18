const teacherOrStudent = require("../model/teacherOrStudentmodel");
const teacherorStudentJoiSchema = require("../validation/teacherorstudentvalidation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.insertTeacherOrStudent = async (req, res) => {
  try {
    const { password, email, role } = req.body;
    const teacherId = req.user.id;
    const { classId } = req.params;

    const { error } = teacherorStudentJoiSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error.details.map((e) => e.message),
      });
    }

    const existEmail = await teacherOrStudent.findOne({ email });
    if (existEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists, please use another email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let basicData = {
      ...req.body,
      classId,
      password: hashedPassword,
    };

    if (role !== "teacher") {
      basicData.teacherId = teacherId;
    }

    const data = await teacherOrStudent.create(basicData);

    res.status(200).json({
      message: "Insert Success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
