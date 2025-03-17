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



router.use('/teacher',teacher)
router.use('/class',classes)
router.use('/',student)
router.use('/',mark)
router.use('/',attedance)
router.use('/',event)
router.use('/',fees)
router.use('/',admin)

module.exports = router;
