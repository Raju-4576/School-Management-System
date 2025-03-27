const classes = require("../model/classmodel");
const {
  classUpdateValidationSchema,
  classValidationSchema,
  streamValidation
} = require("../validation/classvalidation");

exports.insertClass = async (req, res) => {
  try {
    const { error } = classValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validataion Error",
        errors: error,
      });
    }
    const { className } = req.body;
    const existClass = await classes.findOne({ className });
    if (existClass) {
      return res
        .status(400)
        .json({ message: "Class is exist,Enter Another Class name" });
    }

    const data = await classes.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Class detail inserted successfully",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllClass = async (req, res) => {
  try {
    const {page} = req.query;
    const data = await classes.aggregate([
      { $skip: (page - 1) * 2 },
      { $limit: 2 },
      {
        $project: {
          className: 1,
          classStream: 1,
          _id: 0,
          fees: 1,
        },
      },
    ]);

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No class records found in the database.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "All Classes Details",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { error } = classUpdateValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validataion Error",
        errors: error,
      });
    }
    const { id } = req.params;
    const { className } = req.body;
    const existClass = await classes.findOne({ className });
    if (existClass) {
      return res
        .status(400)
        .json({ message: "Class is exist.Enter Another Class name" });
    }
    const data = await classes.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!data || data.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No class records found in the database.",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Class updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await classes.findByIdAndDelete(id);
    res.status(200).json({
      status: "Success",
      message: "Data Deleted Success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "internal servaer errror",
    });
  }
};
exports.streamWise = async (req, res) => {
  try {

    const { error } = streamValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        status: "Validataion Error",
        errors: error,
      });
    }
    const { classStream } = req.body;
    if (!classStream) {
      return res.status(400).json({
        message: "Please Enter class stream Which you want",
      });
    }
    const data = await classes
      .find({ classStream: classStream })
      .select("-_id className fees stream");
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No class records found in the database.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Filtered Class Details",
      total: data.length,
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.findClass = async (req, res) => {
  try {
    const { className, classStream } = req.body;
    if (!className) {
      return res.status(400).json({
        message: "Please Enter class Which you want",
      });
    }
    const filter = {
      className: new RegExp(`^${className}`, "i"),
    };
    if (classStream) {
      filter.classStream = classStream;
    }

    const data = await classes.find(filter).select("className classStream  fees -_id");
    if (!data || data.length === 0) {
      return res.status(404).json({
        message: "No class records found in the database.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Filtered Class Details",
      total: data.length,
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
