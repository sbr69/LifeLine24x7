# 🚀 Quick Test Guide - Patient Admission System

## Prerequisites Check ✅

- [ ] PostgreSQL running
- [ ] Backend server installed (`cd Backend && npm install`)
- [ ] Frontend installed (`cd Frontend && npm install`)
- [ ] Database initialized (`cd Backend && node src/config/initDb.js`)

---

## Start Services

### Terminal 1: Backend
```bash
cd /home/sbr/Desktop/LifeLine/LifeLine24x7/Backend
npm start
```
**Expected Output:**
```
╔════════════════════════════════════════╗
║  🏥 LifeLine24x7 Backend Server       ║
╠════════════════════════════════════════╣
║  Port: 5000                            ║
║  Environment: development              ║
║  Database: lifeline24x7                ║
╚════════════════════════════════════════╝
```

### Terminal 2: Frontend
```bash
cd /home/sbr/Desktop/LifeLine/LifeLine24x7/Frontend
npm run dev
```
**Expected Output:**
```
  VITE v... ready in ... ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Test Flow (5 Minutes)

### Step 1: Open Application
1. Open browser: `http://localhost:5173`
2. Login if needed
3. Navigate to Overview dashboard

### Step 2: Check Overview
- [ ] Dashboard loads successfully
- [ ] See "● Refreshing..." indicator briefly
- [ ] Patient table displays (empty or with data)
- [ ] "Refresh" and "New Admission" buttons visible

### Step 3: Create New Admission
1. Click **"New Admission"** button
2. Fill in form:
   ```
   Name: John Smith
   Age: 42
   Gender: Male (click radio button)
   
   Vitals (optional but recommended):
   Heart Rate: 78
   SpO2: 97
   Respiratory Rate: 16
   Temperature: 37.0
   BP Systolic: 120
   BP Diastolic: 80
   
   Clinical Info (optional):
   Presenting Ailment: Chest discomfort
   Medical History: Hypertension
   ```

3. Click **"Check Availability"**
   - [ ] Shows occupied beds count
   - [ ] Shows bed range (10-999)

4. Click **"Save Admission"**
   - [ ] Button changes to "⏳ Saving..."
   - [ ] Green success message appears
   - [ ] Shows Patient ID and Bed ID
   - [ ] Auto-redirects to Overview in 2 seconds

### Step 4: Verify in Overview
- [ ] New patient appears in table
- [ ] Check details:
  - ID format: `P-10000` (or next sequential)
  - Name: `John Smith`
  - Initials: `JS`
  - Bed ID: `GEN-10` (format based on severity)
  - Severity Score: `5`
  - Condition: `Stable`
  - Doctor: `Dr. Strange`
  - Admission Date: Today's date

### Step 5: Test Refresh
1. Click **"Refresh"** button
   - [ ] Shows "● Refreshing..." indicator
   - [ ] Patient data reloads
   - [ ] No data loss

---

## Expected Results

### ✅ Success Indicators:
- ✅ Form submits without errors
- ✅ Success message displays
- ✅ Redirect happens automatically
- ✅ Patient appears in Overview table
- ✅ All fields populated correctly
- ✅ No console errors

### Browser Console Should Show:
```javascript
Loading bed data from localStorage: {icuBeds: 10, ...}
Loaded admitted patients from database: [...]
Admission created: {patient_id: 10000, patient_name: "John Smith", ...}
```

### Network Tab Should Show:
```
POST http://localhost:5000/api/admissions → 201 Created
GET http://localhost:5000/api/admissions → 200 OK
GET http://localhost:5000/api/admissions/beds/availability → 200 OK
```

---

## Quick API Test (Optional)

### Test Backend Directly:
```bash
# Create admission
curl -X POST http://localhost:5000/api/admissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Patient",
    "age": 30,
    "gender": "female",
    "heartRate": 75,
    "spo2": 99
  }'

# Get all admissions
curl http://localhost:5000/api/admissions

# Get bed availability
curl http://localhost:5000/api/admissions/beds/availability
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Patient admitted successfully",
  "data": {
    "patientId": 10001,
    "patientName": "API Test Patient",
    "bedId": 11,
    ...
  }
}
```

---

## Troubleshooting Quick Fixes

### ❌ Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill if needed
kill -9 <PID>

# Restart
npm start
```

### ❌ Frontend shows "Failed to load"
```bash
# Check backend is running
curl http://localhost:5000

# Check .env file exists
cat Frontend/.env
# Should show: VITE_API_BASE_URL=http://localhost:5000
```

### ❌ CORS Error
- Verify frontend runs on `http://localhost:5173`
- Backend CORS is already configured for this

### ❌ Form submission fails
- Fill all required fields: Name, Age, Gender
- Check browser Network tab for error details
- Check backend terminal for error logs

---

## Data Verification

### Check Database Directly:
```bash
# Connect to PostgreSQL
psql -U your_username -d lifeline24x7

# Query patients
SELECT patient_id, patient_name, bed_id, severity_score, condition 
FROM admitted_patients 
ORDER BY created_at DESC;

# Should show your test patients
```

---

## Features to Test

### Core Features:
- [x] Create new admission
- [x] View all admitted patients
- [x] Check bed availability
- [x] Auto-refresh (wait 30 seconds)
- [x] Manual refresh
- [x] Form validation
- [x] Error handling
- [x] Success feedback

### Data Features:
- [x] Auto-generated Patient ID (5 digits)
- [x] Auto-generated Bed ID (2-3 digits)
- [x] Formatted admission date
- [x] Vitals stored correctly
- [x] Blood pressure as JSON
- [x] Default values (severity, condition, doctor)

---

## Expected Performance

- **Admission Creation:** < 500ms
- **Patient List Load:** < 1s
- **Refresh Operation:** < 500ms
- **Page Navigation:** Instant

---

## Success Criteria ✅

All these should work:
1. ✅ Backend starts without errors
2. ✅ Frontend starts without errors
3. ✅ Can create new admission
4. ✅ Patient appears in Overview
5. ✅ All data fields correct
6. ✅ No console errors
7. ✅ Refresh works
8. ✅ Navigation works

---

## Next Patient to Test

Try different scenarios:
- **High Severity:** Set heart rate to 150, temp to 39°C
- **Elderly Patient:** Age 85
- **Pediatric:** Age 5
- **Emergency:** Very high/low vitals
- **Minimal Data:** Only required fields

---

## Quick Status Check

```bash
# Check backend health
curl http://localhost:5000

# Count patients in database
curl http://localhost:5000/api/admissions | grep -o "patient_id" | wc -l

# Get latest patient
curl http://localhost:5000/api/admissions?limit=1
```

---

## Time Estimate

- First-time setup: **5 minutes**
- Create one admission: **1 minute**
- Verify in Overview: **30 seconds**
- **Total test time: < 10 minutes**

---

## 🎉 If Everything Works:

**Congratulations!** Your patient admission system is fully operational!

You now have:
- ✅ Working backend API
- ✅ Functional frontend UI
- ✅ Real-time data integration
- ✅ Complete admission workflow
- ✅ Production-ready foundation

**Next:** Add more patients and explore the system! 🏥

---

## Support

If issues occur:
1. Check both terminal outputs for errors
2. Check browser console (F12)
3. Verify database connection
4. Review: `/INTEGRATION_COMPLETE.md`
5. Check API docs: `/Backend/src/modules/AdmittedPatients/README.md`

**Happy Testing! 🚀**
