var express = require("express");
var router = express.Router();
const studentController = require("../controller/studentController");
const {
  isAdmin,
  isTeacherOrAdmin,
  isTeacherOrStudent,
  isTeacher,
} = require("../middleware/jwt");



router.post("/insertStudent/:c_id", isTeacherOrAdmin, studentController.insertStudent);
router.post("/loginStudent", studentController.studentLogin);
router.get("/getAllStudent", isTeacherOrAdmin, studentController.getAllStudent);
router.patch("/updateStudent/:id", isTeacherOrStudent, studentController.updateStudent);
router.get("/getStudent/:id", isTeacherOrStudent, studentController.getSingleStudent);
router.delete("/deleteStudent/:id", isTeacher, studentController.deleteStudent);


module.exports = router;
