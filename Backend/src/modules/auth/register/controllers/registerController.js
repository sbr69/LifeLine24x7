const pool = require('../../../../config/database');
const bcrypt = require('bcrypt');

const registerController = {
  // Register a new hospital
  registerHospital: async (req, res) => {
    const {
      hospitalName,
      email,
      contactNumber,
      address,
      icuBeds,
      hduBeds,
      generalBeds,
      password
    } = req.body;

    try {
      // Validate required fields
      if (!hospitalName || !email || !contactNumber || !address || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Validate bed counts
      if (!icuBeds || !hduBeds || !generalBeds) {
        return res.status(400).json({
          success: false,
          message: 'Bed counts are required'
        });
      }

      // Check if email already exists
      const existingHospital = await pool.query(
        'SELECT * FROM hospitals WHERE email = $1',
        [email]
      );

      if (existingHospital.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Hospital with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new hospital
      const result = await pool.query(
        `INSERT INTO hospitals 
        (hospital_name, email, contact, hospital_address, icu_beds, hdu_beds, general_beds, password) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING id, hospital_name, email, contact, hospital_address, icu_beds, hdu_beds, general_beds, created_at`,
        [
          hospitalName,
          email,
          parseInt(contactNumber),
          address,
          parseInt(icuBeds),
          parseInt(hduBeds),
          parseInt(generalBeds),
          hashedPassword
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Hospital registered successfully',
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error registering hospital:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get all hospitals (for testing/admin purposes)
  getAllHospitals: async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, hospital_name, email, contact, hospital_address, 
        icu_beds, hdu_beds, general_beds, created_at 
        FROM hospitals 
        ORDER BY created_at DESC`
      );

      res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });

    } catch (error) {
      console.error('Error fetching hospitals:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get hospital by ID
  getHospitalById: async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query(
        `SELECT id, hospital_name, email, contact, hospital_address, 
        icu_beds, hdu_beds, general_beds, created_at 
        FROM hospitals 
        WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Hospital not found'
        });
      }

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });

    } catch (error) {
      console.error('Error fetching hospital:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = registerController;
