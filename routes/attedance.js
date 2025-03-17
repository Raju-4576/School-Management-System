var express = require("express");
var router = express.Router();
const attedanceController = require("../controller/attedanceController");
const {
  isTeacher,
  isTeacherOrAdmin,
  isTeacherOrStudent
} = require("../middleware/jwt");


router.post('/insertAtt/:id',isTeacher,attedanceController.insertAttedance)
router.patch('/updateAtt/:id',isTeacher,attedanceController.updateAttedance)
router.get('/getAll',isTeacherOrAdmin,attedanceController.getAllAttedance)
router.delete('/deleteAtt/:id',isTeacher,attedanceController.deleteAttedance)
router.get('/getSingleAtt/:id',isTeacherOrStudent,attedanceController.getSingleStudent)
router.get('/dateSpecific',isTeacher,attedanceController.getAttedanceDatewise)

module.exports = router;
