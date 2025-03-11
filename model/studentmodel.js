const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "Student",
    },
    DOB: {
      type: String,
    },
    gender: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    hobby: {
      type: [String],
    },
    admission_date: {
      type: String,
    },
    stream: {
      type: String,
    },
    token: {
      type: String,
    },
    t_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
      required: [true, "Teacher ID is required."],
    },
    c_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "Class ID is required."],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
