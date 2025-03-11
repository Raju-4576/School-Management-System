var express = require("express");
var router = express.Router();
const teacherController = require("../controller/teachercontroller");
const marksController = require("../controller/marksController");
const classController = require("../controller/classController");
const studentController = require("../controller/studentController");
const attedanceController=require('../controller/attedanceController')
const { isTeacher, isAdmin,isTeacherOrStudent } = require("../middleware/jwt");

/* GET home page. */
router.post(
  "/insertTeacher/:c_id",
  isAdmin,
  teacherController.insertTeacherData
);
router.post("/loginTeacher", teacherController.teacherLogin);
router.get("/getAllTeacher", isAdmin, teacherController.getAllTeacher);
router.get("/getTeacher/:id", isTeacher, teacherController.getSingleTeacher);
router.patch("/updateTeacher/:id", isTeacher, teacherController.updateTeacher);
router.delete("/deleteTeacher/:id", isAdmin, teacherController.deleteTeacher);

//class
router.post("/insertClass", isTeacher, classController.insertClass);
router.get("/getAllClass", isTeacher, classController.getAllClass);
router.patch("/updateClass/:id", isTeacher, classController.updateClass);
router.delete("/deleteClass/:id", isTeacher, classController.deleteClass);

//marks
router.post("/markInsert/:s_id",isTeacher, marksController.insertMarks);
router.get("/getAllMarks",isTeacher, marksController.getAllMarks);
router.patch("/markUpdate/:mark_id",isTeacher, marksController.markUpdate);
router.get("/getSingleMarks",isTeacherOrStudent, marksController.getSingleMarks);
router.delete("/deleteMarks/:id",isTeacher, marksController.deleteMarks);

//student
router.post("/insertStudent", isTeacher, studentController.insertStudent);
router.post("/loginStudent", studentController.studentLogin);
router.get("/getAllStudent", isTeacher, studentController.getAllStudent);
router.patch("/updateStudent/:id", isTeacherOrStudent, studentController.updateStudent);
router.get("/getStudent/:id", isTeacherOrStudent, studentController.getSingleStudent);
router.delete("/deleteStudent/:id", isTeacher, studentController.deleteStudent);

//attedance
router.post('/insertAtt/:id',attedanceController.insertAttedance)

//admin
router.post("/adminlogin", teacherController.adminLogin);

module.exports = router;
