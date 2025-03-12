const mongoose = require("mongoose");
let today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");
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
  Event_name: {
    type: String,
  },
  date: {
    type: String,
    default: today,
  },
  time: {
    from: { type: String, required: true, default: fromTime },
    to: { type: String, required: true, default: toTime },
  },
  Organizers: {
    type: [String],
  },
  Event_place: {
    type: String,
    uppercase: true,
  },
  t_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    required: [true, "Teacher id must be required"],
  },
});

module.exports = mongoose.model("Event", eventSchema);
