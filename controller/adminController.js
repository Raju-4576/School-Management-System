const admin = require("../model/adminmodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  adminValidationSchema,
  adminLoginValidationSchema,
  adminUpdateJoiSchema,
} = require("../validation/adminValidation");
exports.insertAdminData = async (req, res) => {
  try {
    const { error } = adminValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error,
      });
    }
    const { password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existEmail = await admin.findOne({ email: email });
    if (existEmail) {
      return res
        .status(400)
        .json({ message: "Email Already Exist Enter another Email" });
    }
    const data = await admin.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(201).json({
      status: "success",
      message: "admin created success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { error } = adminLoginValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error,
      });
    }
    const { email, password } = req.body;
    const data = await admin.findOne({ email });
    if (!data) {
      return res.status(404).json({
        message: "invalid Email",
      });
    }
    const isMatch = await bcrypt.compare(password, data.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid  password.",
      });
    }

    const token = jwt.sign({ role: "Admin", id: data._id }, process.env.KEY);
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

exports.updateAdmin = async (req, res) => {
  try {
    const { error } = adminUpdateJoiSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        error: error,
      });
    }
    const { id } = req.params;
    const { password, email } = req.body;
    if (email) {
      const existEmail = await admin.findOne({ email, _id: { $ne: id } });
      if (existEmail) {
        return res
          .status(400)
          .json({ message: "Email already exists. Choose another email." });
      }
    }

    const updateData = { ...req.body };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const data = await admin.findByIdAndUpdate(id, updateData, { new: true });

    if (!data) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Admin updated successfully",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await admin.findByIdAndDelete(id);
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No record Exist" });
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
