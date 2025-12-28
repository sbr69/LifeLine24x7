/**
 * ============================================================================
 * Admitted Patients Controller
 * ============================================================================
 * Handles all business logic for patient admission operations including:
 * - Creating new patient admissions
 * - Retrieving patient records
 * - Updating patient information
 * - Managing bed allocations
 * ============================================================================
 */

const pool = require('../../../config/database');

/**
 * Generate formatted admission date
 * @returns {string} Formatted date (e.g., "Dec 24, 2025")
 */
const getFormattedDate = () => {
  const date = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/**
 * Calculate severity score based on vital signs
 * @param {Object} vitals - Patient vital signs
 * @returns {number} Severity score (1-10)
 */
const calculateSeverityScore = (vitals) => {
  let score = 0;
  
  // Heart Rate scoring (normal: 60-100 bpm)
  if (vitals.heartRate) {
    if (vitals.heartRate < 40 || vitals.heartRate > 140) score += 3;
    else if (vitals.heartRate < 50 || vitals.heartRate > 120) score += 2;
    else if (vitals.heartRate < 60 || vitals.heartRate > 100) score += 1;
  }
  
  // SpO2 scoring (normal: >95%)
  if (vitals.spo2) {
    if (vitals.spo2 < 85) score += 3;
    else if (vitals.spo2 < 90) score += 2;
    else if (vitals.spo2 < 95) score += 1;
  }
  
  // Respiratory Rate scoring (normal: 12-20 bpm)
  if (vitals.respRate) {
    if (vitals.respRate < 8 || vitals.respRate > 30) score += 3;
    else if (vitals.respRate < 10 || vitals.respRate > 25) score += 2;
    else if (vitals.respRate < 12 || vitals.respRate > 20) score += 1;
  }
  
  // Temperature scoring (normal: 36.5-37.5°C)
  if (vitals.temperature) {
    if (vitals.temperature < 35 || vitals.temperature > 40) score += 3;
    else if (vitals.temperature < 36 || vitals.temperature > 39) score += 2;
    else if (vitals.temperature < 36.5 || vitals.temperature > 37.5) score += 1;
  }
  
  // Blood Pressure scoring (normal systolic: 90-140 mmHg)
  if (vitals.bpSystolic) {
    if (vitals.bpSystolic < 70 || vitals.bpSystolic > 180) score += 3;
    else if (vitals.bpSystolic < 80 || vitals.bpSystolic > 160) score += 2;
    else if (vitals.bpSystolic < 90 || vitals.bpSystolic > 140) score += 1;
  }
  
  // Ensure minimum score of 1 (database constraint) and cap at 10
  return Math.max(1, Math.min(score, 10));
};

/**
 * Determine patient condition based on severity score
 * @param {number} severityScore - Calculated severity score (0-10)
 * @returns {string} Condition status
 */
const determineCondition = (severityScore) => {
  if (severityScore >= 8) return 'critical';
  if (severityScore >= 5) return 'serious';
  if (severityScore >= 3) return 'stable';
  return 'recovering';
};

/**
 * Create a new patient admission
 * @route POST /api/admissions
 */
const createAdmission = async (req, res, next) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      name,
      age,
      gender,
      presentingAilment,
      medicalHistory,
      clinicalNotes,
      labResults,
      heartRate,
      spo2,
      respRate,
      temperature,
      bpSystolic,
      bpDiastolic
    } = req.body;

    // Validation
    if (!name || !age || !gender) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Patient name, age, and gender are required fields'
      });
    }

    // Validate gender
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(gender.toLowerCase())) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Gender must be one of: male, female, other'
      });
    }

    // Validate age
    if (age <= 0 || age > 150) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Age must be between 1 and 150'
      });
    }

    // Validate vitals if provided
    if (heartRate && (heartRate <= 0 || heartRate > 300)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Heart rate must be between 1 and 300 bpm'
      });
    }

    if (spo2 && (spo2 < 0 || spo2 > 100)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'SpO2 must be between 0 and 100%'
      });
    }

    if (respRate && (respRate <= 0 || respRate > 100)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Respiratory rate must be between 1 and 100 bpm'
      });
    }

    if (temperature && (temperature < 20.0 || temperature > 50.0)) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Temperature must be between 20.0 and 50.0°C'
      });
    }

    // Generate unique patient ID
    const patientIdResult = await client.query("SELECT nextval('patient_id_seq') as patient_id");
    const patientId = patientIdResult.rows[0].patient_id;

    // Calculate severity score first to determine bed type
    const vitals = { heartRate, spo2, respRate, temperature, bpSystolic };
    const severityScore = calculateSeverityScore(vitals);
    const condition = determineCondition(severityScore);

    // Determine bed type based on severity
    let bedType = 'GENERAL';
    if (severityScore >= 7 || condition === 'critical') bedType = 'ICU';
    else if (severityScore >= 4 || condition === 'serious') bedType = 'HDU';

    // Find an available bed of the required type (lock row)
    const bedResult = await client.query(
      'SELECT bed_id FROM beds WHERE bed_type = $1 AND is_available = TRUE ORDER BY bed_number LIMIT 1 FOR UPDATE',
      [bedType]
    );

    if (bedResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `No available ${bedType} beds. Please try a different bed type or discharge a patient.`
      });
    }

    const bedId = bedResult.rows[0].bed_id;

    // Get formatted admission date
    const admissionDate = getFormattedDate();

    // Prepare blood pressure data as structured JSON
    const bloodPressure = {
      systolic: bpSystolic ? parseInt(bpSystolic) : null,
      diastolic: bpDiastolic ? parseInt(bpDiastolic) : null
    };

    // Get current timestamp for measured_time
    const measuredTime = new Date();

    // Assign doctor based on severity
    const doctorList = ['Dr. Strange', 'Dr. House', 'Dr. Grey', 'Dr. Shepherd'];
    const doctor = doctorList[Math.floor(Math.random() * doctorList.length)];

    // Insert patient admission record
    const insertQuery = `
      INSERT INTO admitted_patients (
        patient_id,
        patient_name,
        age,
        gender,
        bed_id,
        admission_date,
        heart_rate,
        spo2,
        resp_rate,
        temperature,
        blood_pressure,
        measured_time,
        presenting_ailment,
        medical_history,
        clinical_notes,
        lab_results,
        severity_score,
        condition,
        doctor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `;

    const values = [
      patientId,
      name,
      age,
      gender.toLowerCase(),
      bedId,
      admissionDate,
      heartRate || null,
      spo2 || null,
      respRate || null,
      temperature || null,
      JSON.stringify(bloodPressure),
      measuredTime,
      presentingAilment || null,
      medicalHistory || null,
      clinicalNotes || null,
      labResults || null,
      severityScore,
      condition,
      doctor
    ];

    const result = await client.query(insertQuery, values);
    const admittedPatient = result.rows[0];

    // Mark bed as occupied
    await client.query(
      `UPDATE beds 
       SET is_available = FALSE, 
           current_patient_id = $1,
           last_occupied_at = CURRENT_TIMESTAMP
       WHERE bed_id = $2`,
      [patientId, bedId]
    );

    await client.query('COMMIT');

    console.log(`✅ New patient admitted: ${name} (ID: ${patientId}, Bed: ${bedId})`);

    // Return the full patient record with snake_case fields to match database schema
    res.status(201).json({
      success: true,
      message: 'Patient admitted successfully',
      data: admittedPatient
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating admission:', error.message);
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Get all admitted patients
 * @route GET /api/admissions
 */
const getAllAdmissions = async (req, res, next) => {
  try {
    const { condition, minSeverity, maxSeverity, limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM admitted_patients WHERE 1=1';
    const values = [];
    let paramCount = 1;

    // Filter by condition if provided
    if (condition) {
      query += ` AND condition = $${paramCount}`;
      values.push(condition);
      paramCount++;
    }

    // Filter by severity score range
    if (minSeverity) {
      query += ` AND severity_score >= $${paramCount}`;
      values.push(parseInt(minSeverity));
      paramCount++;
    }

    if (maxSeverity) {
      query += ` AND severity_score <= $${paramCount}`;
      values.push(parseInt(maxSeverity));
      paramCount++;
    }

    // Order by most recent admissions first
    query += ' ORDER BY created_at DESC';

    // Pagination
    query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, values);

    // Get total count for pagination
    const countQuery = 'SELECT COUNT(*) FROM admitted_patients WHERE 1=1' + 
                      (condition ? ' AND condition = $1' : '') +
                      (minSeverity ? ` AND severity_score >= $${condition ? 2 : 1}` : '') +
                      (maxSeverity ? ` AND severity_score <= $${condition && minSeverity ? 3 : condition || minSeverity ? 2 : 1}` : '');
    
    const countValues = [];
    if (condition) countValues.push(condition);
    if (minSeverity) countValues.push(parseInt(minSeverity));
    if (maxSeverity) countValues.push(parseInt(maxSeverity));

    const countResult = await pool.query(countQuery, countValues);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      success: true,
      message: 'Admitted patients retrieved successfully',
      data: result.rows,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + result.rows.length) < totalCount
      }
    });

  } catch (error) {
    console.error('❌ Error fetching admissions:', error.message);
    next(error);
  }
};

/**
 * Get a single patient by ID
 * @route GET /api/admissions/:patientId
 */
const getAdmissionById = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid patient ID is required'
      });
    }

    const query = 'SELECT * FROM admitted_patients WHERE patient_id = $1';
    const result = await pool.query(query, [parseInt(patientId)]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found`
      });
    }

    res.json({
      success: true,
      message: 'Patient details retrieved successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error fetching admission:', error.message);
    next(error);
  }
};

/**
 * Update patient vitals
 * @route PATCH /api/admissions/:patientId/vitals
 */
const updateVitals = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { heartRate, spo2, respRate, temperature, bpSystolic, bpDiastolic } = req.body;

    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid patient ID is required'
      });
    }

    // Prepare blood pressure data
    const bloodPressure = {
      systolic: bpSystolic ? parseInt(bpSystolic) : null,
      diastolic: bpDiastolic ? parseInt(bpDiastolic) : null
    };

    const measuredTime = new Date();

    const updateQuery = `
      UPDATE admitted_patients 
      SET heart_rate = COALESCE($1, heart_rate),
          spo2 = COALESCE($2, spo2),
          resp_rate = COALESCE($3, resp_rate),
          temperature = COALESCE($4, temperature),
          blood_pressure = COALESCE($5, blood_pressure),
          measured_time = $6
      WHERE patient_id = $7
      RETURNING *
    `;

    const values = [
      heartRate || null,
      spo2 || null,
      respRate || null,
      temperature || null,
      JSON.stringify(bloodPressure),
      measuredTime,
      parseInt(patientId)
    ];

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found`
      });
    }

    console.log(`✅ Vitals updated for patient ID: ${patientId}`);

    res.json({
      success: true,
      message: 'Vitals updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error updating vitals:', error.message);
    next(error);
  }
};

/**
 * Delete patient admission record
 * @route DELETE /api/admissions/:patientId
 */
const deleteAdmission = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    if (!patientId || isNaN(patientId)) {
      return res.status(400).json({
        success: false,
        message: 'Valid patient ID is required'
      });
    }

    const deleteQuery = 'DELETE FROM admitted_patients WHERE patient_id = $1 RETURNING patient_name';
    const result = await pool.query(deleteQuery, [parseInt(patientId)]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${patientId} not found`
      });
    }

    console.log(`✅ Patient admission deleted: ${result.rows[0].patient_name} (ID: ${patientId})`);

    res.json({
      success: true,
      message: 'Patient admission record deleted successfully',
      data: {
        patientId: parseInt(patientId),
        patientName: result.rows[0].patient_name
      }
    });

  } catch (error) {
    console.error('❌ Error deleting admission:', error.message);
    next(error);
  }
};

/**
 * Get bed availability statistics
 * @route GET /api/admissions/beds/availability
 */
const getBedAvailability = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as occupied_beds,
        MIN(bed_id) as lowest_bed,
        MAX(bed_id) as highest_bed
      FROM admitted_patients
    `;

    const result = await pool.query(query);
    const stats = result.rows[0];

    res.json({
      success: true,
      message: 'Bed availability retrieved successfully',
      data: {
        occupiedBeds: parseInt(stats.occupied_beds),
        lowestBedId: stats.lowest_bed,
        highestBedId: stats.highest_bed,
        availableBedRange: '10-999'
      }
    });

  } catch (error) {
    console.error('❌ Error fetching bed availability:', error.message);
    next(error);
  }
};

/**
 * Get dashboard statistics
 * @route GET /api/admissions/stats/dashboard
 */
const getDashboardStats = async (req, res, next) => {
  try {
    // Get total admitted patients count
    const totalQuery = 'SELECT COUNT(*) as total_patients FROM admitted_patients';
    const totalResult = await pool.query(totalQuery);
    const totalPatients = parseInt(totalResult.rows[0].total_patients);

    // Get critical patients count (severity_score >= 8)
    const criticalQuery = 'SELECT COUNT(*) as critical_count FROM admitted_patients WHERE severity_score >= 8';
    const criticalResult = await pool.query(criticalQuery);
    const criticalPatients = parseInt(criticalResult.rows[0].critical_count);

    // Get bed occupancy by ward type
    const bedOccupancyQuery = `
      SELECT 
        COUNT(CASE WHEN severity_score >= 8 THEN 1 END) as icu_occupied,
        COUNT(CASE WHEN severity_score >= 5 AND severity_score < 8 THEN 1 END) as hdu_occupied,
        COUNT(CASE WHEN severity_score < 5 THEN 1 END) as general_occupied
      FROM admitted_patients
    `;
    const bedOccupancyResult = await pool.query(bedOccupancyQuery);
    const bedOccupancy = bedOccupancyResult.rows[0];

    // Get patients admitted today
    const today = new Date();
    const todayStr = today.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const todayQuery = `
      SELECT COUNT(*) as admitted_today 
      FROM admitted_patients 
      WHERE admission_date = $1
    `;
    const todayResult = await pool.query(todayQuery, [todayStr]);
    const admittedToday = parseInt(todayResult.rows[0].admitted_today);

    res.json({
      success: true,
      message: 'Dashboard statistics retrieved successfully',
      data: {
        totalPatients,
        criticalPatients,
        admittedToday,
        bedOccupancy: {
          icuOccupied: parseInt(bedOccupancy.icu_occupied),
          hduOccupied: parseInt(bedOccupancy.hdu_occupied),
          generalOccupied: parseInt(bedOccupancy.general_occupied)
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error.message);
    next(error);
  }
};

module.exports = {
  createAdmission,
  getAllAdmissions,
  getAdmissionById,
  updateVitals,
  deleteAdmission,
  getBedAvailability,
  getDashboardStats
};
