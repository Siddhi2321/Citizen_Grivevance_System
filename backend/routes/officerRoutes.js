const express = require("express");
const router = express.Router();
const officerController = require("../controllers/officerController");


router.post("/register/send-otp", officerController.sendOtpToOfficer);

router.post("/register", officerController.registerOfficer);

router.post("/login", officerController.loginOfficer);

module.exports = router;
