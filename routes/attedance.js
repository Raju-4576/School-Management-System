var express = require("express");
var router = express.Router();
const attedanceController = require("../controller/attedanceController");
const {
  isTeacher,
  isTeacherOrAdmin,
  isTeacherOrStudent,
  isAdmin
} = require("../middleware/jwt");


router.post('/insertAtt/:studentId',isTeacher,attedanceController.insertAttendance)
router.patch('/updateAtt/:id',isTeacher,attedanceController.updateAttedance)
router.get('/getAll',isTeacher,attedanceController.showOwnStudentAttedance)
router.delete('/deleteAtt/:id',isTeacher,attedanceController.deleteAttedance)
router.get('/getSingleAtt/:studentId',isTeacherOrStudent,attedanceController.getSingleStudent)
router.get('/allOverAbsentPresnt',isAdmin,attedanceController.allOverAbsentPresent)
router.get('/mostAttendStudent',isAdmin,attedanceController.fullAttend)
router.get('/mostAttendStudentclassWise',isTeacher,attedanceController.fullAttendClassWise)
router.get('/countSchoolDays',isAdmin,attedanceController.totalSchoolDays)

module.exports = router;
