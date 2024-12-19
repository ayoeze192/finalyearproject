const express = require("express");
const router = express.Router();
const aut = require("../controller/user");
router.post("/login", aut.Login);

module.exports = router;
