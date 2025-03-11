const teacher = require("../model/teachermodel");
const teacherjoischema = require("../validation/teacherValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.insertTeacherData = async (req, res) => {
  try {
    const c_id = req.params.c_id;
    const { error } = teacherjoischema.validate(req.body, {
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
    req.body.c_id = c_id;
    let data = await teacher.create(req.body);
    res.status(201).json({
      status: "success",
      message: "Teacher created success",
      data,
    });
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

exports.teacherLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both email and password.",
      });
    }
    var data = await teacher.findOne({ email });
    if (!data) {
      return res.status(404).json({
        message: "invalid Email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    let token = jwt.sign(
      { role: data.role, id: data._id, c_id: data.c_id },
      process.env.KEY
    );
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

exports.getAllTeacher = async (req, res) => {
  try {
    console.log(req.user);

    var data = await teacher.find().populate("c_id");
    if (data.length === 0) {
      return res.status(404).json({
        message: "no record found in databse",
      });
    }

    res.status(200).json({
      message: "Find record successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "intenal server error" });
  }
};
exports.getSingleTeacher = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await teacher.findById(id);

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

exports.updateTeacher = async (req, res) => {
  try {
    let id = req.params.id;
    const { error } = classjoischema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "Validataion Error",
        errors: error.details.map((e) => e.message),
      });
    }
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashedPassword;
    }

    let data = await teacher.findByIdAndUpdate(id, req.body, { new: true });
    if (!data) {
      return res.status(400).json({
        message: "No Record Found",
      });
    }
    res.status(200).json({
      message: "Update Success",
      data,
    });
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: `${req.body.email} already exists. Please enter another Email.`,
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    let id = req.params.id;
    let data = await teacher.findByIdAndDelete(id);
    res.status(200).json({
      message: "Data Deleted Success",
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    if (username === "admin1" && password === "admin1") {
      let token = jwt.sign({ role: "Admin" }, process.env.KEY);

      return res.status(200).json({
        message: "Admin login successful",
        token: token,
      });
    }

    return res.status(401).json({ message: "Invalid username or password" });
  } catch (e) {
    console.error(e);

    return res.status(500).json({ message: "Internal server error" });
  }
};
