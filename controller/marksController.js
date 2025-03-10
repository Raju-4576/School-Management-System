const marks = require("../model/marksmodel");
const marskjoiSchema = require("../validation/marksValidation");

exports.insertMarks = async (req, res) => {
  try {
    const { error } = marskjoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((e) => e.message),
      });
    }

    const { subject1, subject2, subject3, subject4, subject5 } = req.body;

    let total = subject1 + subject2 + subject3 + subject4 + subject5;
    req.body.total = total;

    let percentage = parseFloat((total / 5).toFixed(2));
    req.body.percentage = percentage;

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
    req.body.grade = grade;

    let data = await marks.create(req.body);

    res.status(201).json({
      status: "success",
      message: "Marks inserted successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
