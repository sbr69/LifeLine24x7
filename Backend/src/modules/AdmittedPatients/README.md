# AdmittedPatients Module

## Overview
The AdmittedPatients module is a comprehensive backend system for managing patient admissions in the LifeLine24x7 hospital management system. It handles patient demographics, vital signs, clinical information, and bed allocation using PostgreSQL.

---

## 📁 Module Structure

```
AdmittedPatients/
├── controllers/
│   └── admissionsController.js    # Business logic for admission operations
├── routes/
│   └── admissionsRoutes.js        # API route definitions
├── models/
│   ├── schema.sql                 # PostgreSQL database schema
│   └── initAdmittedPatientsDb.js  # Database initialization functions
├── index.js                       # Module entry point
└── README.md                      # This documentation
```

---

## 🗄️ Database Schema

### Table: `admitted_patients`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `patient_id` | INTEGER | PRIMARY KEY, 5-digit (10000-99999) | Unique patient identifier |
| `patient_name` | VARCHAR(255) | NOT NULL | Full name of the patient |
| `age` | SMALLINT | NOT NULL, 1-150 | Patient age |
| `gender` | VARCHAR(10) | NOT NULL, CHECK (male/female/other) | Patient gender |
| `bed_id` | SMALLINT | NOT NULL, 2-3 digits (10-999) | Assigned bed identifier |
| `admission_date` | VARCHAR(20) | NOT NULL | Date of admission (e.g., "Dec 24, 2025") |
| `heart_rate` | SMALLINT | 1-300 | Heart rate in BPM |
| `spo2` | SMALLINT | 0-100 | Oxygen saturation percentage |
| `resp_rate` | SMALLINT | 1-100 | Respiratory rate in BPM |
| `temperature` | DECIMAL(4,1) | 20.0-50.0 | Body temperature in Celsius |
| `blood_pressure` | JSONB | NOT NULL | Structured BP data: `{"systolic": 120, "diastolic": 80}` |
| `measured_time` | TIMESTAMP | NOT NULL | Timestamp when vitals were measured |
| `presenting_ailment` | TEXT | - | Chief complaint |
| `medical_history` | TEXT | - | Previous medical history |
| `clinical_notes` | TEXT | - | Doctor's observations |
| `lab_results` | TEXT | - | Laboratory findings summary |
| `severity_score` | SMALLINT | DEFAULT 5, 1-10 | Patient severity assessment |
| `condition` | VARCHAR(50) | DEFAULT 'stable' | Current patient condition |
| `doctor` | VARCHAR(100) | DEFAULT 'Dr. Strange' | Assigned physician |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |
| `updated_at` | TIMESTAMP | AUTO-UPDATE | Last update timestamp |

### Indexes
- `idx_admitted_patients_bed_id` - Bed allocation queries
- `idx_admitted_patients_admission_date` - Temporal queries
- `idx_admitted_patients_severity` - Critical patient filtering
- `idx_admitted_patients_condition` - Status-based queries
- `idx_admitted_patients_bp` - GIN index for JSONB blood pressure queries

### Auto-generated Fields
- **patient_id**: Generated using `patient_id_seq` sequence (5-digit unique IDs)
- **bed_id**: Generated using `bed_id_seq` sequence (sequential 2-3 digit IDs)
- **admission_date**: System date in "MMM DD, YYYY" format
- **measured_time**: Current timestamp when vitals are recorded
- **severity_score**: Default value of 5
- **condition**: Default value of "stable"
- **doctor**: Default value of "Dr. Strange"

---

## 🚀 API Endpoints

### 1. Create New Admission
**POST** `/api/admissions`

Create a new patient admission record.

**Request Body:**
```json
{
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
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Patient admitted successfully",
  "data": {
    "patientId": 10001,
    "patientName": "John Doe",
    "bedId": 10,
    "admissionDate": "Dec 24, 2025",
    "age": 45,
    "gender": "male",
    "vitals": {
      "heartRate": 95,
      "spo2": 96,
      "respRate": 18,
      "temperature": 37.2,
      "bloodPressure": {
        "systolic": 140,
        "diastolic": 90
      },
      "measuredTime": "2025-12-24T10:30:00.000Z"
    },
    "clinicalInfo": {
      "presentingAilment": "Severe Chest Pain",
      "medicalHistory": "Hypertension, Type 2 Diabetes",
      "clinicalNotes": "Patient complains of acute chest pain radiating to left arm",
      "labResults": "Troponin levels elevated"
    },
    "severityScore": 5,
    "condition": "stable",
    "doctor": "Dr. Strange",
    "createdAt": "2025-12-24T10:30:00.000Z"
  }
}
```

---

### 2. Get All Admissions
**GET** `/api/admissions`

Retrieve all admitted patients with optional filtering and pagination.

**Query Parameters:**
- `condition` (optional) - Filter by patient condition (e.g., "stable", "critical")
- `minSeverity` (optional) - Minimum severity score
- `maxSeverity` (optional) - Maximum severity score
- `limit` (optional, default: 100) - Results per page
- `offset` (optional, default: 0) - Pagination offset

**Example:** `/api/admissions?condition=stable&limit=10&offset=0`

**Response (200):**
```json
{
  "success": true,
  "message": "Admitted patients retrieved successfully",
  "data": [
    {
      "patient_id": 10001,
      "patient_name": "John Doe",
      "bed_id": 10,
      "age": 45,
      "gender": "male",
      "admission_date": "Dec 24, 2025",
      "heart_rate": 95,
      "spo2": 96,
      "resp_rate": 18,
      "temperature": 37.2,
      "blood_pressure": {
        "systolic": 140,
        "diastolic": 90
      },
      "measured_time": "2025-12-24T10:30:00.000Z",
      "severity_score": 5,
      "condition": "stable",
      "doctor": "Dr. Strange",
      "created_at": "2025-12-24T10:30:00.000Z",
      "updated_at": "2025-12-24T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 50,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 3. Get Patient by ID
**GET** `/api/admissions/:patientId`

Retrieve a single patient's admission details.

**Example:** `/api/admissions/10001`

**Response (200):**
```json
{
  "success": true,
  "message": "Patient details retrieved successfully",
  "data": {
    "patient_id": 10001,
    "patient_name": "John Doe",
    "bed_id": 10,
    "age": 45,
    "gender": "male",
    "admission_date": "Dec 24, 2025",
    "heart_rate": 95,
    "spo2": 96,
    "resp_rate": 18,
    "temperature": 37.2,
    "blood_pressure": {
      "systolic": 140,
      "diastolic": 90
    },
    "measured_time": "2025-12-24T10:30:00.000Z",
    "presenting_ailment": "Severe Chest Pain",
    "medical_history": "Hypertension, Type 2 Diabetes",
    "clinical_notes": "Patient complains of acute chest pain radiating to left arm",
    "lab_results": "Troponin levels elevated",
    "severity_score": 5,
    "condition": "stable",
    "doctor": "Dr. Strange",
    "created_at": "2025-12-24T10:30:00.000Z",
    "updated_at": "2025-12-24T10:30:00.000Z"
  }
}
```

---

### 4. Update Patient Vitals
**PATCH** `/api/admissions/:patientId/vitals`

Update vital signs for a patient.

**Request Body:**
```json
{
  "heartRate": 88,
  "spo2": 98,
  "respRate": 16,
  "temperature": 36.8,
  "bpSystolic": 135,
  "bpDiastolic": 85
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Vitals updated successfully",
  "data": {
    "patient_id": 10001,
    "heart_rate": 88,
    "spo2": 98,
    "resp_rate": 16,
    "temperature": 36.8,
    "blood_pressure": {
      "systolic": 135,
      "diastolic": 85
    },
    "measured_time": "2025-12-24T11:00:00.000Z",
    "updated_at": "2025-12-24T11:00:00.000Z"
  }
}
```

---

### 5. Get Bed Availability
**GET** `/api/admissions/beds/availability`

Get current bed occupation statistics.

**Response (200):**
```json
{
  "success": true,
  "message": "Bed availability retrieved successfully",
  "data": {
    "occupiedBeds": 25,
    "lowestBedId": 10,
    "highestBedId": 34,
    "availableBedRange": "10-999"
  }
}
```

---

### 6. Delete Patient Admission
**DELETE** `/api/admissions/:patientId`

Remove a patient admission record from the system.

**Response (200):**
```json
{
  "success": true,
  "message": "Patient admission record deleted successfully",
  "data": {
    "patientId": 10001,
    "patientName": "John Doe"
  }
}
```

---

## 🔧 Setup & Installation

### 1. Database Initialization

Run the database initialization script:

```bash
cd Backend
node src/config/initDb.js
```

This will:
- Create the `admitted_patients` table
- Set up all indexes and constraints
- Create sequences for auto-generation
- Initialize triggers for automatic timestamps

### 2. Environment Variables

Ensure your `.env` file includes PostgreSQL configuration:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lifeline24x7
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

### 3. Start the Server

```bash
npm start
```

The API will be available at `http://localhost:5000/api/admissions`

---

## 📋 Validation Rules

### Required Fields
- `name` - Patient name (string)
- `age` - Patient age (1-150)
- `gender` - One of: 'male', 'female', 'other'

### Optional Fields with Validation
- `heartRate` - 1-300 BPM
- `spo2` - 0-100%
- `respRate` - 1-100 BPM
- `temperature` - 20.0-50.0°C
- `bpSystolic` / `bpDiastolic` - Positive integers

---

## 🎯 Data Flow from Frontend

The module receives data from `NewAdmission.tsx`:

```typescript
// Frontend sends:
{
  name: patientData.name,
  age: patientData.age,
  gender: patientData.gender,
  presentingAilment: patientData.presentingAilment,
  medicalHistory: patientData.medicalHistory,
  clinicalNotes: patientData.clinicalNotes,
  labResults: patientData.labResults,
  heartRate: vitals.heartRate,
  spo2: vitals.spo2,
  respRate: vitals.respRate,
  temperature: vitals.temperature,
  bpSystolic: vitals.bpSystolic,
  bpDiastolic: vitals.bpDiastolic
}
```

**Backend automatically generates:**
- `patientId` (unique 5-digit ID)
- `bedId` (sequential 2-3 digit)
- `admissionDate` (current date formatted)
- `measuredTime` (current timestamp)
- `severityScore` (default: 5)
- `condition` (default: "stable")
- `doctor` (default: "Dr. Strange")

---

## 🧪 Testing the API

### Using cURL

**Create Admission:**
```bash
curl -X POST http://localhost:5000/api/admissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "age": 32,
    "gender": "female",
    "heartRate": 82,
    "spo2": 98,
    "bpSystolic": 120,
    "bpDiastolic": 80
  }'
```

**Get All Admissions:**
```bash
curl http://localhost:5000/api/admissions
```

**Get Specific Patient:**
```bash
curl http://localhost:5000/api/admissions/10001
```

---

## 🔐 Security Considerations

> **Note:** Currently, all endpoints are public. In production:
> - Add JWT authentication middleware
> - Implement role-based access control (RBAC)
> - Add rate limiting
> - Enable HTTPS only
> - Sanitize all user inputs
> - Implement audit logging

---

## 📊 Performance Optimization

- **Indexes** on frequently queried columns
- **JSONB** for flexible blood pressure data storage
- **Pagination** for large result sets
- **Connection pooling** via pg-pool
- **Prepared statements** to prevent SQL injection

---

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Notes

- Blood pressure is stored as JSONB for medical data integrity
- Patient IDs cycle after 99999 (configurable in sequence)
- All timestamps are in UTC
- Date format is user-friendly (e.g., "Dec 24, 2025")
- Vitals are optional during admission but can be updated later

---

## 🔄 Future Enhancements

- [ ] Real-time vitals monitoring via WebSocket
- [ ] Automatic severity score calculation based on vitals
- [ ] Bed allocation algorithm
- [ ] Integration with device APIs
- [ ] Patient discharge workflow
- [ ] Medical report generation
- [ ] Analytics and reporting dashboard

---

## 👥 Module Maintainer

LifeLine24x7 Development Team

For questions or issues, please refer to the main project documentation.
