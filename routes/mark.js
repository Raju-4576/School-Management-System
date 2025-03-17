var express = require("express");
var router = express.Router();
const marksController = require("../controller/marksController");
const {
  isTeacherOrStudent,
  isTeacherOrAdmin,
  isTeacher
} = require("../middleware/jwt");


router.post("/markInsert/:s_id",isTeacher, marksController.insertMarks);
router.get("/getAllMarks",isTeacherOrAdmin, marksController.getAllMarks);
router.patch("/markUpdate/:s_id",isTeacher, marksController.markUpdate);
router.get("/getSingleMarks",isTeacherOrStudent, marksController.getSingleMarks);
router.delete("/deleteMarks/:id",isTeacher, marksController.deleteMarks);

module.exports = router;
