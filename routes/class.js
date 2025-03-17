var express = require("express");
var router = express.Router();
const classController = require("../controller/classController");
const {
  isAdmin,
  isTeacherOrAdmin,
} = require("../middleware/jwt");



router.post("/insertClass", isAdmin, classController.insertClass);
router.get("/getAllClass", isTeacherOrAdmin, classController.getAllClass);
router.patch("/updateClass/:id", isTeacherOrAdmin, classController.updateClass);
router.delete("/deleteClass/:id", isAdmin, classController.deleteClass);
router.get("/findClass", isAdmin, classController.findClass);
router.get("/findStreamwise", isAdmin, classController.streamWise);

module.exports = router;
