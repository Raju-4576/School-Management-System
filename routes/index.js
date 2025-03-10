var express = require("express");
var router = express.Router();
const teacherController = require("../controller/teachercontroller");
const marksController = require("../controller/marksController");
const classController = require("../controller/classController");
const { isTeacher, isAdmin } = require("../middleware/jwt");

/* GET home page. */
router.post("/insertTeacher/:c_id", isAdmin,teacherController.insertTeacherData);
router.post("/loginTeacher", teacherController.teacherLogin);
router.get("/getAllTeacher",isAdmin, teacherController.getAllTeacher);
router.get("/getTeacher/:id",isTeacher, teacherController.getSingleTeacher);
router.patch("/updateTeacher/:id",isTeacher, teacherController.updateTeacher);
router.delete("/deleteTeacher/:id",isAdmin, teacherController.deleteTeacher);

//class
router.post("/insertClass",isTeacher, classController.insertClass);
router.get("/getAllClass", isTeacher, classController.getAllClass);
router.patch("/updateClass/:id", isTeacher, classController.updateClass);
router.delete("/deleteClass/:id", isTeacher, classController.deleteClass);
// router.delete("/deleteClass/:id", classController.deleteClass);

//marks
router.post("/marksInsert", marksController.insertMarks);

router.post("/adminlogin", teacherController.adminLogin);

module.exports = router;
