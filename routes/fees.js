var express = require("express");
var router = express.Router();
const feesController = require("../controller/feesController");
const {
  isAdmin,
  isTeacherOrStudent,
  isTeacher,
  isTeacherOrAdmin
} = require("../middleware/jwt");



router.post('/insertFees/:studentId',isAdmin,feesController.insertFees)
router.patch('/updateFees/:id',isAdmin,feesController.updateFees)
router.patch('/updateStatus',isAdmin,feesController.updateStatus)
router.get('/findStudentRecord/:studentId',isTeacherOrStudent,feesController.showFeesStudent)
router.delete('/deleteFees/:id',isAdmin,feesController.deleteFees)
router.get('/remainingFeesStudent',isAdmin,feesController.findRemainingFees)
router.get('/classWiseremainingFeesStudent',isTeacherOrAdmin,feesController.classWisefindRemainingFees)


module.exports = router;
