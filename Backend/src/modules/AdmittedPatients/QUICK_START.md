# 🚀 Quick Start Guide - AdmittedPatients Module

## For the Impatient Developer 😄

Want to test the new admission system RIGHT NOW? Follow these steps:

---

## ⚡ 3-Step Quick Start

### Step 1: Backend is Ready! ✅
Database is already initialized. Just start the server:

```bash
cd /home/sbr/Desktop/LifeLine/LifeLine24x7/Backend
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║  🏥 LifeLine24x7 Backend Server       ║
╠════════════════════════════════════════╣
║  Port: 5000                            ║
║  Environment: development              ║
║  Database: lifeline24x7                ║
╚════════════════════════════════════════╝
```

### Step 2: Test the API (Pick One)

**Option A: Using cURL (Terminal)**
```bash
# Create a new admission
curl -X POST http://localhost:5000/api/admissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "age": 35,
    "gender": "male",
    "heartRate": 80,
    "spo2": 98,
    "bpSystolic": 120,
    "bpDiastolic": 80
  }'
```

**Option B: Using Browser Console**
```javascript
// Open browser console (F12) and paste:
fetch('http://localhost:5000/api/admissions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Test Patient",
    age: 35,
    gender: "male",
    heartRate: 80,
    spo2: 98,
    bpSystolic: 120,
    bpDiastolic: 80
  })
})
.then(r => r.json())
.then(console.log);
```

**Option C: Using Postman/Insomnia**
- URL: `http://localhost:5000/api/admissions`
- Method: `POST`
- Body (JSON):
```json
{
  "name": "Test Patient",
  "age": 35,
  "gender": "male",
  "heartRate": 80,
  "spo2": 98,
  "bpSystolic": 120,
  "bpDiastolic": 80
}
```

### Step 3: Verify Success
You should get a response like:
```json
{
  "success": true,
  "message": "Patient admitted successfully",
  "data": {
    "patientId": 10000,
    "patientName": "Test Patient",
    "bedId": 10,
    "admissionDate": "Dec 24, 2025",
    "vitals": {
      "heartRate": 80,
      "spo2": 98,
      "bloodPressure": {
        "systolic": 120,
        "diastolic": 80
      }
    },
    "severityScore": 5,
    "condition": "stable",
    "doctor": "Dr. Strange"
  }
}
```

🎉 **IT WORKS!** Your backend is fully functional!

---

## 📱 Quick API Reference

### Create Admission
```bash
POST http://localhost:5000/api/admissions
```

### Get All Patients
```bash
GET http://localhost:5000/api/admissions
```

### Get Bed Availability
```bash
GET http://localhost:5000/api/admissions/beds/availability
```

### Get Patient by ID
```bash
GET http://localhost:5000/api/admissions/10000
```

---

## 🔗 Next: Connect Frontend

To connect your `NewAdmission.tsx` page:

### 1. Create API Service File

**File:** `Frontend/src/services/admissionService.ts`

```typescript
export const createAdmission = async (data) => {
  const response = await fetch('http://localhost:5000/api/admissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

### 2. Update NewAdmission.tsx

```typescript
import { createAdmission } from '../../services/admissionService';

const handleSaveAdmission = async () => {
  const result = await createAdmission({
    name: patientData.name,
    age: parseInt(patientData.age),
    gender: patientData.gender,
    heartRate: vitals.heartRate ? parseInt(vitals.heartRate) : undefined,
    spo2: vitals.spo2 ? parseInt(vitals.spo2) : undefined,
    bpSystolic: vitals.bpSystolic ? parseInt(vitals.bpSystolic) : undefined,
    bpDiastolic: vitals.bpDiastolic ? parseInt(vitals.bpDiastolic) : undefined,
    // ... other fields
  });
  
  if (result.success) {
    console.log('Patient admitted!', result.data);
    // Show success message or redirect
  }
};
```

### 3. Test Complete Flow
1. Start Backend: `cd Backend && npm start`
2. Start Frontend: `cd Frontend && npm run dev`
3. Navigate to New Admission page
4. Fill form and click Save
5. Check console for response! 🎉

---

## 📚 Need More Details?

- **Full Documentation:** `README.md`
- **API Testing Guide:** `API_TESTING.js`
- **Frontend Integration:** `FRONTEND_INTEGRATION.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`

---

## 🐛 Troubleshooting

### Server won't start?
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill process if needed
kill -9 <PID>
```

### Database error?
```bash
# Reinitialize database
cd Backend
node src/config/initDb.js
```

### CORS error?
- Backend already has CORS enabled for `http://localhost:5173`
- Make sure frontend runs on port 5173 (Vite default)

---

## ✅ What's Working

- ✅ Database table created
- ✅ API endpoints live
- ✅ Auto-generated IDs (patient & bed)
- ✅ Validation working
- ✅ Error handling in place
- ✅ Ready for frontend integration

---

## 🎯 Test Checklist

- [ ] Backend starts successfully
- [ ] Can create admission via API
- [ ] Can retrieve all admissions
- [ ] Can check bed availability
- [ ] Patient ID is 5 digits
- [ ] Bed ID is 2-3 digits
- [ ] Admission date is formatted correctly
- [ ] Blood pressure stored as JSON

---

**That's it! You're ready to go! 🚀**

For complete details, see the comprehensive documentation in the other files.
