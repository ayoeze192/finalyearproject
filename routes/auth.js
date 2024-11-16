const express = require("express");
const router = express.Router();
const aut = require("./../controller/User");
router.post("/login", aut.Login);

module.exports = router;
