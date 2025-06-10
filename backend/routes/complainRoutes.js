const express = require('express');
const router = express.Router();
const { submitComplaint } = require('../controllers/complaintsController');

router.post('/submit', submitComplaint);

module.exports = router;
