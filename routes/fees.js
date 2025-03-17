var express = require("express");
var router = express.Router();
const feesController = require("../controller/feesController");
const {
  isAdmin,
  isTeacherOrStudent
} = require("../middleware/jwt");



router.post('/insertFees/:s_id',isAdmin,feesController.insertFees)
router.patch('/updateFees/:id',isAdmin,feesController.updateFees)
router.patch('/updateStatus',isAdmin,feesController.updateStatus)
router.get('/findStudentRecord/:s_id',isTeacherOrStudent,feesController.showFeesStudent)
router.delete('/deleteFees/:id',isAdmin,feesController.deleteFees)
router.delete('/deleteStudentFees/:s_id',isAdmin,feesController.deleteFeesStudent)

module.exports = router;
