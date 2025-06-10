const express = require("express");
const router = express.Router();
const multer = require("multer");
const { submitComplaint , trackComplaint} = require('../controllers/complaintsController');

const upload = multer({ dest: "uploads/" });

router.post("/submit", upload.array("attachments", 5), submitComplaint);

router.get("/:grievanceId", trackComplaint);

module.exports = router;
