const express = require("express");
const router = express.Router();
const officerController = require("../controllers/officerController");
const officerDashboard= require('../controllers/officerDashboardController');
const requireOfficerSession = require('../middleware/requireOfficer');

router.post("/register/send-otp", officerController.sendOtpToOfficer);

router.post("/register", officerController.registerOfficer);

router.post("/login", officerController.loginOfficer);


router.get('/dashboard', requireOfficerSession, officerDashboard.getOfficerGrievances);

router.get('/grievance/:grievanceId', requireOfficerSession, officerDashboard.getGrievanceDetails);

router.get('/stats', requireOfficerSession, officerDashboard.getOfficerComplaintStats); 

module.exports = router;
