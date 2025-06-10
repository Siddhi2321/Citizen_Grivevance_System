const express = require('express');
const router = express.Router();
const { submitComplaint , trackComplaint} = require('../controllers/complaintsController');

router.post('/submit', submitComplaint);

router.get("/:grievanceId", trackComplaint);

module.exports = router;
