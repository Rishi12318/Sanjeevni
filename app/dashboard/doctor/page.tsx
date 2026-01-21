'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type SectionType = 'dashboard' | 'patients' | 'appointments' | 'consultations' | 'prescriptions';

export default function DoctorDashboard() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('Welcome');
  const [email, setEmail] = useState('');
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
  const [expandedPatient, setExpandedPatient] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Check authentication
    const userEmail = localStorage.getItem('userEmail');
    const selectedRole = localStorage.getItem('selectedRole');
    
    if (!userEmail || selectedRole !== 'Doctor') {
      router.push('/login');
      return;
    }

    setEmail(userEmail);

    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
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
          <p className="text-sm text-gray-600 mt-1">Doctor Portal</p>
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
            Command Center
          </button>
          <button 
            onClick={() => setActiveSection('patients')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'patients' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Patient Registry
          </button>
          <button 
            onClick={() => setActiveSection('appointments')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'appointments' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Appointments
          </button>
          <button 
            onClick={() => setActiveSection('consultations')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'consultations' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Consultations
          </button>
          <button 
            onClick={() => setActiveSection('prescriptions')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full ${
              activeSection === 'prescriptions' 
                ? 'bg-teal-50 text-teal-600 border-l-4 border-teal-600' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Prescriptions
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
            {greeting}, Dr. {email.split('@')[0]}
          </h1>
          <p className="text-gray-600">Your professional command center for patient care</p>
        </div>

        {/* Dashboard View (Command Center) */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8">
            {/* Clickable Metric Cards with Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Patients Card */}
              <button 
                onClick={() => setActiveSection('patients')}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-teal-900">247</div>
                  <div className="text-sm font-medium text-teal-800 opacity-90">Total Patients</div>
                  <div className="mt-3 text-xs text-teal-700 flex items-center gap-1">
                    <span>View Registry</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Today's Appointments Card */}
              <button 
                onClick={() => setActiveSection('appointments')}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-green-900">12</div>
                  <div className="text-sm font-medium text-green-800 opacity-90">Today's Appointments</div>
                  <div className="mt-3 text-xs text-green-700 flex items-center gap-1">
                    <span>View Calendar</span>
                    <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              </button>

              {/* This Week Card */}
              <div 
                className="relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white bg-opacity-30 border border-white border-opacity-40"
                style={{
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.35) 0%, rgba(139, 92, 246, 0.35) 100%)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white bg-opacity-40">
                    <svg className="w-7 h-7 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-purple-900">34</div>
                  <div className="text-sm font-medium text-purple-800 opacity-90">This Week</div>
                </div>
              </div>

              {/* This Month Revenue Card */}
              <div 
                className="relative overflow-hidden rounded-3xl p-6 shadow-xl backdrop-blur-xl bg-white bg-opacity-30 border border-white border-opacity-40"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.35) 0%, rgba(234, 88, 12, 0.35) 100%)',
                  backdropFilter: 'blur(16px)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-20"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-white bg-opacity-40">
                    <svg className="w-7 h-7 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div className="text-4xl font-bold mb-2 text-orange-900">₹45,230</div>
                  <div className="text-sm font-medium text-orange-800 opacity-90">This Month</div>
                </div>
              </div>
            </div>

            {/* Interactive Today's Schedule */}
            <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Today's Schedule
              </h2>
              <div className="space-y-3">
                {[
                  { id: 1, name: 'Rajesh Sharma', type: 'General Checkup', time: '10:00 AM', status: 'Upcoming', color: 'teal', age: 45, phone: '+91 98765 43210', history: 'Hypertension (2 years)' },
                  { id: 2, name: 'Priya Kumar', type: 'Follow-up Consultation', time: '11:30 AM', status: 'Upcoming', color: 'cyan', age: 32, phone: '+91 98765 43211', history: 'Diabetes Type 2 (6 months)' },
                  { id: 3, name: 'Amit Verma', type: 'Prescription Review', time: '2:00 PM', status: 'Upcoming', color: 'blue', age: 55, phone: '+91 98765 43212', history: 'Post-cardiac surgery (3 months)' }
                ].map((appointment) => (
                  <div key={appointment.id} className="group">
                    <button
                      onClick={() => setExpandedPatient(expandedPatient === appointment.id ? null : appointment.id)}
                      className={`w-full flex items-center justify-between p-5 rounded-xl border-l-4 transition-all ${
                        appointment.color === 'teal' ? 'bg-teal-50 border-teal-500 hover:bg-teal-100' :
                        appointment.color === 'cyan' ? 'bg-cyan-50 border-cyan-500 hover:bg-cyan-100' :
                        'bg-blue-50 border-blue-500 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          appointment.color === 'teal' ? 'bg-teal-500' :
                          appointment.color === 'cyan' ? 'bg-cyan-500' :
                          'bg-blue-500'
                        }`}>
                          {appointment.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-800 text-lg">{appointment.name}</h3>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            appointment.color === 'teal' ? 'text-teal-600' :
                            appointment.color === 'cyan' ? 'text-cyan-600' :
                            'text-blue-600'
                          }`}>{appointment.time}</p>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            appointment.color === 'teal' ? 'bg-teal-100 text-teal-700' :
                            appointment.color === 'cyan' ? 'bg-cyan-100 text-cyan-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform ${expandedPatient === appointment.id ? 'rotate-90' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </button>

                    {/* Expandable Patient Details Drawer */}
                    {expandedPatient === appointment.id && (
                      <div className="mt-2 p-6 bg-white rounded-xl border-2 border-teal-200 shadow-lg animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Patient Info */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                              </svg>
                              Patient Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <p className="text-gray-600"><span className="font-medium text-gray-800">Age:</span> {appointment.age} years</p>
                              <p className="text-gray-600"><span className="font-medium text-gray-800">Phone:</span> {appointment.phone}</p>
                              <p className="text-gray-600"><span className="font-medium text-gray-800">Medical History:</span> {appointment.history}</p>
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
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                </svg>
                                Start Consultation
                              </button>
                              <button className="w-full bg-white border-2 border-teal-300 text-teal-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-teal-50 transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Reschedule
                              </button>
                              <button className="w-full bg-white border-2 border-gray-300 text-gray-600 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                View Medical Record
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
                onClick={() => setActiveSection('consultations')}
                className="group backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-6 shadow-xl border border-white border-opacity-50 hover:shadow-2xl hover:scale-105 transition-all text-left"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">New Consultation</h3>
                <p className="text-gray-600 text-sm">Start video consultation with patient</p>
              </button>

              <button 
                onClick={() => setActiveSection('prescriptions')}
                className="group backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-6 shadow-xl border border-white border-opacity-50 hover:shadow-2xl hover:scale-105 transition-all text-left"
              >
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Write Prescription</h3>
                <p className="text-gray-600 text-sm">Create digital prescriptions instantly</p>
              </button>

              <button 
                onClick={() => setActiveSection('patients')}
                className="group backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-6 shadow-xl border border-white border-opacity-50 hover:shadow-2xl hover:scale-105 transition-all text-left"
              >
                <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Patient Records</h3>
                <p className="text-gray-600 text-sm">Access medical histories and reports</p>
              </button>
            </div>
          </div>
        )}

        {/* Patient Registry Section */}
        {activeSection === 'patients' && (
          <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Patient Registry
              </h2>
              <div className="flex gap-3">
                <input 
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 rounded-xl border border-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all">
                  Add Patient
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Rajesh Sharma', age: 45, condition: 'Hypertension', lastVisit: '15 Jan 2026', status: 'Stable' },
                { name: 'Priya Kumar', age: 32, condition: 'Diabetes Type 2', lastVisit: '18 Jan 2026', status: 'Monitoring' },
                { name: 'Amit Verma', age: 55, condition: 'Heart Disease', lastVisit: '10 Jan 2026', status: 'Critical' },
                { name: 'Sunita Patel', age: 28, condition: 'Asthma', lastVisit: '19 Jan 2026', status: 'Stable' },
                { name: 'Rahul Singh', age: 38, condition: 'Migraine', lastVisit: '17 Jan 2026', status: 'Improving' },
                { name: 'Anjali Gupta', age: 42, condition: 'Thyroid', lastVisit: '16 Jan 2026', status: 'Stable' }
              ].map((patient, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white bg-opacity-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      patient.status === 'Stable' ? 'bg-green-100 text-green-600' :
                      patient.status === 'Critical' ? 'bg-red-100 text-red-600' :
                      patient.status === 'Monitoring' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{patient.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">Age: {patient.age} • {patient.condition}</p>
                  <p className="text-xs text-gray-500 mb-4">Last Visit: {patient.lastVisit}</p>
                  <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Appointments Section */}
        {activeSection === 'appointments' && (
          <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                All Appointments
              </h2>
              <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Schedule New
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Rajesh Sharma', time: '10:00 AM', type: 'General Checkup', date: '20 Jan', status: 'Confirmed' },
                { name: 'Priya Kumar', time: '11:30 AM', type: 'Follow-up', date: '20 Jan', status: 'Confirmed' },
                { name: 'Amit Verma', time: '2:00 PM', type: 'Prescription Review', date: '20 Jan', status: 'Confirmed' },
                { name: 'Sunita Patel', time: '3:30 PM', type: 'Consultation', date: '20 Jan', status: 'Pending' },
                { name: 'Rahul Singh', time: '10:00 AM', type: 'Follow-up', date: '21 Jan', status: 'Scheduled' },
                { name: 'Anjali Gupta', time: '11:00 AM', type: 'Routine Check', date: '21 Jan', status: 'Scheduled' }
              ].map((apt, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                  idx % 3 === 0 ? 'bg-teal-50 border-teal-500' :
                  idx % 3 === 1 ? 'bg-cyan-50 border-cyan-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                      idx % 3 === 0 ? 'bg-teal-400' :
                      idx % 3 === 1 ? 'bg-cyan-400' :
                      'bg-blue-400'
                    }`}>
                      {apt.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{apt.name}</h3>
                      <p className="text-sm text-gray-600">{apt.type} • {apt.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-semibold text-teal-600">{apt.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                        apt.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                        apt.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <button className="text-teal-600 hover:text-teal-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Consultations Section */}
        {activeSection === 'consultations' && (
          <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Recent Consultations
              </h2>
              <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                New Consultation
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'Rajesh Sharma', date: '19 Jan 2026', diagnosis: 'Hypertension - Stage 1', notes: 'Blood pressure: 145/92. Prescribed medication and lifestyle changes.', duration: '30 min' },
                { name: 'Priya Kumar', date: '18 Jan 2026', diagnosis: 'Diabetes Management', notes: 'HbA1c: 7.2%. Adjusted insulin dosage. Follow-up in 2 weeks.', duration: '45 min' },
                { name: 'Amit Verma', date: '17 Jan 2026', diagnosis: 'Post-cardiac checkup', notes: 'ECG normal. Cholesterol levels improving. Continue current medication.', duration: '35 min' },
                { name: 'Sunita Patel', date: '16 Jan 2026', diagnosis: 'Asthma Control', notes: 'Breathing improved. Inhaler technique corrected. Peak flow good.', duration: '25 min' }
              ].map((consult, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white bg-opacity-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg hover:scale-105 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{consult.name}</h3>
                      <p className="text-sm text-gray-600">{consult.date} • {consult.duration}</p>
                    </div>
                    <span className="bg-teal-100 text-teal-600 text-xs px-3 py-1 rounded-full font-semibold">
                      Completed
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Diagnosis:</p>
                    <p className="text-sm text-gray-800">{consult.diagnosis}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600">{consult.notes}</p>
                  </div>
                  <button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                    View Full Record
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prescriptions Section */}
        {activeSection === 'prescriptions' && (
          <div className="backdrop-blur-xl bg-white bg-opacity-40 rounded-3xl p-8 shadow-xl border border-white border-opacity-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Recent Prescriptions
              </h2>
              <button className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                Write New Prescription
              </button>
            </div>
            <div className="space-y-4">
              {[
                { patient: 'Rajesh Sharma', date: '19 Jan 2026', medicines: ['Amlodipine 5mg - Once daily', 'Aspirin 75mg - Once daily'], duration: '30 days', status: 'Active' },
                { patient: 'Priya Kumar', date: '18 Jan 2026', medicines: ['Metformin 500mg - Twice daily', 'Glimepiride 2mg - Before breakfast'], duration: '30 days', status: 'Active' },
                { patient: 'Amit Verma', date: '17 Jan 2026', medicines: ['Atorvastatin 10mg - Once daily at night', 'Clopidogrel 75mg - Once daily'], duration: '60 days', status: 'Active' },
                { patient: 'Sunita Patel', date: '16 Jan 2026', medicines: ['Salbutamol Inhaler - As needed', 'Montelukast 10mg - Once daily at night'], duration: '90 days', status: 'Active' }
              ].map((rx, idx) => (
                <div key={idx} className="backdrop-blur-xl bg-white bg-opacity-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{rx.patient}</h3>
                      <p className="text-sm text-gray-600">Prescribed on {rx.date}</p>
                    </div>
                    <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-semibold">
                      {rx.status}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Medicines:</p>
                    <ul className="space-y-1">
                      {rx.medicines.map((med, medIdx) => (
                        <li key={medIdx} className="text-sm text-gray-800 flex items-start gap-2">
                          <span className="text-teal-500">•</span>
                          <span>{med}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Duration: <span className="font-semibold text-gray-800">{rx.duration}</span></p>
                    <button className="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1">
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
