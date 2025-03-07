const mongoose = require("mongoose");
const techerSchema = new mongoose.Schema({
  name: {
    type:String,
  },
  email: {
    type:String
  },
  password:{
    type:String
  },
  role:{
    type:String
  },
  class:{
    type:[String]
  },
  sub:{
    type:[String]
  },
  phone:{
    type:Number
  },
  address:{
    type:String
  },
  batch:{
    type:String
  }
});

module.exports = mongoose.model("teacher", techerSchema);
