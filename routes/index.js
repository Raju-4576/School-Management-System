var express = require("express");
var router = express.Router();
const teacherController = require("../controller/teachercontroller");
const marksController = require("../controller/marksController");
const classController = require("../controller/classController");
const studentController = require("../controller/studentController");
const attedanceController=require('../controller/attedanceController');
const eventController=require('../controller/eventController')
const feesController=require('../controller/feesController')
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
router.post('/insertAtt/:id',isTeacher,attedanceController.insertAttedance)
router.patch('/updateAtt/:id',isTeacher,attedanceController.updateAttedance)
router.get('/getAll',isTeacher,attedanceController.getAllAttedance)
router.delete('/deleteAtt/:id',isTeacher,attedanceController.deleteAttedance)
router.get('/getSingleAtt/:id',isTeacherOrStudent,attedanceController.getSingleStudent)
router.get('/dateSpecific',isTeacher,attedanceController.getAttedanceDatewise)

//Events
router.post('/insertEvent',isTeacher,eventController.insertEvent);
router.get('/getAllEvent',isTeacherOrStudent,eventController.getAllEvent)
router.get('/getAllEventByDate',isTeacherOrStudent,eventController.getAllEventbyDate)
router.patch('/updateEvent/:id',isTeacher,eventController.updateEvent)
router.delete('/deleteEvent/:id',isTeacher,eventController.deleteEvent)


//fees
router.post('/insertFees/:c_id/:s_id',feesController.insertFees)
//admin
router.post("/adminlogin", teacherController.adminLogin);

module.exports = router;
