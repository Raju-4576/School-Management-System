const mongoose = require("mongoose");
let today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");
const attendanceSchema1 = new mongoose.Schema(
  {
    s_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    t_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacher",
    },
    date: {
      type: String,
      default: today,
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
  { timestamps: true }
);

attendanceSchema1.index({ s_id: 1, date: 1 }, { unique: true });
module.exports = mongoose.model("Attendance12", attendanceSchema1);
