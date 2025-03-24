const mongoose = require("mongoose");
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

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: [true, "Event name Must be required"],
    },
    eventDate: {
      type: Date,
      default: Date.now,
    },
    eventTime: {
      from: { type: String, required: true, default: fromTime },
      to: { type: String, required: true, default: toTime },
    },
    organizers: {
      type: [String],
      required: [true, "organizers must be required"],
    },
    eventPlace: {
      type: String,
      uppercase: true,
      required: [true, "Event Place must be required"],
    },
    className: {
      type: [String],
      required: [true, "Class Name must be required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Event", eventSchema);
