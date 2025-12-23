const pool = require('../../../../config/database');
const bcrypt = require('bcrypt');

const loginController = {
  // Login hospital user
  loginHospital: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Check if hospital exists with this email
      const result = await pool.query(
        'SELECT * FROM hospitals WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const hospital = result.rows[0];

      // Compare password with hashed password
      const isPasswordValid = await bcrypt.compare(password, hospital.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Login successful - return hospital data (excluding password)
      const { password: _, ...hospitalData } = hospital;

      console.log('Login successful for:', hospitalData.email);
      console.log('Bed data being sent:', {
        icu_beds: hospitalData.icu_beds,
        hdu_beds: hospitalData.hdu_beds,
        general_beds: hospitalData.general_beds
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          id: hospitalData.id,
          hospital_name: hospitalData.hospital_name,
          email: hospitalData.email,
          contact: hospitalData.contact,
          hospital_address: hospitalData.hospital_address,
          icu_beds: hospitalData.icu_beds,
          hdu_beds: hospitalData.hdu_beds,
          general_beds: hospitalData.general_beds,
          created_at: hospitalData.created_at
        }
      });

    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = loginController;
