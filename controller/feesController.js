const fees = require("../model/feesModel");
const feesJoiSchema = require("../validation/feesvalidation");
const student = require("../model/studentmodel");

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
    const studentFees = await fees.find({ s_id: s_id });

    const previous_paid_fees = studentFees.reduce((total, fee) => {
      return total + (fee.paid_fees?.amt || 0);
    }, 0);

    const paid_fees = Number(req.body.amt) || 0;
    const total_paid_fees = previous_paid_fees + paid_fees;
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
    const find_paid_fees = findData.total_paid_fees;
    const new_paid_fees = req.body.amt;
    const old_paid_fees = findData.paid_fees.amt;
   

    let total_paid_fees = find_paid_fees + new_paid_fees - old_paid_fees;
    if (total_paid_fees > total_fees) {
      return res.status(400).json({
        message: "Total paid fees cannot exceed total fees.",
        total_fees,
      });
    }
    const remain_fees = total_fees - total_paid_fees;

    let status = "";
    if (total_paid_fees === 0) status = "pending";
    else if (remain_fees === 0) status = "paid";
    else if (total_paid_fees > 0 && remain_fees > 0) status = "partial";

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
          amt: new_paid_fees,
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
        total_paid_fees,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Update success",
      data,
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

exports.deleteFees = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await fees.findByIdAndDelete(id);
    res.status(200).json({ message: "delete success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteFeesStudent = async (req, res) => {
  try {
    const s_id = req.params.s_id;
    const deletedRecords = await fees.find({ s_id: s_id });
    const data = await fees.deleteMany({ s_id: s_id });
    res.status(200).json({ message: "delete success", data, deletedRecords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.showFeesStudent = async (req, res) => {
  try {
    const s_id = req.params.s_id;

    const data = await fees
      .find({ s_id: s_id })
      .sort({ "paid_fees.paid_date": -1 });

    const lastRecord = data.length > 0 ? data[0] : null;

    res.status(200).json({
      message: "Find success",
      total_paid_fees: lastRecord ? lastRecord.total_paid_fees : 0,
      total_remain_fees: lastRecord ? lastRecord.remain_fees?.remain_amt : 0,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
