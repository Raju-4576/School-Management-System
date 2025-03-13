const mongoose = require("mongoose");
const techerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    class: {
      type: [String],
    },
    sub: {
      type: [String],
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    batch: {
      type: String,
    },
    join_date: {
      type: String,
    },
    token: {
      type: String,
    },
    c_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: [true, "class Id is required"],
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("teacher", techerSchema);
