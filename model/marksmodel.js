const mongoose = require("mongoose");
let today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");

const marksSchema = new mongoose.Schema(
  {
    s_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      unique: true,
    },
    t_id: {
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
module.exports = mongoose.model("mark", marksSchema);
