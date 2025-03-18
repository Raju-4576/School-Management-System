var express = require("express");
var router = express.Router();
const teacherOrStudentController = require("../controller/teacherorstudentController");
const {
  isAdmin,
  isTeacherOrStudent
} = require("../middleware/jwt");



router.post('/insertTeacher/:classId',isAdmin,teacherOrStudentController.insertTeacherOrStudent);
router.post('/insertStudent/:teacherId',teacherOrStudentController.insertTeacherOrStudent);

module.exports = router;
