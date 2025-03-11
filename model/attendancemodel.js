const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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
      type: Date,
    },
    status: {
      type: String,
      uppercase: true,
    },
    remarks: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
