const mongoose = require("mongoose");
// const today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");

const marksSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student Id is required"],
    },
    subjects: {
      type: Map,
      required: [true, "subject is required"],
    },
    total: {
      type: Number,
      default: 0,
    },
    grade: {
      type: String,
      enum:["A+","A","B","C","D","F"]
    },
    percentage: {
      type: Number,
      default: 0,
    },
    resultDate: {
      type: Date,
      default: Date.now,
    },
    examNo:{
      type:Number,
      required: [true, "examNo is required"],
    }
  },
  { timestamps: true, versionKey: false }
);

marksSchema.index({ studentId: 1, examNo: 1 }, { unique: true });

module.exports = mongoose.model("Mark", marksSchema);
