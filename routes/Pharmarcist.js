const express = require("express");
const router = express.Router();
const pharm = require("./../controller/phamarcist");

router.get("/", pharm.getPrescriptions);
router.post("/sort", pharm.fulfillPrescription);
router.get("/fufilled", pharm.getCompletedPrescription);
router.get("/unfufilled/:id", pharm.unfulfillPrescription);
router.get("/:id", pharm.getSinglePrescription);

router.post("/signup", pharm.Signup)

module.exports = router; 