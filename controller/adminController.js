const admin = require("../model/adminmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.insertAdminData = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    let data = await admin.create(req.body);
    res.status(201).json({
      status: "success",
      message: "admin created success",
      data,
    });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: `Email  is exist ,please check Email.`,
      });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter both email and password.",
      });
    }
    var data = await admin.findOne({ email });
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
      { role: data.role, id: data._id},
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
