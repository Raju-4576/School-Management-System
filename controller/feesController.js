const fees = require("../model/feesModel");
const {
  updateFeesSchema,
  feesJoiSchema,
  statusValidation,
  statusAndClassValidation,
} = require("../validation/feesvalidation");
const teacherOrStudent = require("../model/teacherOrStudentmodel");

exports.insertFees = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { id } = req.user;
    const { amt, paid_date, due_date } = req.body;
    const { error } = feesJoiSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error,
      });
    }
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setMonth(today.getMonth() + 2);
    const studentData = await teacherOrStudent.findById(studentId).populate({
      path: "teacherId",
      model: "TeacherStudent",
      populate: { path: "classId" },
    });

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
    if (paid_fees === 0) status = "pending";
    else if (remain_fees === 0) status = "paid";
    else if (paid_fees > 0 && remain_fees > 0) status = "partial";

    const final_paid_date = paid_date ? new Date(paid_date) : today;
    const final_due_date = due_date ? new Date(due_date) : futureDate;

    if (final_paid_date.getTime() >= final_due_date.getTime()) {
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
    const { id } = req.params;
    const { amt, paid_date, due_date } = req.body;
    const { error } = updateFeesSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.details.map((e) => e.message),
      });
    }

    const findData = await fees.findById(id);
    if (!findData) {
      return res.status(400).json({ message: "Data Not Found" });
    }
    const stored_paid_date = findData.paid_fees.paid_date;
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

    const final_paid_date = paid_date ? new Date(paid_date) : stored_paid_date;
    if (paid_date) {
      updateFields["paid_fees.paid_date"] = final_paid_date;
    }

    if (due_date) {
      const newDueDate = new Date(due_date);

      if (
        final_paid_date &&
        newDueDate.getTime() <= new Date(final_paid_date).getTime()
      ) {
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
    const data = await fees
      .find({ studentId })
      .sort({ "paid_fees.paid_date": -1 });

    const lastRecord = data.length > 0 ? data[0] : null;

    res.status(200).json({
      message: "Find success",
      total_fees: lastRecord ? lastRecord.total_fees : 0,
      total_paid_fees: lastRecord ? lastRecord.total_paid_fees : 0,
      total_remain_fees: lastRecord ? lastRecord.remain_fees?.remain_amt : 0,
      Installment: data.map((item) => ({
        Amount: item.paid_fees.amt,
        paid_date: item.paid_fees.paid_date,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.findRemainingFees = async (req, res) => {
  try {
    const paid_fees_students = await fees.find().select("studentId -_id");

    if (!paid_fees_students || paid_fees_students.length === 0) {
      return res.status(400).json({ message: "Not found Any student" });
    }

    const paidStudentIds = [
      ...new Set(
        paid_fees_students.map((student) => student.studentId.toString())
      ),
    ];

    const unpaidStudents = await teacherOrStudent
      .find({ _id: { $nin: paidStudentIds } })
      .select("name -_id")
      .populate({
        path: "teacherId",
        select: "-_id name",
        populate: { path: "classId", select: "className -_id" },
      });

    res.status(200).json({ message: "success", unpaidStudents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.classWisefindRemainingFees = async (req, res) => {
  try {
    const { id } = req.user;
    const paid_fees_students = await fees.find().select("studentId -_id");

    if (!paid_fees_students || paid_fees_students.length === 0) {
      return res.status(400).json({ message: "Not found Any student" });
    }

    const paidStudentIds = [
      ...new Set(
        paid_fees_students.map((student) => student.studentId.toString())
      ),
    ];

    const unpaidStudents = await teacherOrStudent
      .find({ teacherId: id, _id: { $nin: paidStudentIds } })
      .select("name -_id")
      .populate({
        path: "teacherId",
        select: "-_id name",
        populate: { path: "classId", select: "className -_id" },
      });

    res.status(200).json({
      message: "success",
      totalStudent: unpaidStudents.length,
      className: unpaidStudents[0]?.teacherId?.classId?.className,
      INFO: unpaidStudents.map((item) => ({
        studentName: item?.name,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.statusWise = async (req, res) => {
  try {
    const { status } = req.body;

    const { error } = statusValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error,
      });
    }

    const data = await fees
      .find({ status })
      .select("-_id total_paid_fees remain_fees.remain_amt")
      .populate({
        path: "studentId",
        select: "name -_id ",
        model: "TeacherStudent",
        populate: {
          path: "teacherId",
          select: "name -_id",
          populate: {
            path: "classId",
            select: "className -_id",
          },
        },
      });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({
      message: "Success",
      student: data.map((student) => ({
        status: status,
        studentName: student?.studentId?.name,
        remainFees: student?.remain_fees?.remain_amt,
        total_paid_fees: student?.total_paid_fees,
        className: student?.studentId?.teacherId?.classId?.className,
        teacherName: student?.studentId?.teacherId?.name,
      })),
    });
  } catch (error) {
    console.error("Error in statusWise:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.filterByClassAndStatus = async (req, res) => {
  try {
    const { className, status } = req.body;

    const { error } = statusAndClassValidation.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error,
      });
    }

    const students = await fees.find({ status }).populate({
      path: "studentId",
      select: "name -_id",
      model: "TeacherStudent",
      populate: {
        path: "teacherId",
        select: "name -_id",
        model: "TeacherStudent",
        populate: {
          path: "classId",
          select: "className -_id",
        },
      },
    });

    const filteredStudents = students.filter(
      (student) =>
        student?.studentId?.teacherId?.classId?.className === className
    );

    if (filteredStudents.length === 0) {
      return res
        .status(404)
        .json({ message: "No students found for the given criteria" });
    }

    res.status(200).json({
      message: "Success",
      students: filteredStudents.map((student) => ({
        studentName: student.studentId.name,
        status: student.status,
        remainFees: student?.remain_fees?.remain_amt,
        totalPaidFees: student.total_paid_fees,
        teacherName: student?.studentId?.teacherId?.name,
      })),
    });
  } catch (error) {
    console.error("Error in filterByClassAndStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
