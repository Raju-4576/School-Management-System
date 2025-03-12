const event = require("../model/eventmodel");
const eventJoiSchema = require("../validation/eventValidation");
exports.insertEvent = async (req, res) => {
  try {
    const t_id = req.user.id;
    const { error } = eventJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((item) => item.message),
      });
    }
    const data = await event.create({ ...req.body, t_id });
    res.status(200).json({
      message: "Insert success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllEvent = async (req, res) => {
  try {
    const data = await event.find();
    if (!data || data.length === 0) {
      return res
        .status(400)
        .json({ message: "No Any Event found for this date" });
    }
    res.status(200).json({
      message: "find success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllEventbyDate = async (req, res) => {
  try {
    let today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");
    let attendanceDate = req.body.date ? req.body.date : today;
    const data = await event.find({ date: attendanceDate });
    if (!data || data.length === 0) {
      return res
        .status(400)
        .json({ message: "Not Found Any Event on this date" });
    }
    res.status(200).json({
      message: "find success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const t_id = req.user.id;
    const id = req.params.id;
    const { error } = eventJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((item) => item.message),
      });
    }
    const data = await event.findByIdAndUpdate(
      id,
      { ...req.body, t_id },
      { new: true }
    );
    if (!data) {
      return res.status(400).json({ message: "Event not Exist" });
    }
    res.status(200).json({
      message: "Update success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await event.findByIdAndDelete(id);
    if (!data) {
      return res.status(400).json({ message: "Event not Exist" });
    }
    res.status(200).json({
      message: "Delete success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
