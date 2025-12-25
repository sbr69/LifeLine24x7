/**
 * ============================================================================
 * Bed Management Controller
 * ============================================================================
 * Handles all bed-related operations including availability checks,
 * bed assignments, and bed status updates
 * ============================================================================
 */

const pool = require('../../../config/database');

/**
 * Get all beds with their current status
 * @route GET /api/admissions/beds
 */
const getAllBeds = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        b.bed_id,
        b.bed_type,
        b.bed_number,
        b.is_available,
        b.current_patient_id,
        b.last_occupied_at,
        ap.patient_name,
        ap.condition
      FROM beds b
      LEFT JOIN admitted_patients ap ON b.current_patient_id = ap.patient_id
      ORDER BY b.bed_type, b.bed_number
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get available beds by type
 * @route GET /api/admissions/beds/available/:bedType
 */
const getAvailableBeds = async (req, res, next) => {
  try {
    const { bedType } = req.params;
    
    // Validate bed type
    const validTypes = ['ICU', 'HDU', 'GENERAL'];
    if (bedType && !validTypes.includes(bedType.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid bed type. Must be one of: ${validTypes.join(', ')}`
      });
    }

    const query = bedType
      ? `SELECT * FROM beds WHERE bed_type = $1 AND is_available = TRUE ORDER BY bed_number`
      : `SELECT * FROM beds WHERE is_available = TRUE ORDER BY bed_type, bed_number`;

    const result = bedType
      ? await pool.query(query, [bedType.toUpperCase()])
      : await pool.query(query);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get bed statistics
 * @route GET /api/admissions/beds/stats
 */
const getBedStats = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        bed_type,
        COUNT(*) as total_beds,
        COUNT(*) FILTER (WHERE is_available = TRUE) as available_beds,
        COUNT(*) FILTER (WHERE is_available = FALSE) as occupied_beds
      FROM beds
      GROUP BY bed_type
      ORDER BY bed_type
    `);

    // Calculate totals
    const totals = result.rows.reduce(
      (acc, row) => ({
        total_beds: acc.total_beds + parseInt(row.total_beds),
        available_beds: acc.available_beds + parseInt(row.available_beds),
        occupied_beds: acc.occupied_beds + parseInt(row.occupied_beds)
      }),
      { total_beds: 0, available_beds: 0, occupied_beds: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        by_type: result.rows,
        totals: totals
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Assign a bed to a patient
 * @route POST /api/admissions/beds/assign
 */
const assignBed = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    const { bedId, patientId } = req.body;

    if (!bedId || !patientId) {
      return res.status(400).json({
        success: false,
        message: 'Both bedId and patientId are required'
      });
    }

    await client.query('BEGIN');

    // Check if bed exists and is available
    const bedCheck = await client.query(
      'SELECT * FROM beds WHERE bed_id = $1 FOR UPDATE',
      [bedId]
    );

    if (bedCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    if (!bedCheck.rows[0].is_available) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Bed is already occupied'
      });
    }

    // Check if patient exists
    const patientCheck = await client.query(
      'SELECT * FROM admitted_patients WHERE patient_id = $1',
      [patientId]
    );

    if (patientCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Update bed status
    await client.query(
      `UPDATE beds 
       SET is_available = FALSE, 
           current_patient_id = $1,
           last_occupied_at = CURRENT_TIMESTAMP
       WHERE bed_id = $2`,
      [patientId, bedId]
    );

    // Update patient's bed assignment
    await client.query(
      'UPDATE admitted_patients SET bed_id = $1 WHERE patient_id = $2',
      [bedId, patientId]
    );

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Bed assigned successfully',
      data: {
        bedId,
        patientId
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Release a bed (mark as available)
 * @route POST /api/admissions/beds/release
 */
const releaseBed = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    const { bedId } = req.body;

    if (!bedId) {
      return res.status(400).json({
        success: false,
        message: 'bedId is required'
      });
    }

    await client.query('BEGIN');

    // Get bed info
    const bedInfo = await client.query(
      'SELECT * FROM beds WHERE bed_id = $1 FOR UPDATE',
      [bedId]
    );

    if (bedInfo.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    const bed = bedInfo.rows[0];

    // Update bed status
    await client.query(
      `UPDATE beds 
       SET is_available = TRUE, 
           last_patient_id = $1,
           current_patient_id = NULL
       WHERE bed_id = $2`,
      [bed.current_patient_id, bedId]
    );

    await client.query('COMMIT');

    res.status(200).json({
      success: true,
      message: 'Bed released successfully',
      data: {
        bedId,
        previousPatientId: bed.current_patient_id
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Get bed by ID with patient details
 * @route GET /api/admissions/beds/:bedId
 */
const getBedById = async (req, res, next) => {
  try {
    const { bedId } = req.params;

    const result = await pool.query(
      `SELECT 
        b.*,
        ap.patient_name,
        ap.age,
        ap.gender,
        ap.condition,
        ap.admission_date,
        ap.doctor
      FROM beds b
      LEFT JOIN admitted_patients ap ON b.current_patient_id = ap.patient_id
      WHERE b.bed_id = $1`,
      [bedId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bed not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBeds,
  getAvailableBeds,
  getBedStats,
  assignBed,
  releaseBed,
  getBedById
};
