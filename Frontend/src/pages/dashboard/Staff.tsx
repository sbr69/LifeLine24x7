import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { staffMembers, staffStats } from '../../components/assets/staffData';

const Staff: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          staff.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || 
                        (filterRole === 'Doctors' && staff.role.includes('Dr.')) ||
                        (filterRole === 'Nurses' && (staff.role.includes('Nurse') || staff.role.includes('Care'))) ||
                        (filterRole === 'Admin' && !staff.role.includes('Dr.') && !staff.role.includes('Nurse'));
    
    return matchesSearch && matchesRole;
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
        <div className="relative z-10 p-8">
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Staff Management</h1>
              <p className="text-sm text-[#9db99d] mt-1">Manage hospital staff, roles, and duty schedules.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-full bg-[#1c271c] border border-[#3b543b] px-4 py-2.5 text-sm font-medium text-[#9db99d] hover:text-white hover:border-[#13ec13] hover:bg-[#13ec13]/5 transition-all">
                <span className="material-symbols-outlined text-lg">download</span>
                Export List
              </button>
              <button 
                onClick={() => navigate('/new-staff')}
                className="flex items-center gap-2 rounded-full bg-[#13ec13] px-6 py-3 text-sm font-bold text-[#111811] hover:bg-[#3bf03b] shadow-[0_0_20px_rgba(19,236,19,0.4)] hover:shadow-[0_0_30px_rgba(19,236,19,0.6)] hover:scale-105 transition-all duration-300"
              >
                <span className="material-symbols-outlined text-xl">person_add</span>
                Add New Staff
              </button>
            </div>
          </header>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg hover:border-[#13ec13]/30 transition-colors group">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400 border border-blue-500/20 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  Total Active
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white">{staffStats.totalStaff}</h3>
              <p className="text-sm font-medium text-[#9db99d] mt-1">Total Staff Members</p>
            </div>
            <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg hover:border-[#13ec13]/30 transition-colors group">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-[#13ec13]/10 p-3 text-[#13ec13] border border-[#13ec13]/20 group-hover:shadow-[0_0_15px_rgba(19,236,19,0.2)] transition-all">
                  <span className="material-symbols-outlined">how_to_reg</span>
                </div>
                <span className="flex items-center gap-2 text-xs font-medium text-[#13ec13]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ec13] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#13ec13]"></span>
                  </span>
                  Live Status
                </span>
              </div>
              <h3 className="text-4xl font-bold text-white">{staffStats.onDuty}</h3>
              <p className="text-sm font-medium text-[#9db99d] mt-1">On Duty Now</p>
            </div>
            <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg hover:border-[#13ec13]/30 transition-colors group">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400 border border-purple-500/20 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all">
                  <span className="material-symbols-outlined">stethoscope</span>
                </div>
                <span className="text-xs font-medium text-[#9db99d]">Specialists</span>
              </div>
              <h3 className="text-4xl font-bold text-white">{staffStats.doctors.count}</h3>
              <p className="text-sm font-medium text-[#9db99d] mt-1">Doctors</p>
              <div className="mt-4 h-1.5 w-full rounded-full bg-[#152015]">
                <div className="h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{width: `${staffStats.doctors.percentage}%`}}></div>
              </div>
            </div>
            <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] p-6 shadow-lg hover:border-[#13ec13]/30 transition-colors group">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400 border border-orange-500/20 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all">
                  <span className="material-symbols-outlined">medication_liquid</span>
                </div>
                <span className="text-xs font-medium text-[#9db99d]">Care Team</span>
              </div>
              <h3 className="text-4xl font-bold text-white">{staffStats.nurses.count}</h3>
              <p className="text-sm font-medium text-[#9db99d] mt-1">Nursing Staff</p>
              <div className="mt-4 h-1.5 w-full rounded-full bg-[#152015]">
                <div className="h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" style={{width: `${staffStats.nurses.percentage}%`}}></div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#3b543b]/50 bg-[#1c271c] overflow-hidden w-full shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#3b543b]/50 p-6 gap-4">
              <h3 className="font-bold text-white text-lg">Staff Directory</h3>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9db99d]">
                    <span className="material-symbols-outlined text-[18px]">search</span>
                  </span>
                  <input 
                    className="h-9 rounded-xl border border-[#3b543b] bg-[#152015] pl-10 pr-4 text-sm font-medium text-white placeholder-[#9db99d] focus:border-[#13ec13] focus:outline-none focus:ring-0 focus:shadow-[0_0_15px_rgba(19,236,19,0.1)] w-full sm:w-64 transition-all" 
                    placeholder="Search by Name, Role or ID" 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="h-8 w-px bg-[#3b543b] mx-1 hidden sm:block"></div>
                <div className="flex bg-[#152015] p-1 rounded-lg border border-[#3b543b]">
                  <button 
                    onClick={() => setFilterRole('All')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filterRole === 'All' ? 'bg-[#13ec13]/10 text-[#13ec13] border border-[#13ec13]/20' : 'text-[#9db99d] hover:text-white'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setFilterRole('Doctors')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filterRole === 'Doctors' ? 'bg-[#13ec13]/10 text-[#13ec13] border border-[#13ec13]/20' : 'text-[#9db99d] hover:text-white'}`}
                  >
                    Doctors
                  </button>
                  <button 
                    onClick={() => setFilterRole('Nurses')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filterRole === 'Nurses' ? 'bg-[#13ec13]/10 text-[#13ec13] border border-[#13ec13]/20' : 'text-[#9db99d] hover:text-white'}`}
                  >
                    Nurses
                  </button>
                  <button 
                    onClick={() => setFilterRole('Admin')}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${filterRole === 'Admin' ? 'bg-[#13ec13]/10 text-[#13ec13] border border-[#13ec13]/20' : 'text-[#9db99d] hover:text-white'}`}
                  >
                    Admin
                  </button>
                </div>
                <button className="flex items-center justify-center h-9 w-9 rounded-lg border border-[#3b543b] bg-[#152015] text-[#9db99d] hover:text-white hover:bg-[#1c271c] transition-colors">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#152015] text-xs uppercase text-[#9db99d]">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Staff Member</th>
                    <th className="px-6 py-4 font-semibold">Role & Department</th>
                    <th className="px-6 py-4 font-semibold">Contact</th>
                    <th className="px-6 py-4 font-semibold">Shift Timing</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3b543b]/30">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="group hover:bg-[#13ec13]/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {staff.image ? (
                            <div className="h-10 w-10 rounded-full bg-[#152015] overflow-hidden ring-2 ring-transparent group-hover:ring-[#13ec13]/50 transition-all">
                              <img alt={staff.name} className="h-full w-full object-cover" src={staff.image} />
                            </div>
                          ) : (
                            <div className={`h-10 w-10 rounded-full ${staff.initialsColor} flex items-center justify-center text-sm font-bold ring-2 ring-transparent group-hover:ring-[#13ec13]/50 transition-all`}>
                              {staff.initials}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{staff.name}</div>
                            <div className="text-xs text-[#9db99d] font-mono tracking-wide">ID: {staff.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{staff.role}</div>
                        <div className="text-xs text-[#9db99d]">{staff.department}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-[#9db99d]">
                            <span className="material-symbols-outlined text-[14px]">mail</span>
                            {staff.email}
                          </div>
                          {staff.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-[#9db99d]">
                              <span className="material-symbols-outlined text-[14px]">call</span>
                              {staff.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-lg bg-[#152015] px-2.5 py-1 text-xs font-medium text-[#9db99d] border border-[#3b543b]`}>
                          <span className={`material-symbols-outlined text-[14px] ${staff.status === 'On Leave' ? 'text-yellow-500' : staff.status === 'Off Duty' ? 'text-[#9db99d]' : 'text-[#13ec13]'}`}>
                            {staff.status === 'On Leave' ? 'event_busy' : 'schedule'}
                          </span>
                          {staff.schedule}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                          staff.status === 'On Duty' 
                            ? 'bg-[#13ec13]/10 text-[#13ec13] border-[#13ec13]/20' 
                            : staff.status === 'On Leave'
                              ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                              : 'bg-[#152015] text-[#9db99d] border-[#3b543b]'
                        }`}>
                          <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                            staff.status === 'On Duty' 
                              ? 'bg-[#13ec13]' 
                              : staff.status === 'On Leave'
                                ? 'bg-yellow-500'
                                : 'bg-[#9db99d]'
                          }`}></span>
                          {staff.status === 'On Leave' ? 'Leave' : staff.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button className="h-8 w-8 rounded-lg bg-[#152015] border border-[#3b543b] flex items-center justify-center text-[#9db99d] hover:text-white hover:border-[#13ec13]/50 transition-all">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button className="h-8 w-8 rounded-lg bg-[#152015] border border-[#3b543b] flex items-center justify-center text-[#9db99d] hover:text-[#13ec13] hover:border-[#13ec13]/50 transition-all">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#3b543b]/50 bg-[#152015] px-6 py-4">
              <div className="text-xs text-[#9db99d]">
                Showing <span className="font-semibold text-white">1</span> to <span className="font-semibold text-white">{filteredStaff.length}</span> of <span className="font-semibold text-white">{staffStats.totalStaff}</span> staff members
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg border border-[#3b543b] bg-[#1c271c] px-3 py-1.5 text-xs font-medium text-[#9db99d] hover:bg-[#13ec13]/5 hover:text-white hover:border-[#13ec13] disabled:opacity-50 transition-all" disabled>Previous</button>
                <button className="rounded-lg border border-[#3b543b] bg-[#1c271c] px-3 py-1.5 text-xs font-medium text-[#9db99d] hover:bg-[#13ec13]/5 hover:text-white hover:border-[#13ec13] transition-all">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Staff;
