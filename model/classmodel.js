const mongoose = require("mongoose");
const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      unique: true,
      require:[true,"Class Name is required"]
    },
    classStream: {
      type: String,
      enum:['commerce','science','arts','general'],
      require:[true,"Class stream is required"]
    },
    fees: {
      type: Number,
      require:[true,"Fees is required"]
    },
    subjects: {
      type: [String],
      require:[true,"Subject is required"]
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("Class", classSchema);
