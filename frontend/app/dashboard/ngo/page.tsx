'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SectionType = 'dashboard' | 'campaigns' | 'beneficiaries' | 'donations' | 'volunteers';

export default function NGODashboard() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('Welcome');
  const [email, setEmail] = useState('');
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
  const [expandedCampaign, setExpandedCampaign] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check authentication
    const userEmail = localStorage.getItem('userEmail');
    const selectedRole = localStorage.getItem('selectedRole');
    
    if (!userEmail || selectedRole !== 'NGO') {
      router.push('/login');
      return;
    }

    setEmail(userEmail);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Good Morning');
    else if (hour >= 12 && hour < 17) setGreeting('Good Afternoon');
    else if (hour >= 17 && hour < 22) setGreeting('Good Evening');
    else setGreeting('Good Night');
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}} />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl transform -translate-x-full lg:translate-x-0 transition-transform z-50">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-teal-600">🏥 SanjeevniAI</h1>
          <p className="text-sm text-gray-600 mt-1">NGO Portal</p>
        </div>

        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveSection('dashboard')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'dashboard' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Mission Control
          </button>
          <button 
            onClick={() => setActiveSection('campaigns')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'campaigns' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
            </svg>
            Campaign Manager
          </button>
          <button 
            onClick={() => setActiveSection('beneficiaries')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'beneficiaries' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Beneficiary Registry
          </button>
          <button 
            onClick={() => setActiveSection('donations')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'donations' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Funding Tracker
          </button>
          <button 
            onClick={() => setActiveSection('volunteers')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'volunteers' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            Volunteer Coordination
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors w-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            {greeting}!
          </h1>
          <p className="text-gray-600">Medical assistance and community health management hub</p>
        </div>

        {/* Dashboard View (Mission Control) */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            {/* Clickable Glassmorphism Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Active Campaigns Card */}
              <button 
                onClick={() => setActiveSection('campaigns')}
                className="group relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white bg-opacity-30 border border-white border-opacity-40 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.35) 0%, rgba(6, 182, 212, 0.35) 100%)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white bg-opacity-40 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-teal-900">8</div>
                  <div className="text-sm font-medium text-teal-800 opacity-90">Active Campaigns</div>
                  <div className="mt-3 text-xs text-teal-700 flex items-center gap-1">
                    <span>Manage Campaigns</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Total Beneficiaries Card */}
              <button 
                onClick={() => setActiveSection('beneficiaries')}
                className="group relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white bg-opacity-30 border border-white border-opacity-40 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.35) 100%)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white bg-opacity-40 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-green-900">1,543</div>
                  <div className="text-sm font-medium text-green-800 opacity-90">Total Beneficiaries</div>
                  <div className="mt-3 text-xs text-green-700 flex items-center gap-1">
                    <span>View Registry</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Funds This Month Card */}
              <button 
                onClick={() => setActiveSection('donations')}
                className="group relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white bg-opacity-30 border border-white border-opacity-40 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.35) 0%, rgba(8, 145, 178, 0.35) 100%)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white bg-opacity-40 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-cyan-900">₹3.2L</div>
                  <div className="text-sm font-medium text-cyan-800 opacity-90">This Month</div>
                  <div className="mt-3 text-xs text-cyan-700 flex items-center gap-1">
                    <span>View Breakdown</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Active Volunteers Card */}
              <button 
                onClick={() => setActiveSection('volunteers')}
                className="group relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white bg-opacity-30 border border-white border-opacity-40 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.35) 100%)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white bg-opacity-40 group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-emerald-900">156</div>
                  <div className="text-sm font-medium text-emerald-800 opacity-90">Active Volunteers</div>
                  <div className="mt-3 text-xs text-emerald-700 flex items-center gap-1">
                    <span>Coordinate Team</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Expandable Active Campaigns */}
            <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Active Campaigns
              </h2>
              <div className="space-y-3">
                {[
                  { id: 1, name: 'Free Health Checkup Camp', beneficiaries: 245, status: 'Active', endDate: 'Ends in 5 days', color: 'teal', location: 'Rajiv Gandhi Hospital, Delhi', doctors: ['Dr. Sharma', 'Dr. Kumar'], medicines: 'Adequate Stock', outcome: '92% Satisfaction' },
                  { id: 2, name: 'Education Support Program', beneficiaries: 312, status: 'Ongoing', endDate: 'Ongoing', color: 'cyan', location: 'Multiple Schools, Mumbai', doctors: ['Health Educators'], medicines: 'N/A', outcome: '85% Attendance' },
                  { id: 3, name: 'Women Empowerment Drive', beneficiaries: 128, status: 'Active', endDate: 'Ends in 12 days', color: 'emerald', location: 'Community Center, Pune', doctors: ['Dr. Patel', 'Dr. Singh'], medicines: 'Basic Supplies', outcome: '78% Completion' }
                ].map((campaign) => (
                  <div key={campaign.id} className="group">
                    <button
                      onClick={() => setExpandedCampaign(expandedCampaign === campaign.id ? null : campaign.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-xl border-l-4 transition-all ${
                        campaign.color === 'teal' ? 'bg-teal-50 border-teal-500 hover:bg-teal-100' :
                        campaign.color === 'cyan' ? 'bg-cyan-50 border-cyan-500 hover:bg-cyan-100' :
                        'bg-emerald-50 border-emerald-500 hover:bg-emerald-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${
                          campaign.color === 'teal' ? 'bg-teal-500' :
                          campaign.color === 'cyan' ? 'bg-cyan-500' :
                          'bg-emerald-500'
                        }`}>
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-800 text-lg">{campaign.name}</h3>
                          <p className="text-sm text-gray-600">{campaign.beneficiaries} beneficiaries served</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            campaign.color === 'teal' ? 'bg-teal-100 text-teal-700' :
                            campaign.color === 'cyan' ? 'bg-cyan-100 text-cyan-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {campaign.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">{campaign.endDate}</p>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedCampaign === campaign.id ? 'rotate-90' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </button>

                    {/* Expandable Campaign Details Drawer */}
                    {expandedCampaign === campaign.id && (
                      <div className="mt-2 p-6 bg-white rounded-xl border-2 border-teal-200 shadow-lg animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Campaign Info */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              </svg>
                              Campaign Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-gray-600"><span className="font-medium text-gray-800">Location:</span> {campaign.location}</p>
                              <p className="text-gray-600"><span className="font-medium text-gray-800">Doctors on Duty:</span> {campaign.doctors.join(', ')}</p>
                              <p className="text-gray-600"><span className="font-medium text-gray-800">Medicine Inventory:</span> {campaign.medicines}</p>
                              <p className="text-gray-600"><span className="font-medium text-gray-800">Outcome:</span> {campaign.outcome}</p>
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                              </svg>
                              Quick Actions
                            </h4>
                            <div className="space-y-2">
                              <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                View Full Schedule
                              </button>
                              <button className="w-full bg-white border-2 border-teal-300 text-teal-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                                View Analytics
                              </button>
                              <button className="w-full bg-white border-2 border-gray-300 text-gray-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                Manage Campaign
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button 
                onClick={() => setActiveSection('campaigns')}
                className="group backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-6 shadow-xl border border-white border-opacity-50 hover:shadow-2xl hover:scale-105 transition-all text-left"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Create Campaign</h3>
                <p className="text-gray-600 text-sm">Launch new health camp or program</p>
              </button>

              <button 
                onClick={() => setActiveSection('beneficiaries')}
                className="group backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-6 shadow-xl border border-white border-opacity-50 hover:shadow-2xl hover:scale-105 transition-all text-left"
              >
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Add Beneficiary</h3>
                <p className="text-gray-600 text-sm">Register new beneficiary profile</p>
              </button>

              <button 
                onClick={() => setActiveSection('donations')}
                className="group backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-6 shadow-xl border border-white border-opacity-50 hover:shadow-2xl hover:scale-105 transition-all text-left"
              >
                <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Impact Report</h3>
                <p className="text-gray-600 text-sm">View detailed analytics and outcomes</p>
              </button>
            </div>
          </div>
        )}

        {/* Campaign Manager Section */}
        {activeSection === 'campaigns' && (
          <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Campaign Manager
              </h2>
              <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Launch New Campaign
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Free Health Checkup Camp', beneficiaries: 245, status: 'Active', endDate: '26 Jan 2026', location: 'Delhi', doctors: 2, duration: '5 days left' },
                { name: 'Education Support Program', beneficiaries: 312, status: 'Ongoing', endDate: 'Continuous', location: 'Mumbai', doctors: 4, duration: 'Ongoing' },
                { name: 'Women Empowerment Drive', beneficiaries: 128, status: 'Active', endDate: '2 Feb 2026', location: 'Pune', doctors: 2, duration: '12 days left' },
                { name: 'Mobile Clinic - Rural Areas', beneficiaries: 89, status: 'Scheduled', endDate: '1 Feb 2026', location: 'Bihar', doctors: 3, duration: 'Starts in 11 days' }
              ].map((campaign, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white bg-opacity-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl">
                      🏥
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      campaign.status === 'Active' ? 'bg-green-100 text-green-600' :
                      campaign.status === 'Scheduled' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {campaign.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{campaign.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <p><span className="font-medium text-gray-800">Location:</span> {campaign.location}</p>
                    <p><span className="font-medium text-gray-800">Beneficiaries:</span> {campaign.beneficiaries}</p>
                    <p><span className="font-medium text-gray-800">Doctors:</span> {campaign.doctors}</p>
                    <p><span className="font-medium text-gray-800">Timeline:</span> {campaign.duration}</p>
                  </div>
                  <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    Manage Campaign
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beneficiary Registry Section */}
        {activeSection === 'beneficiaries' && (
          <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Beneficiary Registry
              </h2>
              <div className="flex gap-3">
                <input 
                  type="text"
                  placeholder="Search beneficiaries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Add Beneficiary
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Rajesh Kumar', age: 52, condition: 'Diabetes Screening', lastVisit: '18 Jan 2026', status: 'Follow-up Due', risk: 'Medium' },
                { name: 'Priya Sharma', age: 38, condition: 'Hypertension Checkup', lastVisit: '19 Jan 2026', status: 'Stable', risk: 'Low' },
                { name: 'Amit Patel', age: 65, condition: 'Cardiac Assessment', lastVisit: '15 Jan 2026', status: 'High Risk', risk: 'High' },
                { name: 'Sunita Devi', age: 45, condition: 'General Checkup', lastVisit: '20 Jan 2026', status: 'Healthy', risk: 'Low' },
                { name: 'Ramesh Singh', age: 58, condition: 'Eye Screening', lastVisit: '17 Jan 2026', status: 'Treatment Ongoing', risk: 'Medium' },
                { name: 'Lakshmi Reddy', age: 42, condition: 'Nutrition Assessment', lastVisit: '16 Jan 2026', status: 'Follow-up Due', risk: 'Low' }
              ].map((beneficiary, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white bg-opacity-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {beneficiary.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      beneficiary.risk === 'High' ? 'bg-red-100 text-red-600' :
                      beneficiary.risk === 'Medium' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      {beneficiary.risk} Risk
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{beneficiary.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">Age: {beneficiary.age} • {beneficiary.condition}</p>
                  <p className="text-xs text-gray-500 mb-2">Last Visit: {beneficiary.lastVisit}</p>
                  <p className="text-xs font-semibold text-teal-600 mb-4">{beneficiary.status}</p>
                  <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    View Health Record
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Funding Tracker Section */}
        {activeSection === 'donations' && (
          <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Funding Tracker
              </h2>
              <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Record Donation
              </button>
            </div>
            
            {/* Monthly Breakdown */}
            <div className="mb-8 p-6 backdrop-blur-xl bg-white bg-opacity-50 rounded-2xl border border-teal-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                January 2026 Allocation
              </h3>
              <div className="space-y-4">
                {[
                  { category: 'Health Camps', amount: '₹1,85,000', percentage: 58, color: 'teal' },
                  { category: 'Medicine Procurement', amount: '₹95,000', percentage: 30, color: 'cyan' },
                  { category: 'Logistics & Transport', amount: '₹40,000', percentage: 12, color: 'emerald' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">{item.category}</span>
                      <span className="text-sm font-bold text-gray-800">{item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          item.color === 'teal' ? 'bg-gradient-to-r from-teal-400 to-teal-600' :
                          item.color === 'cyan' ? 'bg-gradient-to-r from-cyan-400 to-cyan-600' :
                          'bg-gradient-to-r from-emerald-400 to-emerald-600'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Donations */}
            <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Recent Donations
            </h3>
            <div className="space-y-3">
              {[
                { donor: 'Anonymous', amount: '₹50,000', date: '20 Jan 2026', purpose: 'Health Camp Support' },
                { donor: 'Corporate CSR - Tech Corp', amount: '₹1,00,000', date: '18 Jan 2026', purpose: 'Medicine Procurement' },
                { donor: 'Individual Donor', amount: '₹25,000', date: '17 Jan 2026', purpose: 'General Fund' },
                { donor: 'Community Fundraiser', amount: '₹75,000', date: '15 Jan 2026', purpose: 'Mobile Clinic Setup' }
              ].map((donation, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-teal-50 rounded-xl border-l-4 border-teal-500">
                  <div>
                    <h4 className="font-semibold text-gray-800">{donation.donor}</h4>
                    <p className="text-sm text-gray-600">{donation.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-teal-600 text-lg">{donation.amount}</p>
                    <p className="text-xs text-gray-500">{donation.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer Coordination Section */}
        {activeSection === 'volunteers' && (
          <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Volunteer Coordination
              </h2>
              <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Add Volunteer
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Dr. Amit Sharma', role: 'Medical Doctor', availability: 'Full-time', tasks: 'Health Checkup Camp Lead', attendance: '95%' },
                { name: 'Priya Patel', role: 'Nurse', availability: 'Part-time', tasks: 'Patient Care Support', attendance: '88%' },
                { name: 'Rahul Kumar', role: 'Field Coordinator', availability: 'Full-time', tasks: 'Logistics Management', attendance: '92%' },
                { name: 'Sunita Singh', role: 'Health Educator', availability: 'Part-time', tasks: 'Awareness Programs', attendance: '85%' },
                { name: 'Vikram Reddy', role: 'Lab Technician', availability: 'Full-time', tasks: 'Testing & Diagnostics', attendance: '98%' },
                { name: 'Anjali Gupta', role: 'Counselor', availability: 'Part-time', tasks: 'Mental Health Support', attendance: '90%' }
              ].map((volunteer, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white bg-opacity-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {volunteer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      volunteer.availability === 'Full-time' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {volunteer.availability}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{volunteer.name}</h3>
                  <p className="text-sm font-semibold text-teal-600 mb-3">{volunteer.role}</p>
                  <div className="space-y-1 text-xs text-gray-600 mb-4">
                    <p><span className="font-medium text-gray-800">Current Task:</span> {volunteer.tasks}</p>
                    <p><span className="font-medium text-gray-800">Attendance:</span> {volunteer.attendance}</p>
                  </div>
                  <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    Assign Task
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
