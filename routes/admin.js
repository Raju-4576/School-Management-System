var express = require("express");
var router = express.Router();
const adminController = require("../controller/adminController");

router.post("/insertAdmin", adminController.insertAdminData);
router.post("/adminlogin", adminController.adminLogin);
router.patch("/updateAdmin/:id", adminController.updateAdmin);
router.delete("/deleteAdmin/:id", adminController.deleteAdmin);
module.exports = router;
