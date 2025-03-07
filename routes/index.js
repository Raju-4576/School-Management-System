var express = require('express');
var router = express.Router();
const teacherController=require('../controller/teachercontroller')

/* GET home page. */
router.post('/insertTeacher',teacherController.insertTeacherData);

module.exports = router;
