-- ============================================================================
-- Beds Table Schema
-- ============================================================================
-- This table stores all available beds in the hospital categorized by type
-- ICU, HDU, and General with proper naming convention
-- ============================================================================

CREATE TABLE IF NOT EXISTS beds (
    -- Primary Identifier
    bed_id VARCHAR(10) PRIMARY KEY, -- Format: ICU-01, HDU-01, GEN-01
    
    -- Bed Type
    bed_type VARCHAR(10) NOT NULL CHECK (bed_type IN ('ICU', 'HDU', 'GENERAL')),
    
    -- Bed Number (01 to 10)
    bed_number SMALLINT NOT NULL CHECK (bed_number >= 1 AND bed_number <= 10),
    
    -- Availability Status
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Current Patient ID (if occupied)
    current_patient_id INTEGER REFERENCES admitted_patients(patient_id) ON DELETE SET NULL,
    
    -- Last Occupied Information
    last_occupied_at TIMESTAMP,
    last_patient_id INTEGER,
    
    -- Audit Fields
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- Indexes for Performance Optimization
-- ============================================================================

-- Index on bed_type for filtering by ward type
CREATE INDEX IF NOT EXISTS idx_beds_bed_type 
ON beds(bed_type);

-- Index on is_available for quick availability queries
CREATE INDEX IF NOT EXISTS idx_beds_availability 
ON beds(is_available);

-- Composite index for finding available beds by type
CREATE INDEX IF NOT EXISTS idx_beds_type_availability 
ON beds(bed_type, is_available);

-- Index on current_patient_id for patient-bed lookup
CREATE INDEX IF NOT EXISTS idx_beds_current_patient 
ON beds(current_patient_id);

-- ============================================================================
-- Trigger for Automatic Updated_At Timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_beds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_beds_updated_at
    BEFORE UPDATE ON beds
    FOR EACH ROW
    EXECUTE FUNCTION update_beds_updated_at();

-- ============================================================================
-- Initialize Beds Data
-- ============================================================================

-- Insert ICU Beds (ICU-01 to ICU-10)
INSERT INTO beds (bed_id, bed_type, bed_number) VALUES
    ('ICU-01', 'ICU', 1),
    ('ICU-02', 'ICU', 2),
    ('ICU-03', 'ICU', 3),
    ('ICU-04', 'ICU', 4),
    ('ICU-05', 'ICU', 5),
    ('ICU-06', 'ICU', 6),
    ('ICU-07', 'ICU', 7),
    ('ICU-08', 'ICU', 8),
    ('ICU-09', 'ICU', 9),
    ('ICU-10', 'ICU', 10)
ON CONFLICT (bed_id) DO NOTHING;

-- Insert HDU Beds (HDU-01 to HDU-10)
INSERT INTO beds (bed_id, bed_type, bed_number) VALUES
    ('HDU-01', 'HDU', 1),
    ('HDU-02', 'HDU', 2),
    ('HDU-03', 'HDU', 3),
    ('HDU-04', 'HDU', 4),
    ('HDU-05', 'HDU', 5),
    ('HDU-06', 'HDU', 6),
    ('HDU-07', 'HDU', 7),
    ('HDU-08', 'HDU', 8),
    ('HDU-09', 'HDU', 9),
    ('HDU-10', 'HDU', 10)
ON CONFLICT (bed_id) DO NOTHING;

-- Insert General Beds (GEN-01 to GEN-10)
INSERT INTO beds (bed_id, bed_type, bed_number) VALUES
    ('GEN-01', 'GENERAL', 1),
    ('GEN-02', 'GENERAL', 2),
    ('GEN-03', 'GENERAL', 3),
    ('GEN-04', 'GENERAL', 4),
    ('GEN-05', 'GENERAL', 5),
    ('GEN-06', 'GENERAL', 6),
    ('GEN-07', 'GENERAL', 7),
    ('GEN-08', 'GENERAL', 8),
    ('GEN-09', 'GENERAL', 9),
    ('GEN-10', 'GENERAL', 10)
ON CONFLICT (bed_id) DO NOTHING;

-- ============================================================================
-- Verify Bed Counts
-- ============================================================================

-- This query shows the count of beds by type
-- Expected: 10 ICU, 10 HDU, 10 GENERAL
DO $$
DECLARE
    icu_count INTEGER;
    hdu_count INTEGER;
    general_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO icu_count FROM beds WHERE bed_type = 'ICU';
    SELECT COUNT(*) INTO hdu_count FROM beds WHERE bed_type = 'HDU';
    SELECT COUNT(*) INTO general_count FROM beds WHERE bed_type = 'GENERAL';
    
    RAISE NOTICE 'Beds initialized:';
    RAISE NOTICE '  ICU beds: %', icu_count;
    RAISE NOTICE '  HDU beds: %', hdu_count;
    RAISE NOTICE '  GENERAL beds: %', general_count;
    RAISE NOTICE '  Total beds: %', (icu_count + hdu_count + general_count);
END $$;
