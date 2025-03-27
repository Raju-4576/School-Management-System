const event = require("../model/eventmodel");
const classes = require("../model/classmodel");
const teacherOrStudent = require("../model/teacherOrStudentmodel");
const {
  eventJoiSchema,
  eventUpdateJoiSchema,
} = require("../validation/eventValidation");
exports.insertEvent = async (req, res) => {
  try {
    const { error } = eventJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error,
      });
    }
    const { className, from, to, eventDate } = req.body;
    const existingCount = await classes.find({
      className: { $in: className },
    });

    if (existingCount.length !== className.length) {
      return res.status(400).json({
        message:
          "One or more class names do not exist. Please enter valid class names.",
      });
    }

    const today = new Date();
    const eventDateObj = new Date(eventDate);

    if (eventDateObj <= today) {
      return res.status(400).json({
        message: "Event date must be in the future.",
      });
    }
    const data = await event.create({
      ...req.body,
      eventTime: {
        from: from,
        to: to,
      },
    });

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
    const { id: studentId } = req.user;

    const student = await teacherOrStudent.findById(studentId).populate({
      path: "teacherId",
      select: "classId",
      populate: {
        path: "classId",
        select: "className",
      },
    });
    const data = await event
      .find({ className: { $in: student?.teacherId?.classId?.className } })
      .select("-_id eventName eventPlace eventTime className eventDate")
      .sort({ date: 1 });

    if (!data || data.length === 0) {
      return res
        .status(400)
        .json({ message: "No events found for your class" });
    }

    res.status(200).json({
      message: "Find success",
      studentClassName: student?.teacherId?.classId?.className,
      data,
      student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllEventbyDate = async (req, res) => {
  try {
    const { eventDate } = req.body;

    const final_date = eventDate ? new Date(eventDate) : new Date();

    const startOfDay = new Date(final_date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(final_date);
    endOfDay.setHours(23, 59, 59, 999);

    const data = await event.find({
      eventDate: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No events found on this date" });
    }

    res.status(200).json({
      message: "Find success",
      data,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const parseTime = (timeString) => {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return (hours * 3600 + minutes * 60) * 1000; // Convert to milliseconds
};

exports.updateEvent = async (req, res) => {
  try {
    const { error } = eventUpdateJoiSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }
    const { from, to, eventDate, className } = req.body;
    const { id } = req.params;

    const findRecord = await event.findById(id);
    if (!findRecord) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updateData = { ...req.body };

    if ((from && !to) || (!from && to)) {
      return res
        .status(400)
        .json({ message: "Both 'from' and 'to' are required together." });
    }

    if (from && to) {
      const fromTime = parseTime(from);
      const toTime = parseTime(to);

      if (toTime <= fromTime) {
        return res
          .status(400)
          .json({ message: "'To' time must be later than 'From' time." });
      }

      updateData.eventTime = { from, to };
    }

    if (className) {
      const existingCount = await classes.find({
        className: { $in: className },
      });

      if (existingCount.length !== className.length) {
        return res.status(400).json({
          message:
            "One or more class names do not exist. Please enter valid class names.",
        });
      }

      updateData.className = className;
    }

    if (eventDate) {
      const today = new Date();
      const eventDateObj = new Date(eventDate);

      if (eventDateObj <= today) {
        return res.status(400).json({
          message: "Event date must be in the future.",
        });
      }

      updateData.eventDate = eventDate;
    }

    const data = await event.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "Update success",
      data,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
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

exports.showAll = async (req, res) => {
  try {
    const { page } = req.query;
    if(!page){
      return res.status(404).json({message:"Plese enter page in query for data"})
    }
    const data = await event.aggregate([
      { $skip: (page - 1) * 2 },
      { $limit: 2 },
      {
        $project: {
          eventName: 1,
          eventTime: 1,
          _id: 0,
          eventPlace: 1,
        },
      },
    ]);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "No events found" });
    }

    res.status(200).json({
      message: "Events retrieved successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
