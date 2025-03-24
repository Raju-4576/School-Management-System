const marks = require("../model/marksmodel");
const {
  marksValidationSchema,
  marksUpdateValidationSchema,
  showResultValidation,
  topperValidation,
  topperAllValidation,
} = require("../validation/marksValidation");
const teacherOrStudent = require("../model/teacherOrStudentmodel");
const classes = require("../model/classmodel");

const calculateMarks = (subjects) => {
  const marksArr = Object.values(subjects);
  const hasFailingSubject = marksArr.some((mark) => mark < 35);

  const total = marksArr.reduce((sum, mark) => sum + mark, 0);
  const percentage = parseFloat((total / marksArr.length).toFixed(2));

  let grade = "";

  if (hasFailingSubject) {
    grade = "F";
  } else {
    switch (true) {
      case percentage >= 90:
        grade = "A+";
        break;
      case percentage >= 80:
        grade = "A";
        break;
      case percentage >= 70:
        grade = "B";
        break;
      case percentage >= 60:
        grade = "C";
        break;
      case percentage >= 35:
        grade = "D";
        break;

    }
  }

  return { total, percentage, grade };
};

exports.insertMarks = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { id } = req.user;
    const { subjects, examNo } = req.body;

    const { error } = marksValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error,
      });
    }

    const existEntry = await marks.findOne({ studentId, examNo });
    if (existEntry) {
      return res
        .status(400)
        .json({ message: "Student marks already Given for this exam" });
    }

    const findStudent = await teacherOrStudent.findOne({
      _id: studentId,
    });

    if (!findStudent.teacherId.equals(id)) {
      return res
        .status(400)
        .json({ message: "This student does not belong to your class" });
    }

    const { total, percentage, grade } = calculateMarks(subjects);

    const data = await marks.create({
      studentId,
      subjects,
      examNo,
      total,
      percentage,
      grade,
    });

    return res.status(201).json({
      status: "success",
      message: "Marks inserted successfully",
      data,
    });
  } catch (error) {
    console.error("Insert Marks Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.markUpdate = async (req, res) => {
  try {
    const { markId } = req.params;
    const { subjects } = req.body;
    const teacherId = req.user?.id;

    const { error } = marksUpdateValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }

    const findStudent = await marks.findById(markId).populate({
      path: "studentId",
      model: "TeacherStudent",
      populate: { path: "teacherId" },
    });

    if (!findStudent) {
      return res.status(404).json({ message: "Marks record not found" });
    }

    const studentTeacherId = findStudent?.studentId?.teacherId?._id;

    if (!studentTeacherId || !studentTeacherId.equals(teacherId)) {
      return res.status(403).json({
        message: "You are not authorized to update this student's marks",
      });
    }

    const updateFields = { ...req.body };

    if (subjects) {
      const { total, percentage, grade } = calculateMarks(subjects);
      updateFields = { ...updateFields, total, percentage, grade };
    }

    const updatedData = await marks.findByIdAndUpdate(markId, updateFields, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({ message: "Marks updated successfully", data: updatedData });
  } catch (error) {
    console.error("Mark Update Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSingleMarks = async (req, res) => {
  try {
    const { id } = req.user;
    const { examNo } = req.body;

    const { error } = showResultValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error,
      });
    }

    const data = await marks.findOne({ studentId: id, examNo: examNo }).select("subjects total grade percentage -_id");
    if (!data) {
      return res.status(400).json({
        message: "Data not found",
      });
    }
    return res.status(200).json({
      message: "Find Result success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await marks.findByIdAndDelete(id);
    res.status(200).json({
      message: "Data Deleted Success",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findTop3ClassWise = async (req, res) => {
  try {
    const { className, examNo } = req.body;
    const { error } = topperValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error,
      });
    }
    const existClass = await classes.findOne({ className });

    if (!existClass) {
      return res.status(400).json({ message: "Class not found" });
    }

    const teacher = await teacherOrStudent.findOne({
      classId: existClass._id,
    });

    if (!teacher) {
      return res
        .status(400)
        .json({ message: "No teacher found for this class" });
    }

    const students = await teacherOrStudent.find({
      teacherId: teacher._id,
    });

    if (students.length === 0) {
      return res
        .status(400)
        .json({ message: "No students found in this class" });
    }

    const studentIds = students.map((student) => student._id);

    const studentMarks = await marks
      .find({ studentId: { $in: studentIds }, examNo })
      .sort({ percentage: -1 })
      .limit(3)
      .populate({
        path: "studentId",
        select: "name -_id",
        model: "TeacherStudent",
      });

    if (studentMarks.length === 0) {
      return res
        .status(400)
        .json({ message: "No marks data found for this class" });
    }
    const result = studentMarks.map((mark) => ({
      studentName: mark?.studentId?.name || "Unknown",
      percentage: mark?.percentage,
    }));
    return res.status(200).json({
      message: `Top 3 students of class ${className}`,
      topStudents: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.findTop3AllClassWise = async (req, res) => {
  try {
    const { className, examNo } = req.body;
    const { error } = topperAllValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error,
      });
    }
    const classList = await classes.find({
      className: { $regex: `^${className}`, $options: "i" },
    });

    if (classList.length === 0) {
      return res
        .status(400)
        .json({ message: "No classes Found for this number" });
    }
    const allClassIds = classList.map((c) => c._id);
    const findTeacher = await teacherOrStudent.find({
      classId: { $in: allClassIds },
    });

    const allTeacherIds = findTeacher.map((t) => t._id);

    const findStudent = await teacherOrStudent.find({
      teacherId: { $in: allTeacherIds },
    });

    const allStudentIds = findStudent.map((s) => s._id);

    const marksData = await marks
      .find({ studentId: { $in: allStudentIds }, examNo })
      .populate({
        path: "studentId",
        model: "TeacherStudent",
        select: "name -_id",
        populate: {
          path: "teacherId",
          select: "name -_id",
          populate: {
            path: "classId",
            select: "className -_id",
          },
        },
      })
      .sort({ percentage: -1 })
      .limit(3);

    const result = marksData.map((mark) => ({
      studentName: mark?.studentId?.name || "Unknown",
      percentage: mark?.percentage,
      teacherName: mark?.studentId?.teacherId?.name || "Unknown",
      className: mark?.studentId?.teacherId?.classId?.className,
    }));
    res.status(200).json({
      message: `Top 3 student of ${className} classes`,
      result: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.passOrFailStudent = async (req, res) => {
  try {
    const { className, examNo } = req.body;
    const { error } = topperValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error,
      });
    }
    const existClass = await classes.findOne({ className });

    if (!existClass) {
      return res.status(400).json({ message: "Class not found" });
    }

    const teacher = await teacherOrStudent.findOne({
      classId: existClass._id,
    });

    if (!teacher) {
      return res
        .status(400)
        .json({ message: "No teacher found for this class" });
    }

    const students = await teacherOrStudent.find({
      teacherId: teacher._id,
    });
    const studentIds = students.map((student) => student._id);

    const studentMarks = await marks
      .find({ studentId: { $in: studentIds }, examNo })
      .select("-_id percentage grade")
      .populate({
        path: "studentId",
        model: "TeacherStudent",
        select: "name -_id",
        populate: { path: "teacherId", select: "name -_id" },
      });

    if (studentMarks.length === 0) {
      return res
        .status(400)
        .json({ message: "No marks data found for this class" });
    }

    const passedStudent = studentMarks.filter(
      (student) => student.grade !== "F"
    );
    const failStudent = studentMarks.filter((student) => student.grade === "F");

    res.status(200).json({
      message: "Success",
      total_pass_student: passedStudent.length,
      passedStudent: passedStudent,
      total_fail_student: failStudent.length,
      failStudent: failStudent,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.allOverClssWisePassorFail = async (req, res) => {
  try {
    const { className, examNo } = req.body;
    const { error } = topperAllValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error,
      });
    }
    const classList = await classes.find({
      className: { $regex: `^${className}`, $options: "i" },
    });

    if (classList.length === 0) {
      return res
        .status(400)
        .json({ message: "No classes Found for this number" });
    }
    const allClassIds = classList.map((c) => c._id);
    const findTeacher = await teacherOrStudent.find({
      classId: { $in: allClassIds },
    });

    const allTeacherIds = findTeacher.map((t) => t._id);

    const findStudent = await teacherOrStudent.find({
      teacherId: { $in: allTeacherIds },
    });

    const allStudentIds = findStudent.map((s) => s._id);

    const studentMarks = await marks
      .find({ studentId: { $in: allStudentIds }, examNo })
      .select("-_id percentage grade")
      .populate({
        path: "studentId",
        model: "TeacherStudent",
        select: "name -_id",
        populate: { path: "teacherId", select: "name -_id" },
      });

    if (studentMarks.length === 0) {
      return res
        .status(400)
        .json({ message: "No marks data found for this class" });
    }

    const passedStudent = studentMarks.filter(
      (student) => student.grade !== "F"
    );
    const failStudent = studentMarks.filter((student) => student.grade === "F");

    res.status(200).json({
      message: "Success",
      total_pass_student: passedStudent.length,
      passedStudent: passedStudent,
      total_fail_student: failStudent.length,
      failStudent: failStudent,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.allOverPassorFail = async (req, res) => {
  try {
    const { examNo } = req.body;
    const allStudent = await marks
      .find({ examNo })
      .select("-_id percentage grade")
      .populate({
        path: "studentId",
        model: "TeacherStudent",
        select: "name -_id",
      });
    const passedStudent = allStudent.filter((student) => student.grade !== "F");
    const failStudent = allStudent.filter((student) => student.grade === "F");

    res.status(200).json({
      message: "Success",
      total_pass_student: passedStudent.length,
      passedStudent: passedStudent,
      total_fail_student: failStudent.length,
      failStudent: failStudent,
    });
  } catch (error) {
    console.error(error);
  }
};
