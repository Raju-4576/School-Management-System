var express = require("express");
var router = express.Router();
const teacherController = require("../controller/teachercontroller");
const {
  isAdmin,
  isTeacherOrAdmin,
} = require("../middleware/jwt");
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



module.exports = router;
