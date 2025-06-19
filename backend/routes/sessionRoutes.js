const express = require('express');
const router = express.Router();
const { checkUserSession } = require('../controllers/sessionController');

router.get('/check-user-session', checkUserSession);

module.exports = router;