const express = require("express");
const router = express.Router();
const admin = require("./../controller/Admin");
const multer = require("multer");
const auth = require("./../middleware/check-auth")
router.post("/signup", admin.Signup);
router.post("/createStudent", auth,admin.CreateStudent);
router.post("/createStaff", auth,admin.CreateStaffs);
router.get("/getStudents", auth, admin.getStudents);
router.get("/getStaffs", auth, admin.getStaffs);
router.delete("student/:id", auth, admin.deleteStudent);
module.exports = router;