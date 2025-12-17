import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FormData {
  hospitalName: string;
  email: string;
  contactNumber: string;
  address: string;
  icuBeds: string;
  hduBeds: string;
  generalBeds: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    hospitalName: '',
    email: '',
    contactNumber: '',
    address: '',
    icuBeds: '',
    hduBeds: '',
    generalBeds: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleUseCurrentLocation = () => {
    // Implement geolocation
    console.log('Get current location');
  };

  const handleSelectOnMap = () => {
    // Implement map selection
    console.log('Select on map');
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Left Side - Info Panel */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-[#102210] items-center justify-center overflow-hidden fixed h-full z-20">
        <img 
          className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay grayscale" 
          alt="Abstract blurry hospital corridor with medical lighting" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKGy72g5YknmUPOrzReQ096uAxeL7MPHg0GR4r12IY2-ByZBXvlkB-pUD5FS2Imv2SotfO9YtnmIhlwHpTcQHJlyEm0Q1XfqhQ_wCvvxoyKYogKbxkaWhVWc6Tl90hjigBbN04IuFXi5FRbLy1oTyzhnJVcBEiWQqa18BG42mJaD3PgdWTipKKgW2tVVQG3U43d6EQv-h2eADYgzS5WOqHVcebtanK9cR7b06Gr9qE9tQyPKAt8dZxmdQbv7ThNBXsW9eroQ1rUfiF"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a160a] via-[#102210]/80 to-[#102210]/40"></div>
        
        <div className="relative z-10 max-w-lg p-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary shadow-[0_0_30px_-5px_rgba(19,236,19,0.3)]">
              <span className="material-symbols-outlined text-5xl">domain_add</span>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold tracking-tight text-white mb-6">Partner with LifeLine</h2>
          <p className="text-[#9db99d] text-lg leading-relaxed">
            Join the largest network of connected emergency care providers. Streamline patient intake and manage bed availability in real-time.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-4 text-center border-t border-[#3b543b] pt-8">
            <div>
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-xs text-[#9db99d] uppercase tracking-wider mt-1">Support</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-xs text-[#9db99d] uppercase tracking-wider mt-1">Hospitals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">0s</div>
              <div className="text-xs text-[#9db99d] uppercase tracking-wider mt-1">Latency</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-7/12 lg:ml-auto flex flex-col min-h-screen bg-[#0a160a] relative overflow-y-auto">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none invert" 
          style={{
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
          }}
        ></div>

        <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 relative z-10 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <svg 
                  className="w-6 h-6" 
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
              <h2 className="text-white text-2xl font-bold leading-tight tracking-tight">
                LifeLine<span className="text-primary italic ml-0.5">24x7</span>
              </h2>
            </div>
            
            <div>
              <h1 className="text-white tracking-tight text-3xl font-bold leading-tight mb-2">
                Register Hospital
              </h1>
              <p className="text-slate-400 text-base font-normal">
                Enter your facility details to create an administrative account.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Hospital Name */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="col-span-full">
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Hospital Name
                </label>
                <div className="relative group">
                  <input 
                    className="form-input block w-full rounded-xl border-slate-700 bg-[#162916] px-4 py-3.5 pl-11 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm shadow-black/20"
                    placeholder="e.g. Saint Mary's General Hospital"
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleChange}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">local_hospital</span>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <input 
                    className="form-input block w-full rounded-xl border-slate-700 bg-[#162916] px-4 py-3.5 pl-11 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm shadow-black/20"
                    placeholder="admin@hospital.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                </div>
              </div>

              {/* Contact Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Contact Number
                </label>
                <div className="relative group">
                  <input 
                    className="form-input block w-full rounded-xl border-slate-700 bg-[#162916] px-4 py-3.5 pl-11 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm shadow-black/20"
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">call</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-[#122412] p-5 rounded-2xl border border-slate-800 shadow-sm shadow-black/20">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-slate-300">
                  Hospital Address
                </label>
                <div className="flex gap-4">
                  <button 
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-green-400 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors"
                    type="button"
                    onClick={handleUseCurrentLocation}
                  >
                    <span className="material-symbols-outlined text-[16px]">my_location</span> 
                    Use Current
                  </button>
                  <button 
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-2 py-1 rounded-md transition-colors"
                    type="button"
                    onClick={handleSelectOnMap}
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span> 
                    Select on Map
                  </button>
                </div>
              </div>
              <div className="relative group">
                <textarea 
                  className="form-textarea block w-full rounded-xl border-slate-700 bg-[#1a301a] px-4 py-3 text-white placeholder:text-slate-500 focus:bg-[#162916] focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                  placeholder="Street Address, City, State, Zip Code"
                  rows={2}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            {/* Bed Availability */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                Bed Availability Setup
              </label>
              <div className="grid grid-cols-3 gap-4">
                {/* ICU Beds */}
                <div className="relative group">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                    ICU Beds
                  </label>
                  <div className="relative">
                    <input 
                      className="form-input block w-full rounded-xl border-slate-700 bg-[#162916] px-3 py-3 pl-10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm shadow-black/20 font-semibold"
                      placeholder="00"
                      type="number"
                      name="icuBeds"
                      value={formData.icuBeds}
                      onChange={handleChange}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">monitor_heart</span>
                    </div>
                  </div>
                </div>

                {/* HDU Beds */}
                <div className="relative group">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                    HDU Beds
                  </label>
                  <div className="relative">
                    <input 
                      className="form-input block w-full rounded-xl border-slate-700 bg-[#162916] px-3 py-3 pl-10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm shadow-black/20 font-semibold"
                      placeholder="00"
                      type="number"
                      name="hduBeds"
                      value={formData.hduBeds}
                      onChange={handleChange}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">vital_signs</span>
                    </div>
                  </div>
                </div>

                {/* General Beds */}
                <div className="relative group">
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">
                    General Beds
                  </label>
                  <div className="relative">
                    <input 
                      className="form-input block w-full rounded-xl border-slate-700 bg-[#162916] px-3 py-3 pl-10 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm shadow-black/20 font-semibold"
                      placeholder="00"
                      type="number"
                      name="generalBeds"
                      value={formData.generalBeds}
                      onChange={handleChange}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors pointer-events-none">
                      <span className="material-symbols-outlined text-[20px]">ward</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid gap-6 md:grid-cols-2 pt-2">
              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Set Password
                </label>
                <div className="relative group">
                  <input 
                    className="form-input block w-full rounded-xl border-slate-700 bg-[#162916] px-4 py-3.5 pl-11 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm shadow-black/20"
                    placeholder="••••••••"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative group">
                  <input 
                    className="form-input block w-full rounded-xl border-slate-700 bg-[#162916] px-4 py-3.5 pl-11 text-white placeholder:text-slate-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm shadow-black/20"
                    placeholder="••••••••"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 pb-6">
              <button 
                type="submit"
                className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-5 bg-primary hover:bg-[#3bf03b] active:scale-[0.98] transition-all text-[#102210] text-lg font-bold leading-normal tracking-wide shadow-lg shadow-green-900/40 hover:shadow-green-900/60"
              >
                <span className="truncate">Complete Registration</span>
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center pb-8">
            <p className="text-slate-400 text-sm">
              Already registered? 
              <Link to="/login" className="text-primary font-bold hover:underline ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
