const pool = require('./database');
const { initAdmittedPatientsDb } = require('../modules/AdmittedPatients');

const initDatabase = async () => {
  try {
    console.log('Starting database initialization...');

    // Create hospitals table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id SERIAL PRIMARY KEY,
        hospital_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        contact BIGINT NOT NULL,
        hospital_address TEXT NOT NULL,
        icu_beds INTEGER NOT NULL DEFAULT 0,
        hdu_beds INTEGER NOT NULL DEFAULT 0,
        general_beds INTEGER NOT NULL DEFAULT 0,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('✓ Table "hospitals" created successfully');

    // Create index on email for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_hospitals_email ON hospitals(email);
    `);

    // Initialize AdmittedPatients table
    await initAdmittedPatientsDb();

    console.log('✓ Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
