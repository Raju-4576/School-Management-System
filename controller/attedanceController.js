const attedance = require("../model/attendancemodel");
exports.insertAttedance = async (req, res) => {
  try {
    let t_id = req.user.id;
    let s_id = req.params.id;
    let today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");
    let data = await attedance.create({
      ...req.body,
      t_id: t_id,
      s_id: s_id,
      date: today,
    });
    res.status(201).json({
      message: "Success",
      data,
    });
    // console.log(today);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
