const attedance = require("../model/attendancemodel");
const attedancejoimodel = require("../validation/attedancevalidation");
exports.insertAttedance = async (req, res) => {
  try {
    let t_id = req.user.id;
    let s_id = req.params.id;

    const studentExists = await student.findById(s_id);
    if (!studentExists) {
      return res.status(404).json({ message: "Student does not exist" });
    }

    const { error } = attedancejoimodel.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }
    let data = await attedance.create({
      ...req.body,
      t_id: t_id,
      s_id: s_id,
    });
    res.status(201).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate entry: Attendance has been taken" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getAllAttedance = async (req, res) => {
  try {
    const data = await attedance.find();
    if (!data) {
      return res.status(400).json({ message: "data not found" });
    }
    res.status(200).json({ message: "success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateAttedance = async (req, res) => {
  try {
    let t_id = req.user.id;
    let id = req.params.id;
    const { error } = attedancejoimodel.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }
    const data = await attedance.findOneAndUpdate(
      { s_id: id },
      { ...req.body, t_id },
      { new: true }
    );

    if (!data) {
      return res.status(400).json({ message: "No Record Exists" });
    }
    res.status(200).json({ message: "Update success", data });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Duplicate entry: Attendance has been taken" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAttedance = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await attedance.findOneAndDelete({ s_id: id });
    if (!data) {
      return res.status(404).json({ message: "No record found with this ID" });
    }
    res.status(200).json({
      message: "Data Deleted Success",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getSingleStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await attedance.find({ s_id: id });
    if (!data) {
      return res.status(400).json({ message: "no data found" });
    }
    const presentdays = data.filter((item) => item.status === "P").length;
    const absentdays = data.filter((item) => item.status === "A").length;
    const holidays = data.filter((item) => item.status === "HO").length;
    const halfday = data.filter((item) => item.status === "HD").length;
    const filteredData = data.map((item) => ({
      date: item.date,
      remark: item.remarks,
      status: item.status,
    }));
    res.status(200).json({
      message: "show your attedance",
      totalDays: data.length,
      Presentdays: presentdays,
      Absentdays: absentdays,
      Holidays: holidays,
      Halfday: halfday,
      data: filteredData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAttedanceDatewise = async (req, res) => {
  try {
    let today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");
    let attendanceDate = req.body.date ? req.body.date : today;
    const attendanceRecords = await attedance.find({ date: attendanceDate });

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return res
        .status(400)
        .json({ message: "No attendance records found for this date" });
    }

    const totalStudents = attendanceRecords.length;
    const presentStudents = attendanceRecords.filter(
      (record) => record.status === "P"
    ).length;
    const absentStudents = attendanceRecords.filter(
      (record) => record.status === "A"
    ).length;

    res.status(200).json({
      message: "Attendance summary for the selected date",
      date: attendanceDate,
      totalStudents,
      presentStudents,
      absentStudents,
      data: attendanceRecords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
