import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdmission, getBedAvailability, getAllAdmissions, type AdmissionPayload } from '../../services/admissionService';
import { calculateSeverityScore as calculateSeverity } from './SeverityScore';

interface VitalsData {
  heartRate: string;
  spo2: string;
  respRate: string;
  temperature: string;
  bpSystolic: string;
  bpDiastolic: string;
}

interface PatientData {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  presentingAilment: string;
  medicalHistory: string;
  clinicalNotes: string;
  labResults: string;
}

const NewAdmission: React.FC = () => {
  const navigate = useNavigate();
  
  const [vitals, setVitals] = useState<VitalsData>({
    heartRate: '',
    spo2: '',
    respRate: '',
    temperature: '',
    bpSystolic: '',
    bpDiastolic: '',
  });

  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    gender: '',
    presentingAilment: '',
    medicalHistory: '',
    clinicalNotes: '',
    labResults: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [bedAvailability, setBedAvailability] = useState<{
    allocatedBed: string | null;
    severityScore: number;
    recommendedWard: string;
    status: 'available' | 'waiting' | 'shifted' | 'alert';
    message: string;
  } | null>(null);

  const handleVitalChange = (field: keyof VitalsData, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
  };

  const handlePatientDataChange = (field: keyof PatientData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }));
  };

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
          `Patient admitted successfully! Patient ID: ${result.data.patient_id}, Bed: ${result.data.bed_id}`
        );
        
        console.log('Admission created:', result.data);

        // Redirect to overview after 2 seconds
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

  const handleCancel = () => {
    navigate('/overview');
  };

  const handleConnectDevice = () => {
    console.log('Connecting device...');
    // Add device connection logic here
  };

  const handleCheckAvailability = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setBedAvailability(null);

      // Calculate severity score using the imported function
      const vitalSigns = {
        heartRate: vitals.heartRate ? parseInt(vitals.heartRate) : undefined,
        spo2: vitals.spo2 ? parseInt(vitals.spo2) : undefined,
        respRate: vitals.respRate ? parseInt(vitals.respRate) : undefined,
        temperature: vitals.temperature ? parseFloat(vitals.temperature) : undefined,
        bpSystolic: vitals.bpSystolic ? parseInt(vitals.bpSystolic) : undefined,
        bpDiastolic: vitals.bpDiastolic ? parseInt(vitals.bpDiastolic) : undefined,
      };
      
      const severityResult = calculateSeverity(vitalSigns);
      const severityScore = severityResult.score;
      
      // Fetch all admitted patients to get occupied beds
      const admissionsResult = await getAllAdmissions({ limit: 1000 });
      const occupiedBeds = new Set(admissionsResult.data.map(patient => patient.bed_id.toString()));
      
      // Get bed configuration from localStorage
      const icuBeds = parseInt(localStorage.getItem('icuBeds') || '0');
      const hduBeds = parseInt(localStorage.getItem('hduBeds') || '0');
      const generalBeds = parseInt(localStorage.getItem('generalBeds') || '0');

      // Find next available bed sequentially
      const findNextAvailableBed = (prefix: string, totalBeds: number): string | null => {
        for (let i = 1; i <= totalBeds; i++) {
          const bedId = `${prefix}-${i.toString().padStart(2, '0')}`;
          if (!occupiedBeds.has(bedId)) {
            return bedId;
          }
        }
        return null;
      };

      let allocatedBed: string | null = null;
      let status: 'available' | 'waiting' | 'shifted' | 'alert' = 'available';
      let message = '';
      let recommendedWard = '';

      // Bed allocation logic based on severity score
      if (severityScore >= 0 && severityScore <= 2) {
        // Low severity - General Ward
        recommendedWard = 'General';
        allocatedBed = findNextAvailableBed('GEN', generalBeds);
        
        if (!allocatedBed) {
          status = 'waiting';
          message = 'General bed not available. Patient will be placed in waiting list.';
        } else {
          message = `Patient will be admitted to General Ward (${allocatedBed}).`;
        }
      } else if (severityScore >= 3 && severityScore <= 4) {
        // Moderate severity - General Ward preferred, HDU as backup
        recommendedWard = 'General';
        allocatedBed = findNextAvailableBed('GEN', generalBeds);
        
        if (!allocatedBed) {
          // Try HDU
          allocatedBed = findNextAvailableBed('HDU', hduBeds);
          if (allocatedBed) {
            status = 'shifted';
            recommendedWard = 'HDU';
            message = `General bed not available. Patient shifted to HDU (${allocatedBed}).`;
          } else {
            status = 'waiting';
            message = 'No beds available in General Ward or HDU. Patient will be placed in waiting list.';
          }
        } else {
          message = `Patient will be admitted to General Ward (${allocatedBed}).`;
        }
      } else if (severityScore >= 5 && severityScore <= 7) {
        // High severity - HDU preferred, ICU or General as backup
        recommendedWard = 'HDU';
        allocatedBed = findNextAvailableBed('HDU', hduBeds);
        
        if (!allocatedBed) {
          // Try ICU
          allocatedBed = findNextAvailableBed('ICU', icuBeds);
          if (allocatedBed) {
            status = 'shifted';
            recommendedWard = 'ICU';
            message = `HDU not available. Patient shifted to ICU (${allocatedBed}).`;
          } else {
            // Try General
            allocatedBed = findNextAvailableBed('GEN', generalBeds);
            if (allocatedBed) {
              status = 'shifted';
              recommendedWard = 'General';
              message = `HDU and ICU not available. Patient shifted to General Ward (${allocatedBed}) with close monitoring.`;
            } else {
              status = 'alert';
              message = 'CRITICAL: No beds available in any ward. Immediate action required!';
            }
          }
        } else {
          message = `Patient will be admitted to HDU (${allocatedBed}).`;
        }
      } else if (severityScore >= 8 && severityScore <= 10) {
        // Critical severity - ICU required, HDU as backup
        recommendedWard = 'ICU';
        allocatedBed = findNextAvailableBed('ICU', icuBeds);
        
        if (!allocatedBed) {
          // Try HDU
          allocatedBed = findNextAvailableBed('HDU', hduBeds);
          if (allocatedBed) {
            status = 'shifted';
            recommendedWard = 'HDU';
            message = `ICU not available. Patient shifted to HDU (${allocatedBed}). Close monitoring required!`;
          } else {
            // Try General
            allocatedBed = findNextAvailableBed('GEN', generalBeds);
            if (allocatedBed) {
              status = 'alert';
              recommendedWard = 'General';
              message = `CRITICAL: ICU and HDU full. Patient placed in General Ward (${allocatedBed}). Requires intensive monitoring!`;
            } else {
              status = 'alert';
              message = 'CRITICAL ALERT: No beds available in any ward. Patient in emergency status!';
            }
          }
        } else {
          message = `Patient will be admitted to ICU (${allocatedBed}).`;
        }
      }

      setBedAvailability({
        allocatedBed,
        severityScore,
        recommendedWard,
        status,
        message
      });
      
      console.log('Bed allocation result:', {
        allocatedBed,
        severityScore,
        recommendedWard,
        status,
        message,
        occupiedBeds: Array.from(occupiedBeds),
        severityDetails: severityResult
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check bed availability';
      setError(errorMessage);
      console.error('Error checking bed availability:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#111811] text-white font-display">
      <style>
        {`
          /* Hide number input spinners */
          input[type=number]::-webkit-inner-spin-button,
          input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-[#3b543b]/30 bg-[#111811]/95 backdrop-blur-md px-4 sm:px-10 py-3">
        <div className="flex items-center gap-4 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border shadow-sm group cursor-pointer bg-[#13ec13]/10 border-[#13ec13]/20 text-[#13ec13] shadow-[0_0_25px_rgba(19,236,19,0.3)] hover:shadow-[0_0_40px_rgba(19,236,19,0.6),0_0_60px_rgba(19,236,19,0.3)] transition-all duration-500 hover:scale-110">
            <svg 
              className="w-6 h-6 group-hover:animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
            LifeLine<span className="italic ml-0.5 text-[#13ec13]">24x7</span>
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 sm:gap-8 items-center">
          <div className="hidden sm:flex gap-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-6 bg-[#1c271c] border border-[#3b543b] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#152015] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">Cancel</span>
            </button>
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
          </div>
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 ring-2 ring-[#3b543b] flex items-center justify-center bg-[#1c271c]">
            <span className="material-symbols-outlined text-[#13ec13] text-2xl">person</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[1200px] flex flex-col gap-8">
          {/* Page Header */}
          <div className="flex flex-col gap-2 border-b border-[#3b543b]/30 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#13ec13]/10 border border-[#13ec13]/20 text-[#13ec13] shadow-[0_0_15px_rgba(19,236,19,0.2)] hover:scale-110 transition-all cursor-pointer">
                <span className="material-symbols-outlined">person_add</span>
              </div>
              <h1 className="text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
                New Patient Admission
              </h1>
            </div>
            <p className="text-gray-400 text-base font-normal leading-normal max-w-2xl">
              Enter patient details, medical history, and current vitals to assess severity and
              allocate appropriate bed resources.
            </p>
          </div>

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
                <p className="text-gray-400 text-xs mt-1">Redirecting to overview...</p>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              {/* Patient Demographics */}
              <section className="flex flex-col gap-4">
                <h2 className="text-white text-[22px] font-bold leading-tight px-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec13]">badge</span>
                  Patient Demographics
                </h2>
                <div className="bg-[#1c271c] rounded-2xl p-6 border border-[#3b543b] flex flex-col gap-6 shadow-sm">
                  <label className="flex flex-col">
                    <span className="text-slate-300 text-sm font-semibold pb-2 ml-1">
                      Patient Name
                    </span>
                    <input
                      className="form-input block w-full rounded-xl border px-4 py-3.5 placeholder:text-gray-500 transition-all shadow-sm focus:outline-0 focus:ring-0 text-white border-[#3b543b] bg-[#1c271c] focus:border-[#13ec13] focus:bg-[#152015] placeholder:text-[#9db99d] focus:shadow-[0_0_20px_rgba(19,236,19,0.2)] hover:border-[#3b543b]/80"
                      placeholder="Enter full name"
                      type="text"
                      value={patientData.name}
                      onChange={(e) => handlePatientDataChange('name', e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-slate-300 text-sm font-semibold pb-2 ml-1">Age</span>
                    <input
                      className="form-input block w-full rounded-xl border px-4 py-3.5 placeholder:text-gray-500 transition-all shadow-sm focus:outline-0 focus:ring-0 text-white border-[#3b543b] bg-[#1c271c] focus:border-[#13ec13] focus:bg-[#152015] placeholder:text-[#9db99d] focus:shadow-[0_0_20px_rgba(19,236,19,0.2)] hover:border-[#3b543b]/80"
                      placeholder="Age"
                      type="number"
                      value={patientData.age}
                      onChange={(e) => handlePatientDataChange('age', e.target.value)}
                    />
                  </label>
                  <div className="flex flex-col">
                    <span className="text-slate-300 text-sm font-semibold pb-3 ml-1">Gender</span>
                    <div className="flex flex-wrap gap-3">
                      {(['male', 'female', 'other'] as const).map((gender) => (
                        <label key={gender} className="group cursor-pointer">
                          <input
                            className="peer sr-only"
                            name="gender"
                            type="radio"
                            checked={patientData.gender === gender}
                            onChange={() => handlePatientDataChange('gender', gender)}
                          />
                          <div className="flex items-center justify-center rounded-xl border border-[#3b543b] bg-[#1c271c] px-6 h-12 text-[#9db99d] transition-all shadow-sm peer-checked:border-[#13ec13] peer-checked:text-[#13ec13] peer-checked:bg-[#13ec13]/10 peer-checked:shadow-[0_0_15px_rgba(19,236,19,0.2)] group-hover:border-[#3b543b]/80">
                            <span className="text-sm font-bold capitalize">{gender}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Current Vitals */}
              <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-white text-[22px] font-bold leading-tight flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500 animate-pulse">
                      ecg_heart
                    </span>
                    Current Vitals
                  </h2>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#13ec13] bg-[#13ec13]/10 px-3 py-1 rounded-full border border-[#13ec13]/20">
                    Live Input
                  </span>
                </div>
                <div className="bg-[#1c271c] rounded-3xl p-6 border border-[#3b543b] shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#13ec13]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                    {/* Heart Rate */}
                    <div className="bg-[#152015] p-5 rounded-2xl border border-[#3b543b] hover:border-[#13ec13]/50 transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(19,236,19,0.1)]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-sm font-medium">Heart Rate</span>
                        <span className="material-symbols-outlined text-red-500">favorite</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <input
                          className="w-24 bg-transparent text-3xl font-bold text-white placeholder-gray-600 focus:outline-none focus:placeholder-transparent transition-colors"
                          placeholder="--"
                          type="number"
                          value={vitals.heartRate}
                          onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                        />
                        <span className="text-xs text-gray-400 font-bold uppercase">bpm</span>
                      </div>
                    </div>

                    {/* SpO2 */}
                    <div className="bg-[#152015] p-5 rounded-2xl border border-[#3b543b] hover:border-[#13ec13]/50 transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(19,236,19,0.1)]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-sm font-medium">SpO2</span>
                        <span className="material-symbols-outlined text-blue-400">water_drop</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <input
                          className="w-24 bg-transparent text-3xl font-bold text-white placeholder-gray-600 focus:outline-none focus:placeholder-transparent transition-colors"
                          placeholder="--"
                          type="number"
                          value={vitals.spo2}
                          onChange={(e) => handleVitalChange('spo2', e.target.value)}
                        />
                        <span className="text-xs text-gray-400 font-bold uppercase">%</span>
                      </div>
                    </div>

                    {/* Respiratory Rate */}
                    <div className="bg-[#152015] p-5 rounded-2xl border border-[#3b543b] hover:border-[#13ec13]/50 transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(19,236,19,0.1)]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-sm font-medium">Resp. Rate</span>
                        <span className="material-symbols-outlined text-white/50">air</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <input
                          className="w-24 bg-transparent text-3xl font-bold text-white placeholder-gray-600 focus:outline-none focus:placeholder-transparent transition-colors"
                          placeholder="--"
                          type="number"
                          value={vitals.respRate}
                          onChange={(e) => handleVitalChange('respRate', e.target.value)}
                        />
                        <span className="text-xs text-gray-400 font-bold uppercase">bpm</span>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="bg-[#152015] p-5 rounded-2xl border border-[#3b543b] hover:border-[#13ec13]/50 transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(19,236,19,0.1)]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-sm font-medium">Temp</span>
                        <span className="material-symbols-outlined text-orange-400">
                          thermostat
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <input
                          className="w-24 bg-transparent text-3xl font-bold text-white placeholder-gray-600 focus:outline-none focus:placeholder-transparent transition-colors"
                          placeholder="--"
                          type="number"
                          value={vitals.temperature}
                          onChange={(e) => handleVitalChange('temperature', e.target.value)}
                        />
                        <span className="text-xs text-gray-400 font-bold uppercase">°C</span>
                      </div>
                    </div>

                    {/* Blood Pressure */}
                    <div className="col-span-1 sm:col-span-2 md:col-span-2 bg-[#152015] p-5 rounded-2xl border border-[#3b543b] hover:border-[#13ec13]/50 transition-all group shadow-sm hover:shadow-[0_0_15px_rgba(19,236,19,0.1)]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-gray-400 text-sm font-medium">
                          Blood Pressure
                        </span>
                        <span className="material-symbols-outlined text-[#13ec13]">compress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          className="w-20 bg-transparent text-3xl font-bold text-white placeholder-gray-600 focus:outline-none text-right transition-colors"
                          placeholder="120"
                          type="number"
                          value={vitals.bpSystolic}
                          onChange={(e) => handleVitalChange('bpSystolic', e.target.value)}
                        />
                        <span className="text-2xl text-gray-400 font-light">/</span>
                        <input
                          className="w-20 bg-transparent text-3xl font-bold text-white placeholder-gray-600 focus:outline-none transition-colors"
                          placeholder="80"
                          type="number"
                          value={vitals.bpDiastolic}
                          onChange={(e) => handleVitalChange('bpDiastolic', e.target.value)}
                        />
                        <span className="text-xs text-gray-400 font-bold uppercase ml-auto">
                          mmHg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Connect Device Button */}
                  <div className="mt-6 pt-4 border-t border-[#3b543b]">
                    <button
                      onClick={handleConnectDevice}
                      className="w-full flex items-center justify-center gap-2 rounded-xl h-12 bg-[#13ec13] text-green-950 text-base font-bold hover:bg-[#3bf03b] transition-all duration-300 shadow-[0_0_30px_rgba(19,236,19,0.4),0_0_60px_rgba(19,236,19,0.2)] hover:shadow-[0_0_50px_rgba(19,236,19,0.7),0_0_100px_rgba(19,236,19,0.4)] hover:scale-105 active:scale-[0.98]"
                    >
                      <span className="material-symbols-outlined">monitor_heart</span>
                      <span>Connect Device</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="sticky top-24 flex flex-col gap-8 max-w-xl">
                {/* Clinical Information */}
                <section className="flex flex-col gap-4">
                  <h2 className="text-white text-[22px] font-bold leading-tight px-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#13ec13]">clinical_notes</span>
                    Clinical Information
                  </h2>
                  <div className="bg-[#1c271c] rounded-2xl p-6 border border-[#3b543b] flex flex-col gap-6 shadow-sm">
                    <label className="flex flex-col">
                      <span className="text-slate-300 text-sm font-semibold pb-2 ml-1">
                        Presenting Ailment
                      </span>
                      <textarea
                        className="form-textarea block w-full rounded-xl border px-4 py-3 placeholder:text-gray-500 transition-all resize-y shadow-sm focus:outline-0 focus:ring-0 text-white border-[#3b543b] bg-[#1c271c] focus:border-[#13ec13] focus:bg-[#152015] placeholder:text-[#9db99d] focus:shadow-[0_0_20px_rgba(19,236,19,0.2)] hover:border-[#3b543b]/80 min-h-[89px]"
                        placeholder="e.g. Severe Chest Pain"
                        value={patientData.presentingAilment}
                        onChange={(e) =>
                          handlePatientDataChange('presentingAilment', e.target.value)
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="text-slate-300 text-sm font-semibold pb-2 ml-1">
                        Medical History
                      </span>
                      <textarea
                        className="form-textarea block w-full rounded-xl border px-4 py-3 placeholder:text-gray-500 transition-all resize-y shadow-sm focus:outline-0 focus:ring-0 text-white border-[#3b543b] bg-[#1c271c] focus:border-[#13ec13] focus:bg-[#152015] placeholder:text-[#9db99d] focus:shadow-[0_0_20px_rgba(19,236,19,0.2)] hover:border-[#3b543b]/80 min-h-[89px]"
                        placeholder="Previous conditions, surgeries, allergies..."
                        value={patientData.medicalHistory}
                        onChange={(e) =>
                          handlePatientDataChange('medicalHistory', e.target.value)
                        }
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="text-slate-300 text-sm font-semibold pb-2 ml-1">
                        Clinical Notes
                      </span>
                      <textarea
                        className="form-textarea block w-full rounded-xl border px-4 py-3 placeholder:text-gray-500 transition-all resize-y shadow-sm focus:outline-0 focus:ring-0 text-white border-[#3b543b] bg-[#1c271c] focus:border-[#13ec13] focus:bg-[#152015] placeholder:text-[#9db99d] focus:shadow-[0_0_20px_rgba(19,236,19,0.2)] hover:border-[#3b543b]/80 min-h-[89px]"
                        placeholder="Doctor's observations..."
                        value={patientData.clinicalNotes}
                        onChange={(e) => handlePatientDataChange('clinicalNotes', e.target.value)}
                      />
                    </label>
                    <label className="flex flex-col">
                      <span className="text-slate-300 text-sm font-semibold pb-2 ml-1">
                        Lab Results Summary
                      </span>
                      <textarea
                        className="form-textarea block w-full rounded-xl border px-4 py-3 placeholder:text-gray-500 transition-all resize-y shadow-sm focus:outline-0 focus:ring-0 text-white border-[#3b543b] bg-[#1c271c] focus:border-[#13ec13] focus:bg-[#152015] placeholder:text-[#9db99d] focus:shadow-[0_0_20px_rgba(19,236,19,0.2)] hover:border-[#3b543b]/80 min-h-[89px]"
                        placeholder="Key findings from blood work..."
                        value={patientData.labResults}
                        onChange={(e) => handlePatientDataChange('labResults', e.target.value)}
                      />
                    </label>
                  </div>
                </section>

                {/* Bed Allocation */}
                <div className="bg-[#13ec13]/10 border border-[#13ec13]/20 rounded-2xl p-6 shadow-[0_0_15px_rgba(19,236,19,0.1)]">
                  <h3 className="text-white text-lg font-bold mb-2">Bed Allocation</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Based on the vitals, the system will recommend a ward.
                  </p>
                  
                  {bedAvailability && (
                    <div className="mb-4 space-y-3">
                      {/* Severity Score */}
                      <div className="p-3 bg-[#1c271c] rounded-lg border border-[#3b543b]">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Severity Score:</span>
                          <span className={`text-xl font-bold ${
                            bedAvailability.severityScore >= 8 ? 'text-red-500' :
                            bedAvailability.severityScore >= 5 ? 'text-orange-400' :
                            bedAvailability.severityScore >= 3 ? 'text-yellow-400' :
                            'text-[#13ec13]'
                          }`}>
                            {bedAvailability.severityScore}/10
                          </span>
                        </div>
                      </div>

                      {/* Recommended Ward */}
                      <div className="p-3 bg-[#1c271c] rounded-lg border border-[#3b543b]">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400 text-sm">Recommended Ward:</span>
                          <span className="text-white font-bold">{bedAvailability.recommendedWard}</span>
                        </div>
                      </div>

                      {/* Allocated Bed */}
                      <div className={`p-4 rounded-lg border-2 ${
                        bedAvailability.status === 'alert' ? 'bg-red-500/10 border-red-500/50' :
                        bedAvailability.status === 'waiting' ? 'bg-yellow-500/10 border-yellow-500/50' :
                        bedAvailability.status === 'shifted' ? 'bg-orange-500/10 border-orange-500/50' :
                        'bg-[#13ec13]/10 border-[#13ec13]/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <span className={`material-symbols-outlined text-2xl ${
                            bedAvailability.status === 'alert' ? 'text-red-500 animate-pulse' :
                            bedAvailability.status === 'waiting' ? 'text-yellow-400' :
                            bedAvailability.status === 'shifted' ? 'text-orange-400' :
                            'text-[#13ec13]'
                          }`}>
                            {bedAvailability.status === 'alert' ? 'error' :
                             bedAvailability.status === 'waiting' ? 'schedule' :
                             bedAvailability.status === 'shifted' ? 'swap_horiz' :
                             'check_circle'}
                          </span>
                          <div className="flex-1">
                            {bedAvailability.allocatedBed && (
                              <div className="mb-2">
                                <span className="text-gray-400 text-xs uppercase tracking-wide">Bed ID:</span>
                                <div className="text-2xl font-bold text-white mt-1">
                                  {bedAvailability.allocatedBed}
                                </div>
                                {bedAvailability.status === 'waiting' && (
                                  <div className="mt-1 inline-block px-2 py-0.5 bg-yellow-500/20 border border-yellow-500/50 rounded text-xs text-yellow-400 font-bold">
                                    WAITING
                                  </div>
                                )}
                                {bedAvailability.status === 'alert' && (
                                  <div className="mt-1 inline-block px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded text-xs text-red-400 font-bold animate-pulse">
                                    ALERT
                                  </div>
                                )}
                              </div>
                            )}
                            <p className={`text-sm ${
                              bedAvailability.status === 'alert' ? 'text-red-300' :
                              bedAvailability.status === 'waiting' ? 'text-yellow-300' :
                              bedAvailability.status === 'shifted' ? 'text-orange-300' :
                              'text-gray-300'
                            }`}>
                              {bedAvailability.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCheckAvailability}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl h-12 bg-[#13ec13] text-green-950 text-base font-bold hover:bg-[#3bf03b] transition-all duration-300 shadow-[0_0_30px_rgba(19,236,19,0.4),0_0_60px_rgba(19,236,19,0.2)] hover:shadow-[0_0_50px_rgba(19,236,19,0.7),0_0_100px_rgba(19,236,19,0.4)] hover:scale-105 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="material-symbols-outlined">bed</span>
                    <span>{isLoading ? 'Checking...' : 'Check Availability'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewAdmission;