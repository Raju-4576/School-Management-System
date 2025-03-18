const mongoose = require("mongoose");
const today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");

const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      unique: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
    subjects: {
      type: Map,
    },
    total: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    result_date: {
      type: String,
      default: today,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Mark", marksSchema);
