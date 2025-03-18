const mongoose = require("mongoose");
const teacherStudentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name must be required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email must be required"],
    },
    password: {
      type: String,
      required: [true, "Password must be required"],
    },
    role: {
      type: String,
      enum: ["teacher", "student"],
      required: [true, "Role is required"],
    },
    dob: {
      type: Date,
    },
    class: {
      type: [String],
    },
    sub: {
      type: [String],
    },
    batch: {
      type: String,
    },
    join_date: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },
    phone: {
      type: Number,
      required: [true, "Phone is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    hobby: {
      type: [String],
      default:undefined
    },
    admission_date: {
      type: Date,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("TeacherStudent", teacherStudentSchema);
