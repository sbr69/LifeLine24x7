import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewStaff: React.FC = () => {
  const navigate = useNavigate();
  const [isActiveStatus, setIsActiveStatus] = useState(true);
  const [allowSystemAccess, setAllowSystemAccess] = useState(false);
  const [workingDays, setWorkingDays] = useState({
    mon: true,
    tue: true,
    wed: true,
    thu: true,
    fri: true,
    sat: false,
    sun: false
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    role: '',
    department: '',
    employeeId: 'S-1190',
    qualifications: '',
    shiftType: 'morning',
    joiningDate: ''
  });

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWorkingDayToggle = (day: keyof typeof workingDays) => {
    setWorkingDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const handleCancel = () => {
    navigate('/staff');
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    console.log('Active Status:', isActiveStatus);
    console.log('System Access:', allowSystemAccess);
    console.log('Working Days:', workingDays);
    // Add API call here to save staff data
    navigate('/staff');
  };

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
          <button 
            onClick={() => navigate('/overview')}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[#9db99d] hover:bg-[#1c271c] hover:text-white transition-all hover:translate-x-1 w-full"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </button>
          <button 
            onClick={() => navigate('/staff')}
            className="flex items-center gap-3 rounded-xl bg-[#13ec13]/10 px-4 py-3 text-sm font-semibold text-[#13ec13] shadow-[0_0_15px_rgba(19,236,19,0.1)] border border-[#13ec13]/20 w-full"
          >
            <span className="material-symbols-outlined text-[#13ec13]">medical_services</span>
            Staff
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
        <div className="relative z-10 p-8 max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex mb-6">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button 
                  onClick={() => navigate('/overview')}
                  className="inline-flex items-center text-sm font-medium text-[#9db99d] hover:text-white"
                >
                  <span className="material-symbols-outlined mr-2 text-base">home</span>
                  Home
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[#3b543b] mx-1">chevron_right</span>
                  <button 
                    onClick={() => navigate('/staff')}
                    className="ml-1 text-sm font-medium text-[#9db99d] hover:text-white md:ml-2"
                  >
                    Staff Management
                  </button>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="material-symbols-outlined text-[#3b543b] mx-1">chevron_right</span>
                  <span className="ml-1 text-sm font-medium text-[#13ec13] md:ml-2">Add New Staff</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Add New Staff</h1>
              <p className="text-sm text-[#9db99d] mt-1">Create a new profile for doctors, nurses, or administrative staff.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-xl bg-[#1c271c] border border-[#3b543b] px-4 py-2.5 text-sm font-medium text-[#9db99d] hover:text-white hover:bg-[#152015] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 rounded-xl bg-[#13ec13] px-6 py-2.5 text-sm font-bold text-[#111811] hover:bg-[#3bf03b] shadow-[0_0_20px_rgba(19,236,19,0.4)] hover:shadow-[0_0_30px_rgba(19,236,19,0.6)] transition-all"
              >
                <span className="material-symbols-outlined text-xl">save</span>
                Save Staff Profile
              </button>
            </div>
          </header>

          {/* Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Status */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Photo */}
              <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6">Profile Photo</h3>
                <div className="flex flex-col items-center">
                  <div className="relative group h-40 w-40 mb-6">
                    <div className="h-40 w-40 rounded-full bg-[#152015] border-2 border-dashed border-[#3b543b] flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-5xl text-[#3b543b]">add_a_photo</span>
                    </div>
                    <button className="absolute bottom-1 right-1 h-10 w-10 rounded-full bg-[#13ec13] text-[#111811] flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#9db99d] text-center mb-4">
                    Allowed *.jpeg, *.jpg, *.png, *.gif<br/>Max size of 3 MB
                  </p>
                </div>
              </div>

              {/* Status & Settings */}
              <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4">Status &amp; Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#9db99d]">Active Status</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isActiveStatus}
                        onChange={(e) => setIsActiveStatus(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3b543b] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#13ec13]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec13]"></div>
                    </label>
                  </div>
                  <hr className="border-[#3b543b]"/>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#9db99d]">Allow System Access</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={allowSystemAccess}
                        onChange={(e) => setAllowSystemAccess(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#3b543b] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#13ec13]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13ec13]"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec13]">person</span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">First Name</label>
                    <input 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white placeholder-[#3b543b] focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all" 
                      placeholder="e.g. James" 
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Last Name</label>
                    <input 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white placeholder-[#3b543b] focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all" 
                      placeholder="e.g. Wilson" 
                      type="text"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9db99d] material-symbols-outlined text-[20px]">mail</span>
                      <input 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#152015] border border-[#3b543b] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#3b543b] focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all" 
                        placeholder="email@lifeline.com" 
                        type="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9db99d] material-symbols-outlined text-[20px]">call</span>
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#152015] border border-[#3b543b] rounded-xl pl-11 pr-4 py-3 text-white placeholder-[#3b543b] focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all" 
                        placeholder="+1 (555) 000-0000" 
                        type="tel"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Date of Birth</label>
                    <input 
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white placeholder-[#3b543b] focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all [color-scheme:dark]" 
                      type="date"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Gender</label>
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec13]">badge</span>
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Staff Role</label>
                    <select 
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Role</option>
                      <option value="doctor">Doctor</option>
                      <option value="nurse">Nurse</option>
                      <option value="admin">Administrator</option>
                      <option value="technician">Lab Technician</option>
                      <option value="pharmacist">Pharmacist</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Department</label>
                    <select 
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select Department</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="neurology">Neurology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="er">Emergency Room</option>
                      <option value="surgery">Surgery</option>
                      <option value="icu">Intensive Care Unit</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Employee ID</label>
                  <input 
                    name="employeeId"
                    value={formData.employeeId}
                    readOnly
                    className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white placeholder-[#3b543b] focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all" 
                    type="text"
                  />
                  <p className="text-xs text-[#9db99d]">Auto-generated system ID</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Qualifications / Specialization</label>
                  <textarea 
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white placeholder-[#3b543b] focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all resize-none" 
                    placeholder="e.g. MBBS, MD in Cardiology, 10 years experience..." 
                    rows={3}
                  />
                </div>
              </div>

              {/* Shift Timing & Availability */}
              <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#13ec13]">schedule</span>
                  Shift Timing &amp; Availability
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Shift Type</label>
                    <select 
                      name="shiftType"
                      value={formData.shiftType}
                      onChange={handleInputChange}
                      className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="morning">Morning Shift (08:00 AM - 04:00 PM)</option>
                      <option value="evening">Evening Shift (04:00 PM - 12:00 AM)</option>
                      <option value="night">Night Shift (12:00 AM - 08:00 AM)</option>
                      <option value="rotating">Rotating Shift</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider">Joining Date</label>
                    <input 
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#152015] border border-[#3b543b] rounded-xl px-4 py-3 text-white placeholder-[#3b543b] focus:border-[#13ec13] focus:ring-1 focus:ring-[#13ec13] outline-none transition-all [color-scheme:dark]" 
                      type="date"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#9db99d] uppercase tracking-wider mb-2 block">Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
                      <label key={day} className="cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={workingDays[day]}
                          onChange={() => handleWorkingDayToggle(day)}
                          className="peer sr-only"
                        />
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#3b543b] bg-[#152015] text-[#9db99d] text-sm font-medium peer-checked:bg-[#13ec13]/20 peer-checked:text-[#13ec13] peer-checked:border-[#13ec13] transition-all hover:border-[#9db99d]">
                          {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewStaff;
