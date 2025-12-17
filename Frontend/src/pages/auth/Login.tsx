import React, { useState } from 'react';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement login logic here
      console.log('Login credentials:', credentials);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen w-full overflow-hidden ${isDarkMode ? 'bg-[#111811]' : 'bg-white'}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-full transition-all shadow-lg ${
          isDarkMode 
            ? 'bg-[#1c271c] border border-[#3b543b] text-[#13ec13] hover:bg-[#152015]' 
            : 'bg-white border border-slate-200 text-primary hover:bg-slate-50'
        }`}
        aria-label="Toggle theme"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isDarkMode ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          )}
        </svg>
      </button>

      {/* Left Side: Visual Hero */}
      <div className={`hidden lg:flex lg:w-1/2 relative ${isDarkMode ? 'bg-[#102210]' : 'bg-emerald-50'} items-center justify-center overflow-hidden`}>
        {/* Background Image */}
        <img
          className={`absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-2000 ${
            isDarkMode ? 'opacity-70 mix-blend-overlay grayscale' : 'opacity-50 mix-blend-multiply'
          }`}
          src="/src/components/assets/loginBg.png"
          alt="Abstract blurry hospital corridor with medical lighting"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${
          isDarkMode ? 'from-[#111811] via-[#111811]/30 to-transparent' : 'from-emerald-50 via-emerald-50/30 to-transparent'
        }`}></div>
        <div className="relative z-10 max-w-lg p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className={`flex h-20 w-20 items-center justify-center rounded-full backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-[#13ec13]/10 border border-[#13ec13]/20 text-[#13ec13]' 
                : 'bg-white/60 border border-green-600/20 text-green-600 shadow-sm'
            }`}>
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <h2 className={`text-4xl font-bold tracking-tight mb-4 ${
            isDarkMode ? 'text-white' : 'text-emerald-950'
          }`}>Dedicated to Your Health</h2>
          <p className={`text-lg leading-relaxed ${
            isDarkMode ? 'text-[#9db99d]' : 'text-emerald-700'
          }`}>
            Secure access for medical professionals. Manage patient records, schedules, and vital data with our encrypted portal.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className={`w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-12 relative ${
        isDarkMode ? 'bg-[#111811]' : 'bg-white'
      }`}>
        <div className="w-full max-w-[480px] flex flex-col gap-2 relative z-10">
          {/* Logo & Header */}
          <div className="mb-8 flex flex-col gap-6">
            <div className={`flex items-center gap-4 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm ${
                isDarkMode 
                  ? 'bg-[#13ec13]/10 border-[#13ec13]/20 text-[#13ec13]' 
                  : 'bg-emerald-50 border-green-600/20 text-green-600 shadow-[0_0_15px_-3px_rgba(22,163,74,0.3)]'
              }`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
              </div>
              <h2 className={`text-3xl font-bold leading-tight tracking-[-0.015em] ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                LifeLine<span className={isDarkMode ? 'text-[#13ec13]' : 'text-green-600'} style={{ fontStyle: 'italic', marginLeft: '0.125rem' }}>24x7</span>
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className={`tracking-light text-[32px] font-bold leading-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>Welcome Back</h1>
              <p className={`text-sm font-normal leading-normal ${
                isDarkMode ? 'text-[#9db99d]' : 'text-slate-500'
              }`}>Please enter your credentials to access patient records.</p>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Input */}
            <label className="flex flex-col w-full group">
              <p className={`text-base font-medium leading-normal pb-2 transition-colors ${
                isDarkMode 
                  ? 'text-white group-focus-within:text-[#13ec13]' 
                  : 'text-slate-700 group-focus-within:text-green-600'
              }`}>
                Mail
              </p>
              <div className="relative">
                <input
                  className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-0 border h-14 px-4 py-4 pl-12 text-base font-normal leading-normal transition-all ${
                    isDarkMode 
                      ? 'text-white border-[#3b543b] bg-[#1c271c] focus:border-[#13ec13] focus:bg-[#152015] placeholder:text-[#9db99d]' 
                      : 'text-slate-900 border-slate-200 bg-slate-50 focus:border-green-600 focus:bg-white placeholder:text-slate-400'
                  }`}
                  placeholder="mail@hospital.domain"
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  isDarkMode 
                    ? 'text-[#9db99d] group-focus-within:text-[#13ec13]' 
                    : 'text-slate-400 group-focus-within:text-green-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </label>

            {/* Password Input */}
            <label className="flex flex-col w-full group">
              <div className="flex justify-between items-center pb-2">
                <p className={`text-base font-medium leading-normal transition-colors ${
                  isDarkMode 
                    ? 'text-white group-focus-within:text-[#13ec13]' 
                    : 'text-slate-700 group-focus-within:text-green-600'
                }`}>
                  Password
                </p>
                <a className={`text-sm font-medium hover:underline ${
                  isDarkMode 
                    ? 'text-[#13ec13] hover:text-[#3bf03b]' 
                    : 'text-green-600 hover:text-green-700'
                }`} href="#">
                  Forgot Password?
                </a>
              </div>
              <div className="flex w-full flex-1 items-stretch rounded-xl relative">
                <input
                  className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl focus:outline-0 focus:ring-0 border h-14 px-4 py-4 pl-12 pr-12 text-base font-normal leading-normal transition-all ${
                    isDarkMode 
                      ? 'text-white border-[#3b543b] bg-[#1c271c] focus:border-[#13ec13] focus:bg-[#152015] placeholder:text-[#9db99d]' 
                      : 'text-slate-900 border-slate-200 bg-slate-50 focus:border-green-600 focus:bg-white placeholder:text-slate-400'
                  }`}
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
                {/* Leading Icon */}
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                  isDarkMode 
                    ? 'text-[#9db99d] group-focus-within:text-[#13ec13]' 
                    : 'text-slate-400 group-focus-within:text-green-600'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                {/* Trailing Icon (Show/Hide) */}
                <button
                  className={`absolute right-0 top-0 h-full px-4 flex items-center justify-center focus:outline-none transition-colors ${
                    isDarkMode 
                      ? 'text-[#9db99d] hover:text-white' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
            </label>

            {/* Login Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 active:scale-[0.98] transition-all text-base font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode 
                    ? 'bg-[#13ec13] hover:bg-[#3bf03b] text-[#111811] shadow-[0_0_20px_rgba(19,236,19,0.2)] hover:shadow-[0_0_30px_rgba(19,236,19,0.4)]' 
                    : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)]'
                }`}
              >
                <span className="truncate">{isLoading ? 'Logging in...' : 'Login'}</span>
              </button>
            </div>
          </form>

          {/* Footer / Sign Up */}
          <div className="mt-8 text-center">
            <p className={`text-sm ${
              isDarkMode ? 'text-[#9db99d]' : 'text-slate-500'
            }`}>
              Don't have an account?
              <a className={`font-bold hover:underline ml-1 ${
                isDarkMode ? 'text-[#13ec13]' : 'text-green-600'
              }`} href="#">
                Register
              </a>
            </p>
            <div className={`mt-8 flex justify-center gap-6 ${
              isDarkMode ? 'opacity-50' : 'opacity-70'
            }`}>
              <a className={`transition-colors text-xs ${
                isDarkMode ? 'text-[#9db99d] hover:text-white' : 'text-slate-400 hover:text-slate-600'
              }`} href="#">
                Privacy Policy
              </a>
              <a className={`transition-colors text-xs ${
                isDarkMode ? 'text-[#9db99d] hover:text-white' : 'text-slate-400 hover:text-slate-600'
              }`} href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
