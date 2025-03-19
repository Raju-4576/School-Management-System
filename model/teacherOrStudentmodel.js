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
      default: undefined,
    },
    sub: {
      type: [String],
      default: undefined,
    },
    batch: {
      type: String,
    },
    join_date: {
      type: Date,
      default: Date.now,
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
      default: undefined,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherStudent",
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("TeacherStudent", teacherStudentSchema);
