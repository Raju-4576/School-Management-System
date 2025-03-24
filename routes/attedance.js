var express = require("express");
var router = express.Router();
const attedanceController = require("../controller/attedanceController");
const {
  isTeacher,
  isTeacherOrAdmin,
  isTeacherOrStudent,
  isAdmin
} = require("../middleware/jwt");


router.post('/insertAttedance/:studentId',isTeacher,attedanceController.insertAttendance)
router.patch('/updateAttedance/:id',isTeacher,attedanceController.updateAttedance)
router.get('/getAll',isTeacher,attedanceController.showOwnStudentAttedance)
router.delete('/deleteAttedance/:id',isTeacher,attedanceController.deleteAttedance)
router.get('/getSingleAttedance/:studentId',isTeacherOrStudent,attedanceController.showStudentAttedanceRecordByMonth)
router.get('/allOverAbsentPresnt',isAdmin,attedanceController.allOverAbsentPresent)
router.get('/mostAttendStudent',isAdmin,attedanceController.fullAttend)
router.get('/mostAttendStudentclassWise',isTeacher,attedanceController.fullAttendClassWise)
router.get('/countSchoolDays',isAdmin,attedanceController.totalSchoolDays)

module.exports = router;
