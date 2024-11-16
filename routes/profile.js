const express = require("express");
const router = express.Router();
const profile = require("./../controller/profile");

router.get("/:id", profile.getUserProfile);
router.put("/:id", profile.editUserProfile);


module.exports = router;
