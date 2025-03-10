const mongoose = require("mongoose");
// const name = [
//   "1A",
//   "1B",
//   "2A",
//   "2B",
//   "3A",
//   "3B",
//   "4A",
//   "4B",
//   "5A",
//   "5B",
//   "6A",
//   "6B",
//   "7A",
//   "7B",
//   "8A",
//   "8B",
//   "9A",
//   "9B",
//   "10A",
//   "10B",
//   "11A",
//   "11B",
//   "11C",
//   "12A",
//   "12B",
//   "12C",
// ];
const classSchema = new mongoose.Schema(
  {
    c_name: {
      type: String,
      unique: true,
      match: [
        /^(?:[1-9]|1[0-2])[A-Z]$/,
        "Invalid class name format. Use '1A' to '12Z'.",
      ],
    },
    class_stream: {
      type: String,
      set: (value) => value.toUpperCase(),
      validate: {
        validator: function (value) {
          return ["COMMERCE", "SCIENCE", "ARTS", "GENERAL"].includes(value);
        },
        message:
          "Invalid stream. Allowed values: 'COMMERCE', 'SCIENCE', 'ARTS','GENERAL'",
      },
    },
    fees: {
      type: Number,
      min: [3000, "Fees must be at least 3000."],
    },
    subjects: {
      type: [String],
      validate: {
        validator: function (value) {
          if (!Array.isArray(value)) return false; 
          if (value.length < 3) return false; 
          if (new Set(value).size !== value.length) return false; 
          return value.every(
            (subj) => typeof subj === "string" && subj.length >= 2
          ); 
        },
        message:
          "Subjects must be an array with at least 3 unique subjects, each having at least 2 characters.",
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Class", classSchema);
