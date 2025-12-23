const express = require('express');
const router = express.Router();
const registerController = require('../controllers/registerController');

// POST /api/register - Register a new hospital
router.post('/', registerController.registerHospital);

// GET /api/register - Get all hospitals (for testing/admin)
router.get('/', registerController.getAllHospitals);

// GET /api/register/:id - Get hospital by ID
router.get('/:id', registerController.getHospitalById);

module.exports = router;
