const express = require("express");
const router = express.Router();
const multer = require("multer");
const { submitComplaint } = require("../controllers/complaintsController");

const upload = multer({ dest: "uploads/" });

router.post("/submit", upload.array("attachments", 5), submitComplaint);

module.exports = router;
