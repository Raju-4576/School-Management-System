const mongoose = require("mongoose");
let futureDate = new Date();
futureDate.setMonth(futureDate.getMonth() + 2);

const feesSchema = new mongoose.Schema({
  s_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: [true, "Student id is required"],
  },
  a_id: {
    // type: mongoose.Schema.Types.ObjectId,
    // ref: "teacher",
    // required: [true, "teacher id is required"],
    type:String
  },
  total_paid_fees:{
    type:Number
  },
  total_fees: {
    type: Number,
  },
  paid_fees: {
    paid_date: {
      type: String,
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
      type: String,
    },
  },
  status: {
    type: String,
    uppercase: true,
  },
});

module.exports = mongoose.model("Fees", feesSchema);
