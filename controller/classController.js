const classes = require("../model/classmodel");
const classjoischema = require("../validation/classvalidation");

exports.insertClass = async (req, res) => {
  try {
    
    const { error } = classjoischema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "Validataion Error",
        errors: error.details.map((e) => e.message),
      });
    }
    const data = await classes.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Class detail inserted successfully",
      data,
    });
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: `Class '${req.body.c_name}' already exists. Please enter another class.`,
      });
    }

    if (e.name === "ValidationError") {
      const enumErrors = Object.values(e.errors).map((err) => err.message);
      return res.status(400).json({
        status: "error",
        message: "Validation Error",
        errors: enumErrors,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getAllClass = async (req, res) => {
  try {
    const data = await classes.find();
    if (!data || data.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No class records found in the database.",
      });
    }
    res.status(201).json({
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
    let { c_name } = req.body;
    let id = req.params.id;
    let existC_name = await classes.findOne({ c_name, _id: { $ne: id } });
    if (existC_name) {
      return res.status(400).json({
        message: "Class is already exist Please Enter another class",
      });
    }
    const data = await classes.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Class updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        status: "Validation Error",
        errors,
      });
    }
    res.status(500).json({
      meaasge: "Internal Server Error",
    });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    let id = req.params.id;
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
