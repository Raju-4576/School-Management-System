const mongoose = require("mongoose");
const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    date: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: String,
      uppercase: true,
    },
    remarks: {
      type: String,
      default: "---",
    },
  },
  { timestamps: true, versionKey: false }
);

attendanceSchema.index({ s_id: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("Attendance", attendanceSchema);
