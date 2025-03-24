var express = require("express");
var router = express.Router();
const classes = require('./class')
const mark = require('./mark')
const event = require('./event')
const attedance = require('./attedance')
const fees = require('./fees')
const admin = require('./admin')
const teacherOrStudent = require('./teacherorstudent')



router.use('/class', classes)
router.use('/marks', mark)
router.use('/attedance', attedance)
router.use('/event', event)
router.use('/fees', fees)
router.use('/', admin)
router.use('/teacherOrStudent', teacherOrStudent)

module.exports = router;
