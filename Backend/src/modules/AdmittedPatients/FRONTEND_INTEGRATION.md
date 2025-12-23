# Frontend Integration Guide

## Connecting NewAdmission.tsx to Backend API

This guide shows how to integrate the `NewAdmission.tsx` frontend component with the AdmittedPatients backend API.

---

## 🔗 API Configuration

### 1. Create API Configuration File

Create a new file: `Frontend/src/config/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  ADMISSIONS: `${API_BASE_URL}/api/admissions`,
  BED_AVAILABILITY: `${API_BASE_URL}/api/admissions/beds/availability`,
};

export default API_BASE_URL;
```

### 2. Create Environment Variables

Create/update `.env` file in Frontend directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📝 Create API Service

Create: `Frontend/src/services/admissionService.ts`

```typescript
import { API_ENDPOINTS } from '../config/api';

export interface AdmissionPayload {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  presentingAilment?: string;
  medicalHistory?: string;
  clinicalNotes?: string;
  labResults?: string;
  heartRate?: number;
  spo2?: number;
  respRate?: number;
  temperature?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
}

export interface AdmissionResponse {
  success: boolean;
  message: string;
  data: {
    patientId: number;
    patientName: string;
    bedId: number;
    admissionDate: string;
    age: number;
    gender: string;
    vitals: {
      heartRate: number | null;
      spo2: number | null;
      respRate: number | null;
      temperature: number | null;
      bloodPressure: {
        systolic: number | null;
        diastolic: number | null;
      };
      measuredTime: string;
    };
    clinicalInfo: {
      presentingAilment: string | null;
      medicalHistory: string | null;
      clinicalNotes: string | null;
      labResults: string | null;
    };
    severityScore: number;
    condition: string;
    doctor: string;
    createdAt: string;
  };
}

export interface BedAvailabilityResponse {
  success: boolean;
  message: string;
  data: {
    occupiedBeds: number;
    lowestBedId: number;
    highestBedId: number;
    availableBedRange: string;
  };
}

/**
 * Create a new patient admission
 */
export const createAdmission = async (
  payload: AdmissionPayload
): Promise<AdmissionResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.ADMISSIONS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result: AdmissionResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create admission');
    }

    return result;
  } catch (error) {
    console.error('Error creating admission:', error);
    throw error;
  }
};

/**
 * Get bed availability statistics
 */
export const getBedAvailability = async (): Promise<BedAvailabilityResponse> => {
  try {
    const response = await fetch(API_ENDPOINTS.BED_AVAILABILITY);

    const result: BedAvailabilityResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch bed availability');
    }

    return result;
  } catch (error) {
    console.error('Error fetching bed availability:', error);
    throw error;
  }
};
```

---

## 🔄 Update NewAdmission.tsx

Here's how to integrate the API calls into your component:

### 1. Add Import Statements

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdmission, getBedAvailability, type AdmissionPayload } from '../../services/admissionService';
```

### 2. Add Loading and Error States

```typescript
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [bedAvailability, setBedAvailability] = useState<{
  occupiedBeds: number;
  availableBedRange: string;
} | null>(null);
```

### 3. Update handleSaveAdmission Function

```typescript
const handleSaveAdmission = async () => {
  try {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Validate required fields
    if (!patientData.name || !patientData.age || !patientData.gender) {
      setError('Please fill in all required fields: Name, Age, and Gender');
      return;
    }

    // Prepare payload
    const payload: AdmissionPayload = {
      name: patientData.name,
      age: parseInt(patientData.age),
      gender: patientData.gender,
      presentingAilment: patientData.presentingAilment || undefined,
      medicalHistory: patientData.medicalHistory || undefined,
      clinicalNotes: patientData.clinicalNotes || undefined,
      labResults: patientData.labResults || undefined,
      heartRate: vitals.heartRate ? parseInt(vitals.heartRate) : undefined,
      spo2: vitals.spo2 ? parseInt(vitals.spo2) : undefined,
      respRate: vitals.respRate ? parseInt(vitals.respRate) : undefined,
      temperature: vitals.temperature ? parseFloat(vitals.temperature) : undefined,
      bpSystolic: vitals.bpSystolic ? parseInt(vitals.bpSystolic) : undefined,
      bpDiastolic: vitals.bpDiastolic ? parseInt(vitals.bpDiastolic) : undefined,
    };

    // Call API
    const result = await createAdmission(payload);

    if (result.success) {
      setSuccessMessage(
        `Patient admitted successfully! Patient ID: ${result.data.patientId}, Bed: ${result.data.bedId}`
      );
      
      console.log('Admission created:', result.data);

      // Optional: Reset form after successful submission
      setTimeout(() => {
        navigate('/overview');
      }, 2000);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create admission';
    setError(errorMessage);
    console.error('Error creating admission:', err);
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Update handleCheckAvailability Function

```typescript
const handleCheckAvailability = async () => {
  try {
    setIsLoading(true);
    setError(null);

    const result = await getBedAvailability();

    if (result.success) {
      setBedAvailability({
        occupiedBeds: result.data.occupiedBeds,
        availableBedRange: result.data.availableBedRange,
      });
      
      console.log('Bed availability:', result.data);
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch bed availability';
    setError(errorMessage);
    console.error('Error fetching bed availability:', err);
  } finally {
    setIsLoading(false);
  }
};
```

### 5. Add Success/Error Notification UI

Add this component after the page header:

```typescript
{/* Status Messages */}
{error && (
  <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
    <span className="material-symbols-outlined text-red-500">error</span>
    <div className="flex-1">
      <h3 className="text-red-500 font-bold mb-1">Error</h3>
      <p className="text-red-300 text-sm">{error}</p>
    </div>
    <button
      onClick={() => setError(null)}
      className="text-red-500 hover:text-red-400"
    >
      <span className="material-symbols-outlined">close</span>
    </button>
  </div>
)}

{successMessage && (
  <div className="bg-[#13ec13]/10 border border-[#13ec13]/50 rounded-xl p-4 flex items-start gap-3">
    <span className="material-symbols-outlined text-[#13ec13]">check_circle</span>
    <div className="flex-1">
      <h3 className="text-[#13ec13] font-bold mb-1">Success!</h3>
      <p className="text-gray-300 text-sm">{successMessage}</p>
    </div>
  </div>
)}
```

### 6. Update Save Button to Show Loading State

```typescript
<button
  onClick={handleSaveAdmission}
  disabled={isLoading}
  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-[#13ec13] hover:bg-[#3bf03b] text-green-950 text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 shadow-[0_0_30px_rgba(19,236,19,0.4),0_0_60px_rgba(19,236,19,0.2)] hover:shadow-[0_0_50px_rgba(19,236,19,0.7),0_0_100px_rgba(19,236,19,0.4)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
>
  {isLoading ? (
    <>
      <span className="animate-spin mr-2">⏳</span>
      <span className="truncate">Saving...</span>
    </>
  ) : (
    <span className="truncate">Save Admission</span>
  )}
</button>
```

### 7. Display Bed Availability

Update the bed allocation section to show fetched data:

```typescript
<div className="bg-[#13ec13]/10 border border-[#13ec13]/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(19,236,19,0.1)]">
  <h3 className="text-white text-lg font-bold mb-2">Bed Allocation</h3>
  <p className="text-gray-400 text-sm mb-4">
    Based on the vitals, the system will recommend a ward.
  </p>
  
  {bedAvailability && (
    <div className="mb-4 p-3 bg-[#1c271c] rounded-lg">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">Occupied Beds:</span>
        <span className="text-white font-bold">{bedAvailability.occupiedBeds}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Available Range:</span>
        <span className="text-white font-bold">{bedAvailability.availableBedRange}</span>
      </div>
    </div>
  )}
  
  <button
    onClick={handleCheckAvailability}
    disabled={isLoading}
    className="w-full flex items-center justify-center gap-2 rounded-xl h-12 bg-[#13ec13] text-green-950 text-base font-bold hover:bg-[#3bf03b] transition-all duration-300 shadow-[0_0_30px_rgba(19,236,19,0.4),0_0_60px_rgba(19,236,19,0.2)] hover:shadow-[0_0_50px_rgba(19,236,19,0.7),0_0_100px_rgba(19,236,19,0.4)] hover:scale-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <span className="material-symbols-outlined">bed</span>
    <span>{isLoading ? 'Checking...' : 'Check Availability'}</span>
  </button>
</div>
```

---

## 🧪 Testing the Integration

### 1. Start Backend Server

```bash
cd Backend
npm start
```

Should see: `🏥 LifeLine24x7 Backend Server running on Port: 5000`

### 2. Start Frontend Development Server

```bash
cd Frontend
npm run dev
```

### 3. Test the Flow

1. Navigate to `/new-admission` page
2. Fill in patient details:
   - Name: "John Doe"
   - Age: 45
   - Gender: Male
   - Add vitals (optional)
   - Add clinical notes (optional)
3. Click "Check Availability" to see bed stats
4. Click "Save Admission" to create the record
5. Check browser console for API responses
6. Verify success message appears
7. Should redirect to overview page after 2 seconds

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `Access to fetch at 'http://localhost:5000' has been blocked by CORS policy`

**Solution:** Backend already has CORS configured. Ensure server is running on port 5000.

### Issue 2: Network Error
**Error:** `Failed to fetch`

**Solution:** 
- Check if backend server is running
- Verify API_BASE_URL is correct
- Check browser console for exact error

### Issue 3: Validation Error
**Error:** `Patient name, age, and gender are required fields`

**Solution:** Ensure all required fields are filled before submission.

### Issue 4: Type Errors
**Solution:** Install types for vite env:
```bash
npm install --save-dev @types/node
```

---

## 📊 Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Patient admitted successfully",
  "data": {
    "patientId": 10001,
    "patientName": "John Doe",
    "bedId": 10,
    "admissionDate": "Dec 24, 2025",
    "vitals": {
      "heartRate": 95,
      "spo2": 96,
      "respRate": 18,
      "temperature": 37.2,
      "bloodPressure": {
        "systolic": 140,
        "diastolic": 90
      }
    },
    "severityScore": 5,
    "condition": "stable",
    "doctor": "Dr. Strange"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Patient name, age, and gender are required fields"
}
```

---

## 🔐 Production Considerations

Before deploying to production:

1. **Environment Variables**
   - Use different API URLs for dev/staging/production
   - Store in `.env.production` file

2. **Error Handling**
   - Implement retry logic for network failures
   - Add better user feedback for errors

3. **Security**
   - Add JWT authentication
   - Validate all inputs on frontend
   - Sanitize user inputs

4. **Loading States**
   - Add skeleton loaders
   - Disable form during submission
   - Prevent duplicate submissions

5. **User Experience**
   - Add form validation before API call
   - Show field-level error messages
   - Add confirmation dialogs

---

## 🎯 Next Steps

1. ✅ Backend API is ready
2. ✅ Database is initialized
3. ⏳ Integrate with frontend (follow this guide)
4. ⏳ Add authentication
5. ⏳ Add device integration for real-time vitals
6. ⏳ Implement severity score calculation

---

## 📞 Support

For issues or questions:
- Check Backend logs: `Backend/` terminal
- Check Frontend console: Browser DevTools
- Review API documentation: `Backend/src/modules/AdmittedPatients/README.md`
