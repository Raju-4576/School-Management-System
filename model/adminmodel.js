const { required } = require("joi");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required:[true,"Username is required"]

  },
  password: { type: String },
  email: {
    type: String,
    unique: true,
    required:[true,"Email is required"]

  },
  token: {
    type: String,
  },
  role:{
    type:String,
    required:[true,"Role is required"]
  }
});
module.exports = mongoose.model("Admin", adminSchema);
