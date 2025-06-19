const express = require("express");
const router = express.Router();
const multer = require("multer");
const { submitComplaint , trackComplaint , getUserComplaints} = require('../controllers/complaintsController');
const requireSession = require('../middleware/requireSession');

const upload = multer({ dest: "uploads/" });

router.post("/submit", upload.array("attachments", 5), submitComplaint);

router.get("/userComplaints", requireSession, getUserComplaints);

router.get("/:grievanceId", trackComplaint);



module.exports = router;
