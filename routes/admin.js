var express = require("express");
var router = express.Router();
const adminController = require("../controller/adminController");

router.post("/adminInsert", adminController.insertAdminData);
router.post("/adminlogin", adminController.adminLogin);
module.exports = router;
