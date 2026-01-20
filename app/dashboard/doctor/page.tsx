'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DoctorDashboard() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('Welcome');
  const [email, setEmail] = useState('');
  const [showPatients, setShowPatients] = useState(false);
  const [showAppointments, setShowAppointments] = useState(false);
  const [showConsultations, setShowConsultations] = useState(false);
  const [showPrescriptions, setShowPrescriptions] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl transform -translate-x-full lg:translate-x-0 transition-transform z-50">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-teal-600">🏥 SanjeevniAI</h1>
          <p className="text-sm text-gray-600 mt-1">Doctor Portal</p>
        </div>

        <nav className="p-4 space-y-2">
          <a href="/dashboard/doctor" className="flex items-center gap-3 px-4 py-3 bg-teal-50 text-teal-600 rounded-xl font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </a>
          <button onClick={() => setShowPatients(!showPatients)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            My Patients
          </button>
          <button onClick={() => setShowAppointments(!showAppointments)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Appointments
          </button>
          <button onClick={() => setShowConsultations(!showConsultations)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Consultations
          </button>
          <button onClick={() => setShowPrescriptions(!showPrescriptions)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors w-full">
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
      <main className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button className="lg:hidden" onClick={() => document.getElementById('sidebar')?.classList.toggle('-translate-x-full')}>
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Doctor</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{email}</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
              {greeting}, Doctor!
            </h1>
            <p className="text-gray-600">{email}</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Patients */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-6 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">247</div>
              <div className="text-sm opacity-90">Total Patients</div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">12</div>
              <div className="text-sm opacity-90">Today's Appointments</div>
            </div>

            {/* Consultations */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">34</div>
              <div className="text-sm opacity-90">This Week</div>
            </div>

            {/* Revenue */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">₹45,230</div>
              <div className="text-sm opacity-90">This Month</div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Schedule</h2>
            <div className="space-y-4">
              {/* Appointment 1 */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    RS
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Rajesh Sharma</h3>
                    <p className="text-sm text-gray-600">General Checkup</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">10:00 AM</p>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Upcoming</span>
                </div>
              </div>

              {/* Appointment 2 */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-600 font-bold">
                    PK
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Priya Kumar</h3>
                    <p className="text-sm text-gray-600">Follow-up Consultation</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">11:30 AM</p>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Upcoming</span>
                </div>
              </div>

              {/* Appointment 3 */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-600 font-bold">
                    AV
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Amit Verma</h3>
                    <p className="text-sm text-gray-600">Prescription Review</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-600">2:00 PM</p>
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Upcoming</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add Consultation */}
            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">New Consultation</h3>
              <p className="text-gray-600 text-sm">Add a new patient consultation</p>
            </div>

            {/* Write Prescription */}
            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Write Prescription</h3>
              <p className="text-gray-600 text-sm">Create digital prescriptions</p>
            </div>

            {/* View Reports */}
            <div className="bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Patient Reports</h3>
              <p className="text-gray-600 text-sm">View medical records & reports</p>
            </div>
          </div>

          {/* My Patients Section */}
          {showPatients && (
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">My Patients</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Rajesh Sharma', age: 45, condition: 'Hypertension', lastVisit: '15 Jan 2026', status: 'Stable' },
                  { name: 'Priya Kumar', age: 32, condition: 'Diabetes Type 2', lastVisit: '18 Jan 2026', status: 'Monitoring' },
                  { name: 'Amit Verma', age: 55, condition: 'Heart Disease', lastVisit: '10 Jan 2026', status: 'Critical' },
                  { name: 'Sunita Patel', age: 28, condition: 'Asthma', lastVisit: '19 Jan 2026', status: 'Stable' },
                  { name: 'Rahul Singh', age: 38, condition: 'Migraine', lastVisit: '17 Jan 2026', status: 'Improving' },
                  { name: 'Anjali Gupta', age: 42, condition: 'Thyroid', lastVisit: '16 Jan 2026', status: 'Stable' }
                ].map((patient, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg transition-all">
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
          {showAppointments && (
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">All Appointments</h2>
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
          {showConsultations && (
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Recent Consultations</h2>
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
                  <div key={idx} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg transition-all">
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
          {showPrescriptions && (
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Recent Prescriptions</h2>
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
                  <div key={idx} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 hover:shadow-lg transition-all">
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
        </div>
      </main>
    </div>
  );
}
