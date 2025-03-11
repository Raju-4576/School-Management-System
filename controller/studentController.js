const student = require("../model/studentmodel");
const studentjoischema = require("../validation/studentValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.insertStudent = async (req, res) => {
  try {
    const { error } = studentjoischema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const data = await student.create({
      ...req.body,
      t_id: req.user.id,
      c_id: req.user.c_id,
    });
    res.status(201).json({ message: "student created success", data });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: `Email is already exists. Please enter another Email.`,
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.studentLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both email and password.",
      });
    }
    var data = await student.findOne({ email });
    if (!data) {
      return res.status(404).json({
        message: "invalid Email or password",
      });
    }

    // if (password !== data.password) {
    //   return res.status(404).json({
    //     message: "invalid Email or password",
    //   });
    // }
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    let token = jwt.sign({ role: data.role, id: data._id }, process.env.KEY);
    data.token = token;
    await data.save();
    res.status(200).json({
      message: "Login successful",
      user: data,
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllStudent = async (req, res) => {
  try {
    let data = await student
      .find()
      .populate("c_id", "class_stream fees -_id")
      .populate("t_id", "name -_id");
    if (!data) {
      return res.status(400).json({
        message: "Data Not Found",
      });
    }
    res.status(200).json({
      message: "Show all student success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server Error" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const { error } = studentjoischema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "Validation Error",
        errors: error.details.map((err) => err.message),
      });
    }

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }
    const data = await student.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) {
      return res.status(400).json({ message: "can not find your data" });
    }
    res.status(200).json({ message: "Update success", data });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: `Email is already exists. Please enter another Email.`,
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSingleStudent = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);

    let data = await student.findById(id);
    console.log(data);

    res.status(200).json({
      message: "Your data",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await student.findByIdAndDelete(id);
    res.status(200).json({
      message: "Data Deleted Success",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
