var express = require("express");
var router = express.Router();
const eventController = require("../controller/eventController");
const {
  isTeacherOrStudent,
  isTeacherOrAdmin,
} = require("../middleware/jwt");



router.post('/insertEvent',isTeacherOrAdmin,eventController.insertEvent);
router.get('/getAllEvent',isTeacherOrStudent,eventController.getAllEvent)
router.get('/getAllEventByDate',isTeacherOrStudent,eventController.getAllEventbyDate)
router.patch('/updateEvent/:id',isTeacherOrAdmin,eventController.updateEvent)
router.delete('/deleteEvent/:id',isTeacherOrAdmin,eventController.deleteEvent)

module.exports = router;
