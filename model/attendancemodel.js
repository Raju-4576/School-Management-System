const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "student id is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    status: {
      type: String,
      uppercase: true,
      enum: ["P", "A", "HO", "HD"],
      required: [true, "status is required"],
    },
    remarks: {
      type: String,
      default: "--",
    },
  },
  { timestamps: true, versionKey: false }
);
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("Attendance", attendanceSchema);
