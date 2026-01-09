/**
 * Admission Service
 * Handles all API calls related to patient admissions
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

export interface AdmittedPatient {
  patient_id: number;
  patient_name: string;
  age: number;
  gender: string;
  bed_id: string; // Changed from number to string (format: "ICU-01", "HDU-05", "GEN-12")
  admission_date: string;
  heart_rate: number | null;
  spo2: number | null;
  resp_rate: number | null;
  temperature: number | null;
  blood_pressure: {
    systolic: number | null;
    diastolic: number | null;
  };
  measured_time: string;
  presenting_ailment: string | null;
  medical_history: string | null;
  clinical_notes: string | null;
  lab_results: string | null;
  severity_score: number;
  condition: string;
  doctor: string;
  created_at: string;
  updated_at: string;
}

export interface AdmissionResponse {
  success: boolean;
  message: string;
  data: AdmittedPatient;
}

export interface AllAdmissionsResponse {
  success: boolean;
  message: string;
  data: AdmittedPatient[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
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

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalPatients: number;
    criticalPatients: number;
    admittedToday: number;
    bedOccupancy: {
      icuOccupied: number;
      hduOccupied: number;
      generalOccupied: number;
    };
  };
}

/**
 * Create a new patient admission
 */
export const createAdmission = async (
  payload: AdmissionPayload
): Promise<AdmissionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admissions`, {
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
 * Get all admitted patients
 */
export const getAllAdmissions = async (params?: {
  condition?: string;
  minSeverity?: number;
  maxSeverity?: number;
  limit?: number;
  offset?: number;
}): Promise<AllAdmissionsResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.condition) queryParams.append('condition', params.condition);
    if (params?.minSeverity) queryParams.append('minSeverity', params.minSeverity.toString());
    if (params?.maxSeverity) queryParams.append('maxSeverity', params.maxSeverity.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_BASE_URL}/api/admissions${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(url);
    const result: AllAdmissionsResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch admissions');
    }

    return result;
  } catch (error) {
    console.error('Error fetching admissions:', error);
    throw error;
  }
};

/**
 * Get bed availability statistics
 */
export const getBedAvailability = async (): Promise<BedAvailabilityResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admissions/beds/availability`);
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

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStatsResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admissions/stats/dashboard`);
    const result: DashboardStatsResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch dashboard stats');
    }

    return result;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get a single patient by ID
 */
export const getPatientById = async (patientId: number): Promise<AdmissionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admissions/${patientId}`);
    const result: AdmissionResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch patient');
    }

    return result;
  } catch (error) {
    console.error('Error fetching patient:', error);
    throw error;
  }
};

/**
 * Update patient vitals
 */
export const updatePatientVitals = async (
  patientId: number,
  vitals: {
    heartRate?: number;
    spo2?: number;
    respRate?: number;
    temperature?: number;
    bpSystolic?: number;
    bpDiastolic?: number;
  }
): Promise<AdmissionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admissions/${patientId}/vitals`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vitals),
    });

    const result: AdmissionResponse = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update vitals');
    }

    return result;
  } catch (error) {
    console.error('Error updating vitals:', error);
    throw error;
  }
};

/**
 * Delete patient admission
 */
export const deleteAdmission = async (patientId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admissions/${patientId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete admission');
    }

    return result;
  } catch (error) {
    console.error('Error deleting admission:', error);
    throw error;
  }
};
