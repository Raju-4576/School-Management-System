const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    c_name: {
      type: String,
      unique: true,
    },
    class_stream: {
      type: String,
    },
    fees: {
      type: Number,
    },
    subjects: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Class", classSchema);
