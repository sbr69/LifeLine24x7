/**
 * ============================================================================
 * Admitted Patients Database Initialization
 * ============================================================================
 * This module initializes the admitted_patients table in PostgreSQL database.
 * It creates the table schema, indexes, triggers, and sequences required
 * for managing patient admission records.
 * ============================================================================
 */

const pool = require('../../../config/database');
const fs = require('fs');
const path = require('path');

/**
 * Initialize the admitted patients database schema
 * @returns {Promise<void>}
 */
const initAdmittedPatientsDb = async () => {
  try {
    console.log('🏥 Initializing Admitted Patients database...');

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Execute the schema creation
    await pool.query(schemaSql);

    console.log('✅ Admitted Patients database initialized successfully');
    console.log('   - Table: admitted_patients created');
    console.log('   - Indexes created for optimized queries');
    console.log('   - Sequences created for auto-generation');
    console.log('   - Triggers set up for automatic timestamps');

    // Verify table creation
    const result = await pool.query(`
      SELECT COUNT(*) as count 
      FROM information_schema.tables 
      WHERE table_name = 'admitted_patients'
    `);

    if (result.rows[0].count > 0) {
      console.log('✅ Table verification successful');
    }

  } catch (error) {
    console.error('❌ Error initializing Admitted Patients database:', error.message);
    throw error;
  }
};

/**
 * Drop the admitted patients table (use with caution)
 * @returns {Promise<void>}
 */
const dropAdmittedPatientsTable = async () => {
  try {
    console.log('⚠️  Dropping Admitted Patients table...');
    
    await pool.query('DROP TABLE IF EXISTS admitted_patients CASCADE');
    await pool.query('DROP SEQUENCE IF EXISTS patient_id_seq CASCADE');
    await pool.query('DROP SEQUENCE IF EXISTS bed_id_seq CASCADE');
    
    console.log('✅ Admitted Patients table dropped successfully');
  } catch (error) {
    console.error('❌ Error dropping Admitted Patients table:', error.message);
    throw error;
  }
};

/**
 * Reset the admitted patients table (drop and recreate)
 * @returns {Promise<void>}
 */
const resetAdmittedPatientsDb = async () => {
  try {
    await dropAdmittedPatientsTable();
    await initAdmittedPatientsDb();
    console.log('✅ Admitted Patients database reset successfully');
  } catch (error) {
    console.error('❌ Error resetting Admitted Patients database:', error.message);
    throw error;
  }
};

module.exports = {
  initAdmittedPatientsDb,
  dropAdmittedPatientsTable,
  resetAdmittedPatientsDb
};
