const mongoose = require("mongoose");
// const today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");
const currentTime = new Date();
const fromTime = currentTime.toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

currentTime.setHours(currentTime.getHours() + 2);

const toTime = currentTime.toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
  },
  date: {
    type: Date,
    default: new Date(),
  },
  time: {
    from: { type: String, required: true, default: fromTime },
    to: { type: String, required: true, default: toTime },
  },
  organizers: {
    type: [String],
  },
  eventPlace: {
    type: String,
    uppercase: true,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: [true, "Teacher id must be required"],
  },
});

module.exports = mongoose.model("Event", eventSchema);
