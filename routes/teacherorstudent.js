var express = require("express");
var router = express.Router();
const teacherOrStudentController = require("../controller/teacherorstudentController");
const {
  isAdmin,
  isTeacherOrStudent,
  isTeacher
} = require("../middleware/jwt");



router.post('/insertTeacher/:classId',isAdmin,teacherOrStudentController.insertTeacherOrStudent);
router.post('/insertStudent/:teacherId',isAdmin,teacherOrStudentController.insertTeacherOrStudent);
router.post('/loginTeacher',teacherOrStudentController.loginTeacherOrStudent);
router.post('/loginStudent',teacherOrStudentController.loginTeacherOrStudent);
router.patch('/updateTeacherOrStudent/:id',isTeacherOrStudent,teacherOrStudentController.updateTeacherOrStudent);
router.patch('/updateTeacherforStudent/:id',isAdmin,teacherOrStudentController.updateTeacherofStudent);
router.get('/showAllTeacher',isAdmin,teacherOrStudentController.findAllTeacher);
router.get('/showAllStudent',isAdmin,teacherOrStudentController.findAllStudent);
router.get('/countClassStudent/:id',isTeacher,teacherOrStudentController.countClassStudent);

module.exports = router;
