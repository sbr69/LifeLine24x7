-- ============================================================================
-- AdmittedPatients Table Schema
-- ============================================================================
-- This table stores all admitted patient records with their demographics,
-- vitals, clinical information, and bed allocation details.
-- ============================================================================

CREATE TABLE IF NOT EXISTS admitted_patients (
    -- Primary Identifier
    patient_id INTEGER PRIMARY KEY CHECK (patient_id >= 10000 AND patient_id <= 99999),
    
    -- Patient Demographics
    patient_name VARCHAR(255) NOT NULL,
    age SMALLINT NOT NULL CHECK (age > 0 AND age <= 150),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'other')),
    
    -- Bed Allocation
    bed_id SMALLINT NOT NULL CHECK (bed_id >= 10 AND bed_id <= 999),
    
    -- Admission Date
    admission_date VARCHAR(20) NOT NULL, -- Format: "Dec 24, 2025"
    
    -- Current Vitals
    heart_rate SMALLINT CHECK (heart_rate > 0 AND heart_rate <= 300),
    spo2 SMALLINT CHECK (spo2 >= 0 AND spo2 <= 100),
    resp_rate SMALLINT CHECK (resp_rate > 0 AND resp_rate <= 100),
    temperature DECIMAL(4,1) CHECK (temperature >= 20.0 AND temperature <= 50.0),
    
    -- Blood Pressure (stored as JSONB for structured medical data)
    blood_pressure JSONB NOT NULL DEFAULT '{"systolic": null, "diastolic": null}'::jsonb,
    
    -- Vitals Measurement Timestamp
    measured_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Clinical Information
    presenting_ailment TEXT,
    medical_history TEXT,
    clinical_notes TEXT,
    lab_results TEXT,
    
    -- Severity Assessment
    severity_score SMALLINT NOT NULL DEFAULT 5 CHECK (severity_score >= 1 AND severity_score <= 10),
    condition VARCHAR(50) NOT NULL DEFAULT 'stable',
    
    -- Assigned Doctor
    doctor VARCHAR(100) NOT NULL DEFAULT 'Dr. Strange',
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Indexes for Performance Optimization
-- ============================================================================

-- Index on bed_id for quick bed allocation queries
CREATE INDEX IF NOT EXISTS idx_admitted_patients_bed_id 
ON admitted_patients(bed_id);

-- Index on admission_date for temporal queries
CREATE INDEX IF NOT EXISTS idx_admitted_patients_admission_date 
ON admitted_patients(admission_date);

-- Index on severity_score for filtering critical patients
CREATE INDEX IF NOT EXISTS idx_admitted_patients_severity 
ON admitted_patients(severity_score DESC);

-- Index on condition for status-based queries
CREATE INDEX IF NOT EXISTS idx_admitted_patients_condition 
ON admitted_patients(condition);

-- GIN index on blood_pressure JSONB for efficient queries
CREATE INDEX IF NOT EXISTS idx_admitted_patients_bp 
ON admitted_patients USING GIN (blood_pressure);

-- ============================================================================
-- Trigger for Automatic Updated_At Timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_admitted_patients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admitted_patients_updated_at
    BEFORE UPDATE ON admitted_patients
    FOR EACH ROW
    EXECUTE FUNCTION update_admitted_patients_updated_at();

-- ============================================================================
-- Sequence for Auto-generating 5-digit Patient IDs
-- ============================================================================

-- Create sequence starting from 10000 to ensure 5-digit IDs
CREATE SEQUENCE IF NOT EXISTS patient_id_seq
    START WITH 10000
    INCREMENT BY 1
    MINVALUE 10000
    MAXVALUE 99999
    CYCLE;

-- ============================================================================
-- Sequence for Auto-generating Bed IDs
-- ============================================================================

-- Create sequence for bed IDs (2-3 digit numbers)
CREATE SEQUENCE IF NOT EXISTS bed_id_seq
    START WITH 10
    INCREMENT BY 1
    MINVALUE 10
    MAXVALUE 999
    CYCLE;

-- ============================================================================
-- Comments for Documentation
-- ============================================================================

COMMENT ON TABLE admitted_patients IS 'Stores all admitted patient records with vitals and clinical information';
COMMENT ON COLUMN admitted_patients.patient_id IS 'Unique 5-digit identifier for each patient (10000-99999)';
COMMENT ON COLUMN admitted_patients.bed_id IS 'Assigned bed identifier (2-3 digit number)';
COMMENT ON COLUMN admitted_patients.blood_pressure IS 'Structured BP data stored as JSON: {"systolic": 120, "diastolic": 80}';
COMMENT ON COLUMN admitted_patients.severity_score IS 'Patient severity score (1-10, where 10 is most critical)';
COMMENT ON COLUMN admitted_patients.measured_time IS 'Timestamp when vitals were measured';
