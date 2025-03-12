const fees = require("../model/feesModel");
const feesJoiSchema = require("../validation/feesvalidation");
exports.insertFees = async (req, res) => {
  try {
    let s_id = req.params.s_id;
    let c_id = req.params.c_id;
    let t_id = req.user.id;
    const { error } = feesJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((e) => e.message),
      });
    }
    const data = fees.create({ ...req.body, s_id, c_id, t_id });
    res.status(200).json({
      message: "Insert success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
