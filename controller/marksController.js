const marks = require("../model/marksmodel");
const marskjoiSchema = require("../validation/marksValidation");

const calculateMarks = (subjects) => {
  let marksArr = Object.values(subjects);

  let total = marksArr.reduce((sum, mark) => sum + mark, 0);

  let percentage = parseFloat((total / marksArr.length).toFixed(2));

  let grade = "";
  if (percentage >= 90) {
    grade = "A+";
  } else if (percentage >= 80) {
    grade = "A";
  } else if (percentage >= 70) {
    grade = "B";
  } else if (percentage >= 60) {
    grade = "C";
  } else if (percentage >= 50) {
    grade = "D";
  } else {
    grade = "F";
  }

  return { total, percentage, grade };
};

exports.insertMarks = async (req, res) => {
  try {
    let t_id = req.user.id;
    let s_id = req.params.s_id;

    const { error } = marskjoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((e) => e.message),
      });
    }

    let { total, percentage, grade } = calculateMarks(req.body.subjects);

    let data = await marks.create({
      ...req.body,
      t_id,
      s_id,
      total,
      percentage,
      grade,
    });

    res.status(201).json({
      status: "success",
      message: "Marks inserted successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This student is exist enter another student record",
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getAllMarks = async (req, res) => {
  try {
    let data = await marks
      .find()
      .populate("s_id", "name")
      .populate("t_id", "-_id name");
    if (!data) {
      return res.status(400).json({
        message: "Data Not Found",
      });
    }
    res.status(200).json({
      message: "Show all Marks",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
};
exports.markUpdate = async (req, res) => {
  try {
    let t_id = req.user.id;
    const id = req.params.mark_id;
    const { error } = marskjoiSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }
    let { total, percentage, grade } = calculateMarks(req.body.subjects);

    const data = await marks.findByIdAndUpdate(
      id,
      { ...req.body, total, percentage, grade, t_id },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ message: "can not find your data" });
    }
    res.status(200).json({ message: "Update success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
exports.getSingleMarks = async (req, res) => {
  try {
    let id = req.user.id;
    if (!id) {
      return res.status(400).json({
        message: "Id not found",
      });
    }
    let data = await marks.findOne({ s_id: id });
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
    let id = req.params.id;
    console.log(id);

    let data = await marks.findOneAndDelete({ s_id: id });
    res.status(200).json({
      message: "Data Deleted Success",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
