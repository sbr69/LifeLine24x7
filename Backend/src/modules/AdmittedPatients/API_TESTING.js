/**
 * ============================================================================
 * AdmittedPatients API Testing Guide
 * ============================================================================
 * Quick test examples for testing the API endpoints
 * ============================================================================
 */

// BASE URL
const BASE_URL = 'http://localhost:5000/api/admissions';

// ============================================================================
// 1. CREATE NEW ADMISSION
// ============================================================================
/*
POST http://localhost:5000/api/admissions

Request Body:
*/
const newAdmission = {
  name: "John Doe",
  age: 45,
  gender: "male",
  presentingAilment: "Severe Chest Pain",
  medicalHistory: "Hypertension, Type 2 Diabetes",
  clinicalNotes: "Patient complains of acute chest pain radiating to left arm",
  labResults: "Troponin levels elevated",
  heartRate: 95,
  spo2: 96,
  respRate: 18,
  temperature: 37.2,
  bpSystolic: 140,
  bpDiastolic: 90
};

// cURL command:
/*
curl -X POST http://localhost:5000/api/admissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 45,
    "gender": "male",
    "presentingAilment": "Severe Chest Pain",
    "medicalHistory": "Hypertension, Type 2 Diabetes",
    "clinicalNotes": "Patient complains of acute chest pain radiating to left arm",
    "labResults": "Troponin levels elevated",
    "heartRate": 95,
    "spo2": 96,
    "respRate": 18,
    "temperature": 37.2,
    "bpSystolic": 140,
    "bpDiastolic": 90
  }'
*/

// ============================================================================
// 2. GET ALL ADMISSIONS
// ============================================================================
/*
GET http://localhost:5000/api/admissions

Optional Query Parameters:
- condition=stable
- minSeverity=1
- maxSeverity=10
- limit=10
- offset=0
*/

// cURL command:
/*
curl http://localhost:5000/api/admissions
curl "http://localhost:5000/api/admissions?condition=stable&limit=10"
*/

// ============================================================================
// 3. GET PATIENT BY ID
// ============================================================================
/*
GET http://localhost:5000/api/admissions/:patientId

Example: GET http://localhost:5000/api/admissions/10000
*/

// cURL command:
/*
curl http://localhost:5000/api/admissions/10000
*/

// ============================================================================
// 4. UPDATE PATIENT VITALS
// ============================================================================
/*
PATCH http://localhost:5000/api/admissions/:patientId/vitals

Request Body:
*/
const updateVitals = {
  heartRate: 88,
  spo2: 98,
  respRate: 16,
  temperature: 36.8,
  bpSystolic: 135,
  bpDiastolic: 85
};

// cURL command:
/*
curl -X PATCH http://localhost:5000/api/admissions/10000/vitals \
  -H "Content-Type: application/json" \
  -d '{
    "heartRate": 88,
    "spo2": 98,
    "respRate": 16,
    "temperature": 36.8,
    "bpSystolic": 135,
    "bpDiastolic": 85
  }'
*/

// ============================================================================
// 5. GET BED AVAILABILITY
// ============================================================================
/*
GET http://localhost:5000/api/admissions/beds/availability
*/

// cURL command:
/*
curl http://localhost:5000/api/admissions/beds/availability
*/

// ============================================================================
// 6. DELETE PATIENT ADMISSION
// ============================================================================
/*
DELETE http://localhost:5000/api/admissions/:patientId

Example: DELETE http://localhost:5000/api/admissions/10000
*/

// cURL command:
/*
curl -X DELETE http://localhost:5000/api/admissions/10000
*/

// ============================================================================
// FETCH API EXAMPLES (for Frontend Integration)
// ============================================================================

// Create new admission
async function createAdmission(patientData) {
  try {
    const response = await fetch('http://localhost:5000/api/admissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Patient admitted:', result.data);
      return result.data;
    } else {
      console.error('Error:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to create admission:', error);
    throw error;
  }
}

// Get all admissions
async function getAllAdmissions(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters);
    const url = `http://localhost:5000/api/admissions?${queryParams}`;
    
    const response = await fetch(url);
    const result = await response.json();
    
    if (result.success) {
      console.log('Admissions:', result.data);
      console.log('Pagination:', result.pagination);
      return result;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to fetch admissions:', error);
    throw error;
  }
}

// Get patient by ID
async function getPatientById(patientId) {
  try {
    const response = await fetch(`http://localhost:5000/api/admissions/${patientId}`);
    const result = await response.json();
    
    if (result.success) {
      console.log('Patient details:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to fetch patient:', error);
    throw error;
  }
}

// Update patient vitals
async function updatePatientVitals(patientId, vitals) {
  try {
    const response = await fetch(`http://localhost:5000/api/admissions/${patientId}/vitals`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vitals)
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Vitals updated:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to update vitals:', error);
    throw error;
  }
}

// Get bed availability
async function getBedAvailability() {
  try {
    const response = await fetch('http://localhost:5000/api/admissions/beds/availability');
    const result = await response.json();
    
    if (result.success) {
      console.log('Bed availability:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to fetch bed availability:', error);
    throw error;
  }
}

// Delete patient admission
async function deleteAdmission(patientId) {
  try {
    const response = await fetch(`http://localhost:5000/api/admissions/${patientId}`, {
      method: 'DELETE'
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('Admission deleted:', result.data);
      return result.data;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('Failed to delete admission:', error);
    throw error;
  }
}

// ============================================================================
// EXAMPLE USAGE
// ============================================================================

// Example: Create a new admission from NewAdmission.tsx form data
const exampleUsage = async () => {
  // Data from frontend form
  const patientData = {
    name: "Jane Smith",
    age: 32,
    gender: "female",
    presentingAilment: "Respiratory distress",
    medicalHistory: "Asthma",
    clinicalNotes: "Patient experiencing difficulty breathing",
    labResults: "Pending",
    heartRate: 110,
    spo2: 92,
    respRate: 24,
    temperature: 38.5,
    bpSystolic: 130,
    bpDiastolic: 85
  };

  try {
    // Create admission
    const admission = await createAdmission(patientData);
    console.log('New patient admitted with ID:', admission.patientId);

    // Get all patients
    const allPatients = await getAllAdmissions({ limit: 10, offset: 0 });
    console.log(`Total patients: ${allPatients.pagination.total}`);

    // Update vitals after some time
    const updatedVitals = {
      heartRate: 95,
      spo2: 95,
      respRate: 20,
      temperature: 37.8
    };
    await updatePatientVitals(admission.patientId, updatedVitals);

    // Check bed availability
    const bedStats = await getBedAvailability();
    console.log(`Occupied beds: ${bedStats.occupiedBeds}`);

  } catch (error) {
    console.error('Error:', error.message);
  }
};

// ============================================================================
// VALIDATION TEST CASES
// ============================================================================

// Test 1: Missing required fields
const testMissingFields = {
  age: 45,
  gender: "male"
  // Missing 'name' - should return 400 error
};

// Test 2: Invalid age
const testInvalidAge = {
  name: "Test Patient",
  age: 200,  // Invalid - should return 400 error
  gender: "male"
};

// Test 3: Invalid gender
const testInvalidGender = {
  name: "Test Patient",
  age: 30,
  gender: "unknown"  // Invalid - should return 400 error
};

// Test 4: Invalid vitals
const testInvalidVitals = {
  name: "Test Patient",
  age: 30,
  gender: "male",
  heartRate: 500  // Invalid - should return 400 error
};

// Test 5: Valid minimal admission
const testMinimalAdmission = {
  name: "Test Patient",
  age: 30,
  gender: "male"
  // Only required fields - should succeed
};

module.exports = {
  createAdmission,
  getAllAdmissions,
  getPatientById,
  updatePatientVitals,
  getBedAvailability,
  deleteAdmission
};
