/**
 * ============================================================================
 * Admitted Patients Routes
 * ============================================================================
 * Defines all API endpoints for patient admission management
 * ============================================================================
 */

const express = require('express');
const router = express.Router();
const admissionsController = require('../controllers/admissionsController');

/**
 * @route   POST /api/admissions
 * @desc    Create a new patient admission
 * @access  Public (should be protected with authentication in production)
 * @body    {
 *            name: string (required),
 *            age: number (required),
 *            gender: string (required) - 'male' | 'female' | 'other',
 *            presentingAilment: string (optional),
 *            medicalHistory: string (optional),
 *            clinicalNotes: string (optional),
 *            labResults: string (optional),
 *            heartRate: number (optional),
 *            spo2: number (optional),
 *            respRate: number (optional),
 *            temperature: number (optional),
 *            bpSystolic: number (optional),
 *            bpDiastolic: number (optional)
 *          }
 */
router.post('/', admissionsController.createAdmission);

/**
 * @route   GET /api/admissions
 * @desc    Get all admitted patients with optional filters
 * @access  Public (should be protected with authentication in production)
 * @query   {
 *            condition: string (optional) - filter by condition,
 *            minSeverity: number (optional) - minimum severity score,
 *            maxSeverity: number (optional) - maximum severity score,
 *            limit: number (optional, default: 100) - results per page,
 *            offset: number (optional, default: 0) - pagination offset
 *          }
 */
router.get('/', admissionsController.getAllAdmissions);

/**
 * @route   GET /api/admissions/beds/availability
 * @desc    Get bed availability statistics
 * @access  Public (should be protected with authentication in production)
 */
router.get('/beds/availability', admissionsController.getBedAvailability);

/**
 * @route   GET /api/admissions/stats/dashboard
 * @desc    Get dashboard statistics (total patients, critical patients, bed occupancy)
 * @access  Public (should be protected with authentication in production)
 */
router.get('/stats/dashboard', admissionsController.getDashboardStats);

/**
 * @route   GET /api/admissions/:patientId
 * @desc    Get a single patient admission by ID
 * @access  Public (should be protected with authentication in production)
 * @param   patientId - The unique patient identifier (5-digit number)
 */
router.get('/:patientId', admissionsController.getAdmissionById);

/**
 * @route   PATCH /api/admissions/:patientId/vitals
 * @desc    Update patient vitals
 * @access  Public (should be protected with authentication in production)
 * @param   patientId - The unique patient identifier
 * @body    {
 *            heartRate: number (optional),
 *            spo2: number (optional),
 *            respRate: number (optional),
 *            temperature: number (optional),
 *            bpSystolic: number (optional),
 *            bpDiastolic: number (optional)
 *          }
 */
router.patch('/:patientId/vitals', admissionsController.updateVitals);

/**
 * @route   DELETE /api/admissions/:patientId
 * @desc    Delete a patient admission record
 * @access  Public (should be protected with authentication in production)
 * @param   patientId - The unique patient identifier
 */
router.delete('/:patientId', admissionsController.deleteAdmission);

module.exports = router;
