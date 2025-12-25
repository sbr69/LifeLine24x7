/**
 * ============================================================================
 * Admitted Patients Module
 * ============================================================================
 * Main entry point for the AdmittedPatients module
 * Exports routes and database initialization functions
 * ============================================================================
 */

const admissionsRoutes = require('./routes/admissionsRoutes');
const bedsRoutes = require('./routes/bedsRoutes');
const { initAdmittedPatientsDb, resetAdmittedPatientsDb } = require('./models/initAdmittedPatientsDb');

module.exports = {
  admissionsRoutes,
  bedsRoutes,
  initAdmittedPatientsDb,
  resetAdmittedPatientsDb
};
