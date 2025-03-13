const fees = require("../model/feesModel");
const feesJoiSchema = require("../validation/feesvalidation");
const student = require("../model/studentmodel");
const mongoose = require("mongoose");
const storage = require("node-persist");
storage.init();
exports.insertFees = async (req, res) => {
  try {
    let today = new Date().toLocaleDateString("en-GB").replaceAll("/", "-");
    let futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 2);
    let dueDate = futureDate.toLocaleDateString("en-GB").replaceAll("/", "-");
    let s_id = req.params.s_id;
    let a_id = req.user.id;
    const studentData = await student.findById(s_id).populate("c_id");

    if (!studentData || !studentData.c_id) {
      return res.status(400).json({
        message: "Student Not Found",
      });
    }
    const fetch_total = await fees.aggregate([
      {
        $match: {
          s_id: new mongoose.Types.ObjectId(s_id),
        },
      },
      {
        $group: {
          _id: null,
          total_paid_fees: {
            $sum: "$paid_fees.amt",
          },
        },
      },
    ]);

    let previous_paid_fees =
      fetch_total.length > 0 ? fetch_total[0].total_paid_fees : 0;

    const paid_fees = req.body.amt;
    let total_paid_fees = previous_paid_fees + paid_fees;
    const total_fees = studentData.c_id.fees;
    if (total_paid_fees > total_fees) {
      return res.status(400).json({
        message: "Total paid fees cannot exceed total fees.",
        total_fees,
      });
    }
    const remain_fees = total_fees - total_paid_fees;

    let status = "";
    if (paid_fees === 0) status = "pending";
    else if (remain_fees === 0) status = "paid";
    else if (paid_fees > 0 && remain_fees > 0) status = "partial";

    const paidFeesDate = req.body?.paid_date
      ? new Date(
          req.body.paid_date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
        )
      : new Date();
    let remainFeesDueDate = req.body?.due_date
      ? new Date(
          req.body.due_date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
        )
      : futureDate;

    if (paidFeesDate >= remainFeesDueDate) {
      return res.status(400).json({
        message: "Due date Must be the Future date",
      });
    }

    const { error } = feesJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((e) => e.message),
      });
    }
    const data = await fees.create({
      ...req.body,
      s_id,
      a_id,
      total_paid_fees,
      total_fees,
      status,
      paid_fees: {
        amt: req.body.amt,
        paid_date: req.body?.paid_date || today,
      },
      remain_fees: {
        remain_amt: remain_fees,
        due_date: req.body?.due_date || dueDate,
      },
    });
    res.status(200).json({
      message: "Insert success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateFees = async (req, res) => {
  try {
    const id = req.params.id;
    const findData = await fees.findById(id);
    const total_fees = findData.total_fees;
    const paid_fees = req.body.amt;
    const remain_fees = total_fees - paid_fees;

    let status = "";
    if (paid_fees === 0) status = "pending";
    else if (remain_fees === 0) status = "paid";
    else if (paid_fees > 0 && remain_fees > 0) status = "partial";

    const paidFeesDate = req.body?.paid_date
      ? new Date(
          req.body.paid_date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
        )
      : new Date(
          findData.paid_fees.paid_date.replace(
            /(\d{2})-(\d{2})-(\d{4})/,
            "$3-$2-$1"
          )
        );
    let remainFeesDueDate = req.body?.due_date
      ? new Date(
          req.body.due_date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
        )
      : new Date(
          findData.remain_fees.due_date.replace(
            /(\d{2})-(\d{2})-(\d{4})/,
            "$3-$2-$1"
          )
        );

    if (paidFeesDate >= remainFeesDueDate) {
      return res.status(400).json({
        message: "Due date Must be the Future date",
      });
    }

    const { error } = feesJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((e) => e.message),
      });
    }
    const data = await fees.findByIdAndUpdate(
      id,
      {
        status,
        paid_fees: {
          amt: paid_fees,
          paid_date: req.body.paid_date
            ? req.body.paid_date
            : findData.paid_fees.paid_date,
        },
        remain_fees: {
          remain_amt: remain_fees,
          due_date: req.body.due_date
            ? req.body.due_date
            : findData.remain_fees.due_date,
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: "Update success",
      data,
      findata: findData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const data = await fees.find({ status: { $ne: "paid" } });
    const overdueRecords = [];
    const today = new Date();

    data.forEach((item) => {
      const dueDate = new Date(
        item.remain_fees.due_date.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1")
      );
      if (dueDate < today) {
        overdueRecords.push(item._id);
      }
    });
    await fees.updateMany(
      { _id: { $in: overdueRecords } },
      { $set: { status: "overdue" } }
    );
    res.status(200).json({
      message: "success",
      overdueRecords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
