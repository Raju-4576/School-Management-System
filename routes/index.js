var express = require("express");
var router = express.Router();
const teacher=require('./teacher')
const classes=require('./class')
const student=require('./student')
const mark=require('./mark')
const event=require('./event')
const attedance=require('./attedance')
const fees=require('./fees')
const admin=require('./admin')
const teacherOrStudent=require('./teacherorstudent')



// router.use('/teacher',teacher)
router.use('/class',classes)
// router.use('/',student)
router.use('/marks',mark)
router.use('/attedance',attedance)
router.use('/',event)
router.use('/fees',fees)
router.use('/',admin)
router.use('/teacherOrStudent',teacherOrStudent)

module.exports = router;
