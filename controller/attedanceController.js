const attedance = require("../model/attendancemodel");
const {
  attendanceValidationSchema,
  updateAttedanceValidation,
  monthValidation,
  statusValidation,
} = require("../validation/attedancevalidation");
const teacherOrStudent = require("../model/teacherOrStudentmodel");
const { default: mongoose } = require("mongoose");
exports.insertAttendance = async (req, res) => {
  try {
    const { error } = attendanceValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ status: "Validation Error", errors: error });
    }
    const { id } = req.user;
    const { date } = req.body;
    const { studentId } = req.params;

    const studentExists = await teacherOrStudent.findOne({
      _id: studentId,
      teacherId: id,
    });

    if (!studentExists) {
      return res
        .status(404)
        .json({ message: "Student does not exist or is not assigned to you." });
    }
    const finalDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(finalDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(finalDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existAttendance = await attedance.findOne({
      studentId: studentId,
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    console.log(existAttendance);

    if (existAttendance) {
      return res.status(400).json({
        message: "Attendance for this student has already been recorded today.",
      });
    }
    const data = await attedance.create({
      ...req.body,
      studentId,
      date: finalDate,
    });

    return res.status(201).json({ message: "Success", data });
  } catch (error) {
    console.error("Error inserting attendance:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateAttedance = async (req, res) => {
  try {
    const { error } = updateAttedanceValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res
        .status(400)
        .json({ status: "Validation Error", errors: error });
    }
    const { id } = req.params;
    const teacherId = req.user.id;
    // const findStudent = await attedance.findById(id).populate({
    //   path: "studentId",
    //   select: "teacherId",
    //   model: "TeacherStudent",
    // });
    const findStudent = await attedance.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "teacherstudents",
          localField: "studentId",
          foreignField: "_id",
          as: "data",
        },
      },
      {
        $unwind: "$data",
      },
      {
        $match: {
          "data.teacherId": new mongoose.Types.ObjectId(teacherId),
        },
      },
    ]);

    if (!findStudent) {
      return res
        .status(400)
        .json({ message: "Record not Exist or Otherwise not your student" });
    }
    const data = await attedance.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: "Update success", data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAttedance = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;

    // const findStudent = await attedance.findById(id).populate({
    //   path: "studentId",
    //   model: "TeacherStudent",
    // });
    // if (!findStudent) {
    //   return res.status(400).json({ message: "Record not Exist" });
    // }
    // const findTeacherId = findStudent?.studentId?.teacherId;
    // if (findTeacherId.equals(teacherId)) {
    //   return res
    //     .status(400)
    //     .json({ message: "This is not your Class student" });
    // }

    const findStudent = await attedance.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "teacherstudents",
          localField: "studentId",
          foreignField: "_id",
          as: "data",
        },
      },
      {
        $unwind: "$data",
      },
      {
        $match: {
          "data.teacherId": new mongoose.Types.ObjectId(teacherId),
        },
      },
    ]);

    if (!findStudent) {
      return res
        .status(400)
        .json({ message: "Record not Exist or Otherwise not your student" });
    }
    const data = await attedance.findByIdAndDelete(id);
    res.status(200).json({
      message: "Data Deleted Success",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.showStudentAttedanceRecordByMonth = async (req, res) => {
  try {
    const { error } = monthValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ status: "Validation Error", errors: error });
    }
    const { studentId } = req.params;
    const { month } = req.body;

    const startDate = new Date(new Date().getFullYear(), month - 1, 1); // 2025-02-28
    const endDate = new Date(new Date().getFullYear(), month, 0, 23, 59, 59);

    console.log(
      `Filtering attendance from ${startDate.toISOString()} to ${endDate.toISOString()}`
    );

    const data = await attedance.find({
      studentId: studentId,
      date: {
        $gt: startDate,
        $lte: endDate,
      },
    });

    if (!data.length) {
      return res
        .status(404)
        .json({ message: `No attendance data found for month ${month}.` });
    }

    const presentDays = data.filter((item) => item.status === "P").length;
    const absentDays = data.filter((item) => item.status === "A").length;
    const holidays = data.filter((item) => item.status === "HO").length;
    const halfDays = data.filter((item) => item.status === "HD").length;

    const filteredData = data.map((item) => ({
      date: item.date.toISOString().slice(0, 10),
      remark: item.remarks,
      status: item.status,
    }));

    res.status(200).json({
      message: `Attendance records for month ${month}`,
      totalDays: data.length,
      PresentDays: presentDays,
      AbsentDays: absentDays,
      Holidays: holidays,
      HalfDays: halfDays,
      data: filteredData,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//class wise absent present
exports.showOwnStudentAttedance = async (req, res) => {
  try {
    const { id } = req.user;
    const { date } = req.body;

    const today = date ? new Date(date) : new Date();

    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log("Start of Day:", startOfDay.toISOString());
    console.log("End of Day:", endOfDay.toISOString());

    const data = await attedance
      .find({
        date: { $gte: startOfDay, $lt: endOfDay },
      })
      .populate({
        path: "studentId",
        model: "TeacherStudent",
        select: "name teacherId",
        
      });

    if (!data.length) {
      return res
        .status(404)
        .json({ message: "No attendance records found for today" });
    }

    const filteredData = data.filter((entry) =>
      entry?.studentId?.teacherId.equals(id)
    );

    if (filteredData.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance records found for your students" });
    }

    const totalStudents = filteredData.length;
    const totalPresent = filteredData.filter(
      (entry) => entry.status === "P"
    ).length;
    const totalAbsent = filteredData.filter(
      (entry) => entry.status === "A"
    ).length;

    const result = {
      date: today.toISOString().slice(0, 10),
      totalStudents,
      totalPresent,
      totalAbsent,
      students: filteredData.map((entry) => ({
        name: entry.studentId.name,
        status: entry.status,
      })),
    };

    res.status(200).json({ message: "Success", result });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//allover absent present
exports.allOverAbsentPresent = async (req, res) => {
  try {
    const { date } = req.body;
    const today = date ? new Date(date) : new Date();

    const startOfDay = new Date(today);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const data = await attedance
      .find({ date: { $gte: startOfDay, $lt: endOfDay } })
      .select("status -_id remarks");

    const totalPresentStudent = data.filter(
      (status) => status.status === "A"
    ).length;
    const totalAbsentStudent = data.filter(
      (status) => status.status === "P"
    ).length;
    res
      .status(200)
      .json({ message: "Success", totalAbsentStudent, totalPresentStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.fullAttend = async (req, res) => {
  try {
    const { status } = req.body;
    const { error } = statusValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ status: "Validation Error", errors: error });
    }

    const attendanceRecords = await attedance.find({ status: status });

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No present students found." });
    }

    const attendanceCount = attendanceRecords.reduce((acc, record) => {
      const studentId = record.studentId._id.toString();
      acc[studentId] = (acc[studentId] || 0) + 1;
      return acc;
    }, {});

    const topStudentId = Object.keys(attendanceCount).reduce((a, b) =>
      attendanceCount[a] > attendanceCount[b] ? a : b
    );

    const topStudent = await teacherOrStudent
      .findById(topStudentId)
      .select("name classId -_id");

    res.status(200).json({
      message: "All over Most present student",
      attendanceCount,
      student: topStudent,
      totalPresentDays: attendanceCount[topStudentId],
    });
  } catch (error) {
    console.error("Error fetching full attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.fullAttendClassWise = async (req, res) => {
  try {
    const { id } = req.user;
    const { status } = req.body;
    const { error } = statusValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ status: "Validation Error", errors: error });
    }
    const attendanceRecords = await attedance
      .find({ status: status })
      .populate({
        path: "studentId",
        model: "TeacherStudent",
      });

    const filteredStudents = attendanceRecords.filter((record) =>
      record?.studentId?.teacherId.equals(id)
    );

    if (!filteredStudents.length) {
      return res
        .status(404)
        .json({ message: "No present students found for your class." });
    }

    const attendanceCount = filteredStudents.reduce((acc, record) => {
      const studentId = record.studentId._id.toString();
      acc[studentId] = (acc[studentId] || 0) + 1;
      return acc;
    }, {});

    const topStudentId = Object.keys(attendanceCount).reduce((a, b) =>
      attendanceCount[a] > attendanceCount[b] ? a : b
    );

    const topStudent = await teacherOrStudent
      .findById(topStudentId)
      .select("name classId -_id");

    res.status(200).json({
      message: "Most present student classwise",
      student: topStudent,
      totalPresentDays: attendanceCount[topStudentId],
    });
  } catch (error) {
    console.error("Error fetching full attendance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.totalSchoolDays = async (req, res) => {
  try {
    const attendanceRecords = await attedance.find().select("date -_id");

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found." });
    }

    const uniqueDates = new Set(
      attendanceRecords.map((record) => record.date.toISOString().slice(0, 10))
    );

    console.log(uniqueDates);

    res.status(200).json({
      message: "Total school days counted successfully",
      totalSchoolDays: uniqueDates.size,
    });
  } catch (error) {
    console.error("Error fetching total school days:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
