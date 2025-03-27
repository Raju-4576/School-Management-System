const fees = require("../model/feesModel");
const {
  updateFeesSchema,
  feesJoiSchema,
  classNamevalidation,
} = require("../validation/feesvalidation");
const teacherOrStudent = require("../model/teacherOrStudentmodel");

exports.insertFees = async (req, res) => {
  try {
    const { error } = feesJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error,
      });
    }
    const { studentId } = req.params;
    const { id } = req.user;
    const { amt, paid_date, due_date } = req.body;
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 2);
    const studentData = await teacherOrStudent
      .findOne({ _id: studentId, role: "student" })
      .populate({
        path: "teacherId",
        model: "TeacherStudent",
        populate: { path: "classId" },
      });
    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }
    const total_fees = studentData?.teacherId?.classId?.fees;

    const studentFees = await fees.find({ studentId: studentId });

    const previous_paid_fees = studentFees.reduce((total, fee) => {
      return total + (fee.paid_fees?.amt || 0);
    }, 0);

    const paid_fees = Number(amt) || 0;
    const total_paid_fees = previous_paid_fees + paid_fees;

    if (total_paid_fees > total_fees) {
      return res.status(400).json({
        message: "Total paid fees cannot exceed total fees.",
        total_fees,
      });
    }

    const remain_fees = total_fees - total_paid_fees;

    let status = "";
    if (paid_fees > 0 && remain_fees > 0) status = "partial";
    else if (remain_fees === 0) status = "paid";

    const final_paid_date = paid_date ? new Date(paid_date) : today;
    const final_due_date = due_date ? new Date(due_date) : futureDate;

    if (final_paid_date >= final_due_date) {
      return res.status(400).json({
        message: "Due date must be a future date.",
      });
    }
    const data = await fees.create({
      ...req.body,
      studentId,
      adminId: id,
      total_paid_fees,
      total_fees,
      status,
      paid_fees: {
        amt: amt,
        paid_date: final_paid_date,
      },
      remain_fees: {
        remain_amt: remain_fees,
        due_date: final_due_date,
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
    const { error } = updateFeesSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error,
      });
    }
    const { id } = req.params;
    const { amt, paid_date, due_date } = req.body;

    const findData = await fees.findById(id);
    if (!findData) {
      return res.status(400).json({ message: "Data Not Found" });
    }
    const total_fees = findData.total_fees;
    const find_paid_fees = findData.total_paid_fees;
    const old_paid_fees = findData.paid_fees.amt;
    const new_amt = amt ? amt : old_paid_fees;
    const total_paid_fees = find_paid_fees + new_amt - old_paid_fees;

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
    else status = "partial";

    const updateFields = {
      status,
      "paid_fees.amt": new_amt,
      total_paid_fees,
      "remain_fees.remain_amt": remain_fees,
    };

    const final_paid_date = paid_date
      ? new Date(paid_date)
      : findData.paid_fees.paid_date;
    if (paid_date) {
      updateFields["paid_fees.paid_date"] = final_paid_date;
    }

    if (due_date) {
      const newDueDate = new Date(due_date);

      if (newDueDate <= new Date(final_paid_date)) {
        return res.status(400).json({
          message: "Due date must be after the paid date.",
        });
      }

      updateFields["remain_fees.due_date"] = newDueDate;
    }
    const data = await fees.findByIdAndUpdate(id, updateFields, { new: true });

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
    const today = new Date();
    const overdueRecords = await fees.find({
      status: { $nin: ["PAID", "OVERDUE"] },
      "remain_fees.due_date": { $lt: today },
    });
    if (overdueRecords.length > 0) {
      await fees.updateMany(
        { _id: { $in: overdueRecords.map((record) => record._id) } },
        { $set: { status: "overdue" } },
        { new: true }
      );
    }
    res.status(200).json({
      message: "Update successful",
      overdueRecords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteFees = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fees.findByIdAndDelete(id);
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "data not found" });
    }
    res.status(200).json({ message: "delete success", data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.showFeesStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ message: "Student Not Found" });
    }
    const data = await fees
      .find({ studentId })
      .sort({ "paid_fees.paid_date": -1 });

    if (data.length === 0 || !data) {
      res.status(404).json({ message: "No data found" });
    }
    console.log(data[0]);
    
    res.status(200).json({
      message: "Find success",
      total_fees: data[0]?.total_fees,
      total_paid_fees: data[0]?.total_paid_fees,
      yourStatus: data[0]?.status,
      total_remain_fees: data[0]?.remain_fees.remain_amt,
      installment: data.map((item) => ({
        Amount: item.paid_fees.amt,
        paid_date: item.paid_fees.paid_date.toISOString().slice(0, 10),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findRemainingFees = async (req, res) => {
  try {
    const partialPaidstudents = await fees.aggregate([
      {
        $sort: { "paid_fees.paid_date": -1 },
      },
      {
        $group: {
          _id: "$studentId",
          latestFeeRecord: { $first: "$$ROOT" },
        },
      },
      {
        $match: {
          "latestFeeRecord.status": { $in: ["PARTIAL", "OVERDUE"] },
        },
      },
      {
        $lookup: {
          from: "teacherstudents",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "teacherstudents",
          localField: "student.teacherId",
          foreignField: "_id",
          as: "teacher",
        },
      },
      { $unwind: "$teacher" },
      {
        $lookup: {
          from: "classes",
          localField: "teacher.classId",
          foreignField: "_id",
          as: "class",
        },
      },
      { $unwind: "$class" },
      {
        $project: {
          _id: 1,
          "latestFeeRecord.total_fees": 1,
          "latestFeeRecord.total_paid_fees": 1,
          "latestFeeRecord.remain_fees.remain_amt": 1,
          "student.name": 1,
          "teacher.name": 1,
          "class.className": 1,
        },
      },
    ]);

    if (partialPaidstudents.length === 0 || !partialPaidstudents) {
      return res
        .status(404)
        .json({ message: "No data Found for Partial paid Student" });
    }

    const completelyRemainFeesStudent = await teacherOrStudent
      .find({
        _id: { $nin: partialPaidstudents.map((s) => s._id) },
        role: "student",
      })
      .select("name -_id")
      .populate({
        path: "teacherId",
        select: "name -_id",
        populate: { path: "classId", select: "-_id className fees" },
      });

    if (
      completelyRemainFeesStudent.length === 0 ||
      !completelyRemainFeesStudent
    ) {
      return res
        .status(404)
        .json({ message: "No Any student for completely remain fees" });
    }
    const partialStudentList = partialPaidstudents.map((student) => ({
      studentName: student?.student?.name,
      className: student?.class?.className,
      teacherName: student?.teacher?.name,
      total_fees: student?.latestFeeRecord?.total_fees,
      total_paid_fees: student?.latestFeeRecord?.total_paid_fees,
      total_remain_amt: student?.latestFeeRecord?.remain_fees?.remain_amt,
    }));

    const completelyRemainFeesStudentList = completelyRemainFeesStudent.map(
      (student) => ({
        studentName: student?.name,
        teacherName: student?.teacherId?.name,
        className: student?.teacherId?.classId?.className,
        remain_fees: student?.teacherId?.classId?.fees,
      })
    );

    res.status(200).json({
      message: "success",
      partialStudentList,
      completelyRemainFeesStudentList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.classWisefindRemainingFees = async (req, res) => {
  try {
    const { error } = classNamevalidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error,
      });
    }
    const { className } = req.body;
    // const partialPaidstudents = await fees.aggregate([
    //   {
    //     $group: {
    //       _id: "$studentId",
    //       count: { $sum: 1 },
    //       latestFeeRecord: {
    //         $top: {
    //           output: ["$$ROOT"],
    //           sortBy: { "paid_fees.paid_date": -1 },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $match: {
    //       "latestFeeRecord.status": { $in: ["PARTIAL", "OVERDUE"] },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "teacherstudents",
    //       localField: "_id",
    //       foreignField: "_id",
    //       as: "student",
    //     },
    //   },
    //   { $unwind: "$student" },
    //   {
    //     $lookup: {
    //       from: "teacherstudents",
    //       localField: "student.teacherId",
    //       foreignField: "_id",
    //       as: "teacher",
    //     },
    //   },
    //   { $unwind: "$teacher" },
    //   {
    //     $lookup: {
    //       from: "classes",
    //       localField: "teacher.classId",
    //       foreignField: "_id",
    //       as: "class",
    //     },
    //   },
    //   { $unwind: "$class" },
    //   { $match: { "class.className": className } },
    //   {
    //     $project: {
    //       _id: 1,
    //       "latestFeeRecord.total_fees": 1,
    //       "latestFeeRecord.total_paid_fees": 1,
    //       "latestFeeRecord.remain_fees.remain_amt": 1,
    //       "student.name": 1,
    //       "teacher.name": 1,
    //       "class.className": 1,
    //     },
    //   },
    // ]);

    const partialPaidstudents = await fees.aggregate([
      {
        $group: {
          _id: "$studentId",
          lastField: { $last: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "teacherstudents",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "teacherstudents",
          localField: "student.teacherId",
          foreignField: "_id",
          as: "teacher"
        }
      },
      { $unwind: "$teacher" },
      {
        $lookup: {
          from: "classes",
          localField: "teacher.classId",
          foreignField: "_id",
          as: "class"
        }
      },
      { $unwind: "$class" },
      {
        $project: {
          _id: 0,
          studentName: "$student.name",
          teacherName: "$teacher.name",
          className: "$class.className",
          remain_fees: "$lastField.remain_fees.remain_amt"
        }
      },
      {
        $facet: {
          partialPaidStudents: [
            {
              $match: { remain_fees: { $gt: 0 } }
            }
          ]
        }
      }
    ]);
    
    // res.status(200).json({
    //   message: "success",
    //   partialPaidStudents: partialPaidstudents[0].partialPaidStudents || []
    // });
    
    // const completelyRemainFeesStudent = await teacherOrStudent
    //   .find({
    //     _id: { $nin: partialPaidstudents.map((s) => s._id) },
    //     role: "student",
    //     "teacherId.classId.className": className,
    //   })
    //   .select("name -_id")
    //   .populate({
    //     path: "teacherId",
    //     select: "name -_id",
    //     populate: {
    //       path: "classId",
    //       select: "-_id className fees",
    //     },
    //   });
    res.status(200).json({
      message: "success",
      partialPaidstudents,
      // completelyRemainFeesStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
