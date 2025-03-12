const mongoose = require("mongoose");
let today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");

const feesSchema = new mongoose.Schema({
  s_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: [true, "Student id is required"],
  },
  t_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: [true, "teacher id is required"],
  },
  c_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "class",
    required: [true, "class id is required"],
  },
  last_fees: {
    date: {
      type: String,
      default: today,
    },
    amt: {
      type: Number,
    },
  },
  remain_fees: {
    amt: {
      type: Number,
    },
    due_date: {
      type: String,
    },
  },
  status: {
    type: String,
    uppercase: true,
  },
});

module.exports = mongoose.model("Fees", feesSchema);
