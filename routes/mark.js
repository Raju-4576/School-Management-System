var express = require("express");
var router = express.Router();
const marksController = require("../controller/marksController");
const {
  isTeacherOrStudent,
  isTeacherOrAdmin,
  isTeacher
} = require("../middleware/jwt");


router.post("/markInsert/:studentId",isTeacher, marksController.insertMarks);
router.patch("/markUpdate/:markId",isTeacher, marksController.markUpdate);
router.get("/getSingleMarks",isTeacherOrStudent, marksController.getSingleMarks);
router.delete("/deleteMarks/:id",isTeacher, marksController.deleteMarks);
router.get("/top3Student",isTeacherOrAdmin, marksController.findTop3ClassWise);
router.get("/top3AllClassStudent",isTeacherOrAdmin, marksController.findTop3AllClassWise);
router.get("/passOrFailCount",isTeacherOrAdmin, marksController.passOrFailStudent);
router.get("/passOrFailCountAllClass",isTeacherOrAdmin, marksController.allOverClssWisePassorFail);
router.get("/allOver",isTeacherOrAdmin, marksController.allOverPassorFail);

module.exports = router;
