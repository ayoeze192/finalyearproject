const express = require("express");
const router = express.Router();
const doctor = require("../controller/doctors");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/doctors");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
// const filefilter = (req, file, cb) => {
//   if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
//     cb(null, false);
//   } else {
//     cb(null, true);
//   }
// };
 
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 5,
//   },
//   fileFilter: filefilter,
// });
router.get("/", doctor.getDoctors);
router.post("/signup", doctor.Signup);
router.get("/single-doctor", doctor.getSingleDoctor);

module.exports = router;
