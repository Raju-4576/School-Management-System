var express = require("express");
var router = express.Router();
const teacherController = require("../controller/teachercontroller");
const marksController = require("../controller/marksController");
const classController = require("../controller/classController");
const studentController = require("../controller/studentController");
const attedanceController=require('../controller/attedanceController');
const eventController=require('../controller/eventController')
const feesController=require('../controller/feesController')
const { isTeacher, isAdmin,isTeacherOrStudent,isTeacherOrAdmin } = require("../middleware/jwt");

/* GET home page. */
router.post(
  "/insertTeacher/:c_id",
  isAdmin,
  teacherController.insertTeacherData
);
router.post("/loginTeacher", teacherController.teacherLogin);
router.get("/getAllTeacher", isAdmin, teacherController.getAllTeacher);
router.get("/getTeacher/:id", isTeacherOrAdmin, teacherController.getSingleTeacher);
router.patch("/updateTeacher/:id", isTeacherOrAdmin, teacherController.updateTeacher);
router.delete("/deleteTeacher/:id", isAdmin, teacherController.deleteTeacher);

//class
router.post("/insertClass", isAdmin, classController.insertClass);
router.get("/getAllClass", isTeacherOrAdmin, classController.getAllClass);
router.patch("/updateClass/:id", isTeacherOrAdmin, classController.updateClass);
router.delete("/deleteClass/:id", isAdmin, classController.deleteClass);
router.get("/findClass", isAdmin, classController.findClass);
router.get("/findStreamwise", isAdmin, classController.streamWise);

//marks
router.post("/markInsert/:s_id",isTeacher, marksController.insertMarks);
router.get("/getAllMarks",isTeacherOrAdmin, marksController.getAllMarks);
router.patch("/markUpdate/:s_id",isTeacher, marksController.markUpdate);
router.get("/getSingleMarks",isTeacherOrStudent, marksController.getSingleMarks);
router.delete("/deleteMarks/:id",isTeacher, marksController.deleteMarks);

//student
router.post("/insertStudent/:c_id", isTeacherOrAdmin, studentController.insertStudent);
router.post("/loginStudent", studentController.studentLogin);
router.get("/getAllStudent", isTeacherOrAdmin, studentController.getAllStudent);
router.patch("/updateStudent/:id", isTeacherOrStudent, studentController.updateStudent);
router.get("/getStudent/:id", isTeacherOrStudent, studentController.getSingleStudent);
router.delete("/deleteStudent/:id", isTeacher, studentController.deleteStudent);

//attedance
router.post('/insertAtt/:id',isTeacher,attedanceController.insertAttedance)
router.patch('/updateAtt/:id',isTeacher,attedanceController.updateAttedance)
router.get('/getAll',isTeacherOrAdmin,attedanceController.getAllAttedance)
router.delete('/deleteAtt/:id',isTeacher,attedanceController.deleteAttedance)
router.get('/getSingleAtt/:id',isTeacherOrStudent,attedanceController.getSingleStudent)
router.get('/dateSpecific',isTeacher,attedanceController.getAttedanceDatewise)

//Events
router.post('/insertEvent',isTeacherOrAdmin,eventController.insertEvent);
router.get('/getAllEvent',isTeacherOrStudent,eventController.getAllEvent)
router.get('/getAllEventByDate',isTeacherOrStudent,eventController.getAllEventbyDate)
router.patch('/updateEvent/:id',isTeacherOrAdmin,eventController.updateEvent)
router.delete('/deleteEvent/:id',isTeacherOrAdmin,eventController.deleteEvent)


//fees
router.post('/insertFees/:s_id',isAdmin,feesController.insertFees)
router.patch('/updateFees/:id',isAdmin,feesController.updateFees)
router.patch('/updateStatus',isAdmin,feesController.updateStatus)
//admin
router.post("/adminlogin", teacherController.adminLogin);

module.exports = router;
