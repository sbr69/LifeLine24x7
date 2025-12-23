const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// POST /api/login - Login hospital user
router.post('/', loginController.loginHospital);

module.exports = router;
