const express = require('express');
const registerRoutes = require('./register/routes/registerRoutes');
const loginRoutes = require('./login/routes/loginRoutes');

const router = express.Router();

// Auth routes
router.use('/register', registerRoutes);
router.use('/login', loginRoutes);

module.exports = router;
