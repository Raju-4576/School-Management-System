const mongoose = require("mongoose");

const feesSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: [true, "Student id is required"],
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: [true, "Admin id is required"],
  },
  total_paid_fees:{
    type:Number
  },
  total_fees: {
    type: Number,
  },
  paid_fees: {
    paid_date: {
      type: Date,
    },
    amt: {
      type: Number,
    },
  },
  remain_fees: {
    remain_amt: {
      type: Number,
    },
    due_date: {
      type: Date,
    },
  },
  status: {
    type: String,
    uppercase: true,
  },
});

module.exports = mongoose.model("Fees", feesSchema);
