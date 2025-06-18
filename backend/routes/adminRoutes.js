
const express = require('express');
const router = express.Router();
const { dashboardStats } = require('../controllers/adminController');

// const requireAdmin = require('../middleware/requireAdmin');
// router.get('/dashboard', requireAdmin, dashboardStats);

router.get('/dashboard', dashboardStats);

module.exports = router;