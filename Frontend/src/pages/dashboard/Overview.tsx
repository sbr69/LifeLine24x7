import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types';
import { getAllAdmissions, getDashboardStats } from '../../services/admissionService';
import { transformAdmittedPatientsToUI } from '../../utils/dataTransformers';
import { getSeverityColor, getSeverityTextColor, getConditionStyles } from './SeverityScore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedWard, setSelectedWard] = useState<'all' | 'ICU' | 'HDU' | 'General'>('all');
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  
  // Dashboard statistics
  const [dashboardStats, setDashboardStats] = useState({
    totalPatients: 0,
    criticalPatients: 0,
    admittedToday: 0,
    bedOccupancy: {
      icuOccupied: 0,
      hduOccupied: 0,
      generalOccupied: 0
    }
  });
  
  // Get bed data from localStorage
  const [bedData, setBedData] = useState({
    icuBeds: 0,
    hduBeds: 0,
    generalBeds: 0
  });

  // Fetch dashboard statistics from API
  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      
      if (response.success) {
        setDashboardStats(response.data);
        console.log('Loaded dashboard statistics from database:', response.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // Keep existing stats on error
    }
  };

  // Fetch admitted patients from API
  const fetchAdmittedPatients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getAllAdmissions({ limit: 100 });
      
      if (response.success && response.data.length > 0) {
        const transformedPatients = transformAdmittedPatientsToUI(response.data);
        setPatients(transformedPatients);
        console.log('Loaded admitted patients from database:', transformedPatients);
      } else {
        setPatients([]);
        console.log('No patients in database yet');
      }
    } catch (err) {
      console.error('Error fetching admitted patients:', err);
      setError('Failed to load patient data. Using cached data.');
      // Keep existing patients on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch bed data from localStorage on component mount
    const icuBeds = parseInt(localStorage.getItem('icuBeds') || '0');
    const hduBeds = parseInt(localStorage.getItem('hduBeds') || '0');
    const generalBeds = parseInt(localStorage.getItem('generalBeds') || '0');
    
    console.log('Loading bed data from localStorage:', {
      icuBeds,
      hduBeds,
      generalBeds
    });
    
    setBedData({
      icuBeds,
      hduBeds,
      generalBeds
    });

    // Fetch dashboard stats and admitted patients
    fetchDashboardStats();
    fetchAdmittedPatients();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchDashboardStats();
      fetchAdmittedPatients();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const getBedAvailabilityStatus = (occupied: number, total: number) => {
    if (total === 0) return { label: 'No Beds', color: 'text-gray-400', bgColor: 'bg-gray-500', borderColor: 'border-gray-500/50', glowColor: 'hover:shadow-[0_0_20px_rgba(156,163,175,0.1)]', indicatorBg: 'bg-gray-500' };
    
    const occupancyPercentage = (occupied / total) * 100;
    
    if (occupancyPercentage > 80) {
      return {
        label: 'Critical Availability',
        color: 'text-red-400',
        bgColor: 'bg-red-500',
        borderColor: 'border-red-500/50',
        glowColor: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.1)]',
        indicatorBg: 'bg-red-500'
      };
    } else if (occupancyPercentage > 40) {
      return {
        label: 'Moderate Availability',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500',
        borderColor: 'border-yellow-500/50',
        glowColor: 'hover:shadow-[0_0_20px_rgba(234,179,8,0.1)]',
        indicatorBg: 'bg-yellow-500'
      };
    } else {
      return {
        label: 'Good Availability',
        color: 'text-[#13ec13]',
        bgColor: 'bg-[#13ec13]',
        borderColor: 'border-[#13ec13]/50',
        glowColor: 'hover:shadow-[0_0_20px_rgba(19,236,19,0.1)]',
        indicatorBg: 'bg-[#13ec13]'
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // Filter and sort patients
  const filteredAndSortedPatients = patients
    .filter(patient => {
      // Filter by search query
      const matchesSearch = searchQuery === '' || 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by ward
      const matchesWard = selectedWard === 'all' || 
        patient.bedId.startsWith(selectedWard);
      
      return matchesSearch && matchesWard;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.severityScore - b.severityScore;
      } else {
        return b.severityScore - a.severityScore;
      }
    });

  return (
    <div className="flex h-screen overflow-hidden bg-[#111811]">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-[#3b543b]/30 bg-[#111f10] py-6 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#13ec13]/10 border border-[#13ec13]/20 text-[#13ec13] shadow-[0_0_15px_rgba(19,236,19,0.2)]">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight text-white tracking-tight">
            LifeLine<span className="ml-0.5 text-[#13ec13] italic">24x7</span>
          </h2>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          <button type="button" onClick={() => navigate('/overview')} className="w-full text-left flex items-center gap-3 rounded-xl bg-[#13ec13]/10 px-4 py-3 text-sm font-semibold text-[#13ec13] shadow-[0_0_15px_rgba(19,236,19,0.1)] border border-[#13ec13]/20">
            <span className="material-symbols-outlined text-[#13ec13]">dashboard</span>
            Dashboard
          </button>
          <button type="button" onClick={() => navigate('/staff')} className="w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#9db99d] hover:bg-[#1c271c] hover:text-white transition-all hover:translate-x-1">
            <span className="material-symbols-outlined">medical_services</span>
            Staff
          </button>
          <button type="button" onClick={() => navigate('/reports')} className="w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#9db99d] hover:bg-[#1c271c] hover:text-white transition-all hover:translate-x-1">
            <span className="material-symbols-outlined">analytics</span>
            Reports
          </button>
        </nav>

        <div className="px-4 mt-auto">
          <div className="rounded-2xl bg-[#1c271c] p-4 border border-[#3b543b]/50 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 overflow-hidden rounded-full border border-[#3b543b]">
                <img alt="User" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATCcaBuQuJBhdY0-4TL04rhp_E2oy-55OMIY-O_BqrnEfpjh_2df2Qha7UrO2s171vNsyRvQRCtLU57xYolqsuveOBPM6cWkR6MUMD8Rda3WjgNrtRoYmKwbGxb15hxeWIoyVxOtgzmRKcNcH6TabU3X599SNIiWpHlxlearY9xlV2LuURUPoY3bOuMYNgzrpXb8PQlkrAzguEusbAdJzf8dkwAf9lvSHe-nPmJaegwV20t3_1YGpnrlkD2GvB5A9BqG6DeW7eGBNM"/>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Dr. Sarah Smith</p>
                <p className="text-xs text-[#9db99d]">Chief Medical Officer</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#3b543b] bg-transparent py-2 text-xs font-medium text-[#9db99d] hover:text-white hover:border-[#13ec13] hover:bg-[#13ec13]/5 transition-all"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#111811] relative">
        <div className="relative z-10 p-8">
          {/* Header */}
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Hospital Overview</h1>
              <p className="text-sm text-[#9db99d] mt-1">
                Real-time bed allocation and patient status monitoring.
                {isLoading && (
                  <span className="ml-2 text-[#13ec13]">
                    <span className="animate-pulse">● Refreshing...</span>
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  fetchDashboardStats();
                  fetchAdmittedPatients();
                }}
                className="flex items-center gap-2 rounded-full bg-[#1c271c] border border-[#3b543b] px-4 py-2 text-sm font-medium text-[#9db99d] hover:text-white hover:border-[#13ec13] hover:bg-[#13ec13]/5 transition-all"
                title="Refresh patient data"
              >
                <span className="material-symbols-outlined text-lg">refresh</span>
                Refresh
              </button>
              <button 
                onClick={() => navigate('/newadmission')}
                className="flex items-center gap-2 rounded-full bg-[#13ec13] px-6 py-3 text-sm font-bold text-[#111811] hover:bg-[#3bf03b] shadow-[0_0_20px_rgba(19,236,19,0.4)] hover:shadow-[0_0_30px_rgba(19,236,19,0.6)] hover:scale-105 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-xl">add_circle</span>
                New Admission
              </button>
            </div>
          </header>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-yellow-400">warning</span>
              <p className="text-sm text-yellow-300">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-yellow-400 hover:text-yellow-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          )}

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Occupancy */}
            {(() => {
              const totalOccupied = dashboardStats.bedOccupancy.icuOccupied + dashboardStats.bedOccupancy.hduOccupied + dashboardStats.bedOccupancy.generalOccupied;
              const totalBeds = bedData.icuBeds + bedData.hduBeds + bedData.generalBeds;
              const occupancyPercentage = totalBeds > 0 ? Math.round((totalOccupied / totalBeds) * 100) : 0;
              const availableBeds = totalBeds - totalOccupied;
              
              return (
                <>
                  {/* Total Occupancy Card */}
                  <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg hover:border-[#13ec13]/30 transition-colors group">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all">
                        <span className="material-symbols-outlined">ward</span>
                      </div>
                    </div>
                    <h3 className="text-4xl font-bold text-white">{occupancyPercentage}%</h3>
                    <p className="text-sm font-medium text-[#9db99d] mt-1">Total Occupancy</p>
                    <div className="mt-4 h-1.5 w-full rounded-full bg-[#111811]">
                      <div className="h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{width: `${occupancyPercentage}%`}}></div>
                    </div>
                  </div>

                  {/* Total Admitted Patients */}
                  <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg hover:border-[#13ec13]/30 transition-colors group">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="rounded-xl bg-[#13ec13]/10 p-3 text-[#13ec13] border border-[#13ec13]/20 group-hover:shadow-[0_0_15px_rgba(19,236,19,0.2)] transition-all">
                        <span className="material-symbols-outlined">monitor_heart</span>
                      </div>
                      <span className="text-xs font-medium text-[#9db99d]">{availableBeds} Available</span>
                    </div>
                    <h3 className="text-4xl font-bold text-white">{dashboardStats.totalPatients.toString().padStart(2, '0')}</h3>
                    <p className="text-sm font-medium text-[#9db99d] mt-1">Total Admitted Patients</p>
                  </div>
                </>
              );
            })()}

            {/* Critical Patients */}
            <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg hover:border-[#13ec13]/30 transition-colors group">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400 border border-orange-500/20 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all">
                  <span className="material-symbols-outlined">emergency</span>
                </div>
                {dashboardStats.criticalPatients > 0 && (
                  <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">High Alert</span>
                )}
              </div>
              <h3 className="text-4xl font-bold text-white">{dashboardStats.criticalPatients.toString().padStart(2, '0')}</h3>
              <p className="text-sm font-medium text-[#9db99d] mt-1">Critical Patients</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-orange-400/80">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"></span> Requires immediate attention
              </div>
            </div>

            {/* Discharges Today */}
            <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg hover:border-[#13ec13]/30 transition-colors group">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400 border border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all">
                  <span className="material-symbols-outlined">event_available</span>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-white">14</h3>
              <p className="text-sm font-medium text-[#9db99d] mt-1">Discharges Today</p>
              <div className="mt-4 flex -space-x-3">
                <img alt="" className="inline-block h-8 w-8 rounded-full ring-2 ring-[#1c271c] grayscale opacity-70 hover:opacity-100 hover:scale-110 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAebDWDDkaLIS_2tfb6RDv3ez1mJrGb578ZvWxTwmZpJgu0-51LUrQBMPIhovigcfM4N67ZlCCAp8Qele68FPCu8lByQ0Iq19gtVs2ESV3l8pYmTS8yzEgp9QV_cpHKSCvCGOgUyAs4pIfoX3Src127QsuluqmIPiPWvRbu39fQ5vUizEsBnS8lOLcu_gDOpUsAmAQSvxjL1VSo-_gElDi8fDf5yHK2YdCOF2Sed_oQycpCRGI-T8oRx9m9V-q38x7I-Qorr6La98eX"/>
                <img alt="" className="inline-block h-8 w-8 rounded-full ring-2 ring-[#1c271c] grayscale opacity-70 hover:opacity-100 hover:scale-110 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFTE7ylEP841ikFrR4-zg5p6B3v2jkdj-HvrAMAnE0i1PctiEgR4fgUqafnPCnQ8Owg4MVF3M4hIPsLJ0m3jKTmiw_GbAlaiZsONO0Gv-sakVlr9eFnce98v9K-B6Hjs2LkvNCmgdzCSFeHIxhLUb0J172bFzlm1oAzRFk9pGahekUiGsK8lgpvIwboBC4F-C_qr7R-5tI1iDu2PBDDtejCoJ8tRJ4WLCvyzcz0HMAIG5WwTi16SROWILqTQXJptGH9v-Clh-iOKvl"/>
                <img alt="" className="inline-block h-8 w-8 rounded-full ring-2 ring-[#1c271c] grayscale opacity-70 hover:opacity-100 hover:scale-110 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOMJ3hNBO1aAjcgw6M3JguFz0lNkijl_C912--pNmme255DR11n4tc1ltDeT0DcIPwmn85hKGPcS692wuY4Fnu_5jsygA7etgBF5cs-DZxR55PZv35y3TLrsSNhX8VcJ_syMSgKFMHb2Fhbfi4tcR9nwebYaceP6JXDLk2tk25oP1_u-UCYsHrwPc-fL-8bruKZmnUg9JChCKb90Y4ePfF-5qC7HD1FmHTZ-ARE4QXgG4FJS8CVXRkRW5fXx0rD4onlHkMyhXUFoIX"/>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#152015] ring-2 ring-[#1c271c] text-xs text-white font-bold border border-[#3b543b]">+11</div>
              </div>
            </div>
          </div>

          {/* Bed Status and Pending Discharges */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {/* ICU Beds */}
              {(() => {
                const icuOccupied = dashboardStats.bedOccupancy.icuOccupied;
                const icuStatus = getBedAvailabilityStatus(icuOccupied, bedData.icuBeds);
                const icuPercentage = bedData.icuBeds > 0 ? (icuOccupied / bedData.icuBeds) * 100 : 0;
                return (
                  <div className={`group relative overflow-hidden rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 transition-all hover:${icuStatus.borderColor} ${icuStatus.glowColor}`}>
                    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${icuStatus.bgColor}/5 blur-2xl group-hover:${icuStatus.bgColor}/10 transition-all`}></div>
                    <div className="relative">
                      <h4 className="text-sm font-semibold text-[#9db99d]">ICU Beds</h4>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{icuOccupied.toString().padStart(2, '0')}</span>
                        <span className="text-xs text-[#9db99d]">/ {bedData.icuBeds} Total</span>
                      </div>
                      <div className={`mt-4 text-xs font-bold ${icuStatus.color} flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${icuStatus.indicatorBg} ${icuPercentage > 80 ? 'animate-pulse' : ''}`}></span>
                        {icuStatus.label}
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-[#111811]">
                        <div className={`h-1.5 rounded-full ${icuStatus.bgColor} shadow-[0_0_10px_${icuStatus.bgColor.replace('bg-', 'rgba(')}]`} style={{width: `${icuPercentage}%`}}></div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* HDU Beds */}
              {(() => {
                const hduOccupied = dashboardStats.bedOccupancy.hduOccupied;
                const hduStatus = getBedAvailabilityStatus(hduOccupied, bedData.hduBeds);
                const hduPercentage = bedData.hduBeds > 0 ? (hduOccupied / bedData.hduBeds) * 100 : 0;
                return (
                  <div className={`group relative overflow-hidden rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 transition-all hover:${hduStatus.borderColor} ${hduStatus.glowColor}`}>
                    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${hduStatus.bgColor}/5 blur-2xl group-hover:${hduStatus.bgColor}/10 transition-all`}></div>
                    <div className="relative">
                      <h4 className="text-sm font-semibold text-[#9db99d]">HDU Beds</h4>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{hduOccupied.toString().padStart(2, '0')}</span>
                        <span className="text-xs text-[#9db99d]">/ {bedData.hduBeds} Total</span>
                      </div>
                      <div className={`mt-4 text-xs font-bold ${hduStatus.color} flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${hduStatus.indicatorBg} ${hduPercentage > 80 ? 'animate-pulse' : ''}`}></span>
                        {hduStatus.label}
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-[#111811]">
                        <div className={`h-1.5 rounded-full ${hduStatus.bgColor} shadow-[0_0_10px_${hduStatus.bgColor.replace('bg-', 'rgba(')}]`} style={{width: `${hduPercentage}%`}}></div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* General Beds */}
              {(() => {
                const generalOccupied = dashboardStats.bedOccupancy.generalOccupied;
                const generalStatus = getBedAvailabilityStatus(generalOccupied, bedData.generalBeds);
                const generalPercentage = bedData.generalBeds > 0 ? (generalOccupied / bedData.generalBeds) * 100 : 0;
                return (
                  <div className={`group relative overflow-hidden rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 transition-all hover:${generalStatus.borderColor} ${generalStatus.glowColor}`}>
                    <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${generalStatus.bgColor}/5 blur-2xl group-hover:${generalStatus.bgColor}/10 transition-all`}></div>
                    <div className="relative">
                      <h4 className="text-sm font-semibold text-[#9db99d]">General Beds</h4>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{generalOccupied}</span>
                        <span className="text-xs text-[#9db99d]">/ {bedData.generalBeds} Total</span>
                      </div>
                      <div className={`mt-4 text-xs font-bold ${generalStatus.color} flex items-center gap-2`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${generalStatus.indicatorBg} ${generalPercentage > 80 ? 'animate-pulse' : ''}`}></span>
                        {generalStatus.label}
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-[#111811]">
                        <div className={`h-1.5 rounded-full ${generalStatus.bgColor} shadow-[0_0_10px_${generalStatus.bgColor.replace('bg-', 'rgba(')}]`} style={{width: `${generalPercentage}%`}}></div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Pending Discharges */}
              <div className="group relative overflow-hidden rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 transition-all hover:border-[#9db99d]/50 flex flex-col lg:col-span-2">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[#9db99d]/5 blur-2xl group-hover:bg-[#9db99d]/10 transition-all"></div>
                <div className="relative flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-[#9db99d]">Pending Discharges</h4>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#152015] text-[#9db99d] border border-[#3b543b]">2 Pending</span>
                  </div>
                  <div className="space-y-4 mt-auto">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#152015] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#152015] flex items-center justify-center text-xs text-white font-bold border border-[#3b543b]">RK</div>
                        <div>
                          <p className="text-sm font-medium text-white">Rahul K.</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-[#13ec13] hover:text-[#3bf03b] hover:underline">Process</button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#152015] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#152015] flex items-center justify-center text-xs text-white font-bold border border-[#3b543b]">SL</div>
                        <div>
                          <p className="text-sm font-medium text-white">Sarah L.</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-[#13ec13] hover:text-[#3bf03b] hover:underline">Process</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admitted Patients Table */}
            <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] overflow-hidden w-full shadow-lg">
              <div className="flex items-center justify-between border-b border-[#3b543b]/50 p-6">
                <h3 className="font-bold text-white text-lg">Admitted Patients</h3>
                <div className="flex gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9db99d]">
                      <span className="material-symbols-outlined text-[18px]">search</span>
                    </span>
                    <input 
                      className="h-9 rounded-xl border border-[#3b543b] bg-[#152015] pl-10 pr-4 text-sm font-medium text-white placeholder-[#9db99d] focus:border-[#13ec13] focus:outline-none focus:ring-0 focus:shadow-[0_0_15px_rgba(19,236,19,0.1)] w-40 lg:w-64 transition-all" 
                      placeholder="Search ID or Name" 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* Ward Filter Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowWardDropdown(!showWardDropdown)}
                      className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all flex items-center gap-1.5 w-[100px] justify-between ${
                        showWardDropdown 
                          ? 'bg-[#13ec13]/10 border-[#13ec13]/50 text-[#13ec13] shadow-[0_0_15px_rgba(19,236,19,0.15)]'
                          : 'bg-[#152015] border-[#3b543b] text-[#9db99d] hover:bg-[#1c271c] hover:text-white hover:border-[#9db99d]'
                      }`}
                    >
                      <span className="truncate">{selectedWard === 'all' ? 'All Wards' : selectedWard}</span>
                      <span className={`material-symbols-outlined text-[14px] transition-transform duration-200 flex-shrink-0 ${
                        showWardDropdown ? 'rotate-180' : ''
                      }`}>
                        expand_more
                      </span>
                    </button>
                    {showWardDropdown && (
                      <>
                        {/* Backdrop for closing dropdown */}
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={() => setShowWardDropdown(false)}
                        ></div>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full mt-1.5 right-0 z-50 w-[100px] rounded-lg border border-[#3b543b] bg-[#1c271c] shadow-lg overflow-hidden">
                          <button
                            onClick={() => {
                              setSelectedWard('all');
                              setShowWardDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold transition-all ${
                              selectedWard === 'all'
                                ? 'bg-[#13ec13]/10 text-[#13ec13]'
                                : 'text-[#9db99d] hover:bg-[#152015] hover:text-white'
                            }`}
                          >
                            All Wards
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWard('ICU');
                              setShowWardDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold transition-all ${
                              selectedWard === 'ICU'
                                ? 'bg-[#13ec13]/10 text-[#13ec13]'
                                : 'text-[#9db99d] hover:bg-[#152015] hover:text-white'
                            }`}
                          >
                            ICU
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWard('HDU');
                              setShowWardDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold transition-all ${
                              selectedWard === 'HDU'
                                ? 'bg-[#13ec13]/10 text-[#13ec13]'
                                : 'text-[#9db99d] hover:bg-[#152015] hover:text-white'
                            }`}
                          >
                            HDU
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWard('General');
                              setShowWardDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-xs font-bold transition-all ${
                              selectedWard === 'General'
                                ? 'bg-[#13ec13]/10 text-[#13ec13]'
                                : 'text-[#9db99d] hover:bg-[#152015] hover:text-white'
                            }`}
                          >
                            General
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Sort Button */}
                  <button 
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="rounded-xl border border-[#3b543b] bg-[#152015] px-4 py-2 text-xs font-bold text-[#9db99d] hover:bg-[#1c271c] hover:text-white hover:border-[#9db99d] transition-all flex items-center gap-2"
                  >
                    Sort
                    <span className="material-symbols-outlined text-[16px]">
                      {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#152015] text-xs uppercase text-[#9db99d] font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-5">Patient Name</th>
                      <th className="px-6 py-5">Bed ID</th>
                      <th className="px-6 py-5">Admission Date</th>
                      <th className="px-6 py-5">Severity Score</th>
                      <th className="px-6 py-5">Condition</th>
                      <th className="px-6 py-5">Doctor</th>
                      <th className="px-6 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3b543b]/30">
                    {filteredAndSortedPatients.map((patient) => (
                      <tr key={patient.id} className="group hover:bg-[#13ec13]/5 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#152015] flex items-center justify-center text-xs font-bold text-white border border-[#3b543b] group-hover:border-[#13ec13]/50 transition-colors">
                              {patient.initials}
                            </div>
                            <div>
                              <div className="font-bold text-white">{patient.name}</div>
                              <div className="text-xs text-[#9db99d] font-mono tracking-wide mt-0.5">ID: {patient.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-bold text-white">{patient.bedId}</td>
                        <td className="px-6 py-5 text-[#9db99d]">{patient.admissionDate}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-20 rounded-full bg-[#111811] overflow-hidden">
                              <div className={`h-full ${getSeverityColor(patient.severityScore)}`} style={{width: `${patient.severityScore * 10}%`}}></div>
                            </div>
                            <span className={`text-xs font-bold ${getSeverityTextColor(patient.severityScore)}`}>
                              {patient.severityScore.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${getConditionStyles(patient.condition)}`}>
                            {patient.condition}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-[#9db99d]">{patient.doctor}</td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="rounded-lg bg-[#13ec13]/10 border border-[#13ec13]/20 px-3 py-1.5 text-xs font-bold text-[#13ec13] hover:bg-[#13ec13]/20 hover:shadow-[0_0_10px_rgba(19,236,19,0.2)] transition-all">Details</button>
                            <button className="rounded-lg bg-transparent border border-[#3b543b] px-3 py-1.5 text-xs font-bold text-[#9db99d] hover:text-white hover:border-white/30 transition-all">Discharge</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
