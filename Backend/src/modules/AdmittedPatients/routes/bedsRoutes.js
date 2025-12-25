/**
 * ============================================================================
 * Bed Management Routes
 * ============================================================================
 * Defines all routes for bed-related operations
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const bedsController = require('../controllers/bedsController');

/**
 * @route   GET /api/admissions/beds
 * @desc    Get all beds with their current status
 * @access  Private
 */
router.get('/', bedsController.getAllBeds);

/**
 * @route   GET /api/admissions/beds/stats
 * @desc    Get bed statistics (available/occupied by type)
 * @access  Private
 */
router.get('/stats', bedsController.getBedStats);

/**
 * @route   GET /api/admissions/beds/available/:bedType?
 * @desc    Get available beds (optionally filtered by type)
 * @access  Private
 * @param   {string} bedType - Optional: ICU, HDU, or GENERAL
 */
router.get('/available/:bedType?', bedsController.getAvailableBeds);

/**
 * @route   GET /api/admissions/beds/:bedId
 * @desc    Get bed by ID with patient details
 * @access  Private
 */
router.get('/:bedId', bedsController.getBedById);

/**
 * @route   POST /api/admissions/beds/assign
 * @desc    Assign a bed to a patient
 * @access  Private
 * @body    {bedId: string, patientId: number}
 */
router.post('/assign', bedsController.assignBed);

/**
 * @route   POST /api/admissions/beds/release
 * @desc    Release a bed (mark as available)
 * @access  Private
 * @body    {bedId: string}
 */
router.post('/release', bedsController.releaseBed);

module.exports = router;
