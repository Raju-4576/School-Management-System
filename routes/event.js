var express = require("express");
var router = express.Router();
const eventController = require("../controller/eventController");
const {
  isTeacherOrStudent,
  isTeacherOrAdmin,
  isAdmin,
  isTeacher,
} = require("../middleware/jwt");



router.post('/insertEvent',isAdmin,eventController.insertEvent);
router.get('/getAllEvent',isTeacherOrStudent,eventController.getAllEvent)
router.get('/getAllEventByDate',isTeacher,eventController.getAllEventbyDate)
router.patch('/updateEvent/:id',isAdmin,eventController.updateEvent)
router.delete('/deleteEvent/:id',isAdmin,eventController.deleteEvent)
router.get('/showAll',isAdmin,eventController.showAll)

module.exports = router;
