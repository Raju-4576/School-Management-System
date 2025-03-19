const teacherOrStudent = require("../model/teacherOrStudentmodel");
const {
  teacherOrStudentValidation,
  teacherOrStudentLoginValidation,
  teacherOrStudentUpdateValidation,
  teacherOrStudentUpdateRoleValidation,
} = require("../validation/teacherorstudentvalidation");
const classes = require("../model/classmodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.insertTeacherOrStudent = async (req, res) => {
  try {
    const { password, email, role } = req.body;
    const { classId, teacherId } = req.params;

    const { error } = teacherOrStudentValidation.validate(req.body, {
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

    if (role === "teacher") {
      const findClassId = await classes.findById({ _id: classId });
      if (!findClassId) {
        return res.status(404).json({ message: "Class is not Found" });
      }

      const existClassId = await teacherOrStudent.findOne({ classId: classId });
      if (existClassId) {
        return res.status(400).json({
          message:
            "This class already has a teacher. Please assign another class.",
        });
      }
      basicData.classId = classId;
    } else if (role === "student") {
      const findTeacherId = await teacherOrStudent.findOne({
        _id: teacherId,
      });
      if (!findTeacherId) {
        return res.status(404).json({ message: "Teacher is not Found" });
      }
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

exports.loginTeacherOrStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = teacherOrStudentLoginValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error,
      });
    }
    const data = await teacherOrStudent.findOne({ email });
    if (!data) {
      return res.status(404).json({
        message: "invalid Email",
      });
    }
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid  password.",
      });
    }

    const token = jwt.sign({ role: data.role, id: data._id }, process.env.KEY);
    res.status(200).json({
      message: `login success,you are login as a ${data.role}`,
      user: data,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

exports.updateTeacherOrStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, email } = req.body;

    const { error } = teacherOrStudentUpdateValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error,
      });
    }

    if (email) {
      const existEmail = await teacherOrStudent.findOne({
        email,
        _id: { $ne: id },
      });
      if (existEmail) {
        return res
          .status(400)
          .json({ message: "Email already exists. Choose another email." });
      }
    }

    let updateData = { ...req.body };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const data = await teacherOrStudent.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({
      status: "success",
      message: "updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateTeacherofStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId } = req.body;

    const { error } = teacherOrStudentUpdateRoleValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error,
      });
    }

    const existTeacher = await teacherOrStudent.findOne({
      _id: teacherId,
      role: "teacher",
    });
    if (!existTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    const student = await teacherOrStudent.findOne({
      _id: id,
      role: "student",
    });
    if (!student) {
      return res
        .status(404)
        .json({ message: "Student not found or role is not 'student'" });
    }

    student.teacherId = teacherId;
    await student.save();
    res.status(200).json({
      status: "success",
      message: "updated successfully",
      student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.findAllTeacher = async (req, res) => {
  try {
    const data = await teacherOrStudent
      .find({ role: "teacher" })
      .select("name class classId sub batch -_id")
      .populate("classId", "className -_id");
    if (!data) {
      return res.status(404).json({ message: "data Not found" });
    }
    res.status(200).json({ message: "All Teacher", total: data.length, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findAllStudent = async (req, res) => {
  try {
    const data = await teacherOrStudent
      .find({ role: "student" })
      .select("name -_id")
      .populate({
        path: "teacherId",
        select: "name -_id",
        populate: {
          path: "classId",
          select: "className -_id",
        },
      });

    if (!data) {
      return res.status(404).json({ message: "data Not found" });
    }

    const result = data.map((student) => ({
      studentName: student.name,
      className: student.teacherId?.classId?.className || "Not Assigned",
    }));
    res.status(200).json({
      message: "All Students",
      total: data.length,
      students: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.countClassStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const findTeacher = await teacherOrStudent
      .findOne({ _id: id, role: "teacher" })
      .select("name classId -_id")
      .populate("classId", "className -_id");

    if (!findTeacher) {
      return res.status(404).json({ message: "Teacher not Found" });
    }

    const allStudent = await teacherOrStudent
      .find({ role: "student" })
      .select("name -_id")
      .populate({
        path: "teacherId",
        select: "name -_id",
        populate: {
          path: "classId",
          select: "className -_id",
        },
      });

    const filteredStudents = allStudent.filter((student) => {
      return (
        student.teacherId?.classId?.className === findTeacher.classId?.className
      );
    });
    const studentList = filteredStudents.map((student) => ({
      studentName: student.name,
    }));
    return res.status(200).json({
      message: "Find",
      total: studentList.length,
      className: findTeacher.classId?.className,
      studentList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
};
