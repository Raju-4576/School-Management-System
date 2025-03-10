var mongoose = require("mongoose");
const marksSchema = new mongoose.Schema({
  subject1: {
    type: Number,
  },
  subject2: {
    type: Number,
  },
  subject3: {
    type: Number,
  },
  subject4: {
    type: Number,
  },
  subject5: {
    type: Number,
  },
  total: {
    type: Number,
  },
  Grade: {
    type: String,
  },
  percentage: {
    type: Number,
  },
});
module.exports = mongoose.model("Marks", marksSchema);
