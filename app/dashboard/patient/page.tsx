'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface HealthMetric {
  title: string;
  percentage: number;
  status: string;
  color: string;
  icon: JSX.Element;
  chartData: number[];
}

export default function PatientDashboard() {
  const router = useRouter();
  const [greeting, setGreeting] = useState('Welcome');
  const [email, setEmail] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<HealthMetric | null>(null);
  const [showDoctors, setShowDoctors] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [chatInput, setChatInput] = useState('');

  const healthMetrics: HealthMetric[] = [
    {
      title: 'Physical Health',
      percentage: 78.2,
      status: 'Excellent condition',
      color: 'from-teal-500 to-teal-600',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      ),
      chartData: [65, 68, 72, 70, 75, 78, 78.2]
    },
    {
      title: 'Mental Health',
      percentage: 90.8,
      status: 'Very good state',
      color: 'from-indigo-500 to-indigo-600',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      ),
      chartData: [82, 85, 87, 88, 89, 90, 90.8]
    },
    {
      title: 'Overall Wellness',
      percentage: 84.5,
      status: 'Great progress!',
      color: 'from-purple-500 to-purple-600',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
        </svg>
      ),
      chartData: [73, 76, 79, 81, 83, 84, 84.5]
    }
  ];

  useEffect(() => {
    // Check authentication
    const userEmail = localStorage.getItem('userEmail');
    const selectedRole = localStorage.getItem('selectedRole');
    
    if (!userEmail || selectedRole !== 'User') {
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

  const callSOS = () => {
    const sosConfirm = confirm(
      '🚨 EMERGENCY SERVICES\n\n📞 Ambulance: 108\n📞 Medical Emergency: 102\n📞 Police: 100\n📞 Fire: 101\n\nClick OK to call 108 (Ambulance)'
    );
    if (sosConfirm) {
      window.location.href = 'tel:108';
    }
  };

  const openMedicineMatrix = () => {
    router.push('/medicine-matrix');
  };

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages([...chatMessages, { text: chatInput, sender: 'user' }]);
      
      // Simulate bot response
      setTimeout(() => {
        setChatMessages(prev => [...prev, { 
          text: "Thank you for your question. For accurate medical advice, please consult with a healthcare professional. I can provide general health information. How can I assist you today?", 
          sender: 'bot' 
        }]);
      }, 1000);
      
      setChatInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl transform -translate-x-full lg:translate-x-0 transition-transform z-50">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-teal-600">🏥 SanjeevniAI</h1>
          <p className="text-sm text-gray-600 mt-1">Healthcare Platform</p>
        </div>

        <nav className="p-4 space-y-2">
          <a href="/dashboard/patient" className="flex items-center gap-3 px-4 py-3 bg-teal-50 text-teal-600 rounded-xl font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </a>
          <button onClick={() => setShowDoctors(true)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Appointments
          </button>
          <button onClick={() => setShowChatbot(!showChatbot)} className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            AI Chatbot
          </button>
          <div className="flex items-center gap-3 px-4 py-3 text-gray-400 rounded-xl font-medium cursor-not-allowed">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            Medicine Matrix (Coming Soon)
          </div>
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
            <span className="text-sm text-gray-600">Patient</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{email}</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
              {greeting}!
            </h1>
            <p className="text-gray-600">Signed up with {email}</p>
          </div>

          {/* Health Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthMetrics.map((metric, index) => (
              <div 
                key={index}
                onClick={() => setSelectedMetric(metric)}
                className={`bg-gradient-to-br ${metric.color} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer`}
              >
                <div className="flex flex-col items-center text-white">
                  <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center mb-6">
                    {metric.icon}
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{metric.title}</h3>
                  <div className="text-6xl font-bold mb-2">{metric.percentage}%</div>
                  <p className="text-sm opacity-90">{metric.status}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Health Metric Modal */}
          {selectedMetric && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMetric(null)}>
              <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-800">{selectedMetric.title} Details</h2>
                  <button onClick={() => setSelectedMetric(null)} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                {/* Current Score */}
                <div className={`bg-gradient-to-br ${selectedMetric.color} rounded-2xl p-6 text-white mb-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90 mb-1">Current Score</p>
                      <p className="text-5xl font-bold">{selectedMetric.percentage}%</p>
                      <p className="text-lg mt-2">{selectedMetric.status}</p>
                    </div>
                    <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      {selectedMetric.icon}
                    </div>
                  </div>
                </div>

                {/* Progress Chart */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">7-Day Trend</h3>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <div className="flex items-end justify-between h-48 gap-2">
                      {selectedMetric.chartData.map((value, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div className="w-full bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-lg transition-all hover:opacity-80" 
                               style={{ height: `${(value / 100) * 100}%` }}>
                          </div>
                          <p className="text-xs text-gray-600 mt-2">Day {idx + 1}</p>
                          <p className="text-xs font-bold text-gray-800">{value}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-800">Improvement</h4>
                    </div>
                    <p className="text-sm text-gray-600">+{(selectedMetric.chartData[6] - selectedMetric.chartData[0]).toFixed(1)}% increase this week</p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-800">Goal</h4>
                    </div>
                    <p className="text-sm text-gray-600">Target: 95% by next month</p>
                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-800">Consistency</h4>
                    </div>
                    <p className="text-sm text-gray-600">Tracking for 7 days straight</p>
                  </div>

                  <div className="bg-orange-50 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-800">Recommendation</h4>
                    </div>
                    <p className="text-sm text-gray-600">Maintain regular exercise routine</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions - Only SOS and Medicine Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SOS Emergency */}
            <div 
              onClick={callSOS}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center mb-4 animate-pulse">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-2">SOS Emergency</h3>
                <p className="text-lg opacity-90 mb-4">24/7 Emergency Helpline</p>
                <div className="text-2xl font-bold">📞 108 / 102</div>
              </div>
            </div>

            {/* Medicine Matrix */}
            <div 
              onClick={openMedicineMatrix}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-white">
                <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold mb-2">Medicine Matrix</h3>
                <p className="text-lg opacity-90 mb-4">Find nearby pharmacies</p>
                <div className="text-sm font-semibold bg-white bg-opacity-20 px-4 py-2 rounded-full">Search Medicines →</div>
              </div>
            </div>
          </div>

          {/* Doctor Appointment Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Book Doctor Appointment</h2>
                <p className="text-gray-600 mt-1">Consult with certified doctors and specialists</p>
              </div>
              <button 
                onClick={() => setShowDoctors(!showDoctors)}
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {showDoctors ? 'Hide Doctors' : 'View All Doctors'}
              </button>
            </div>

            {showDoctors && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {/* Doctor 1 */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      SJ
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">Dr. Sarah Johnson</h3>
                      <p className="text-teal-600 font-semibold">Cardiologist</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold">4.9</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">15 yrs exp</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">2500+ patients</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">🏥 Physical</span>
                    <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-semibold">💻 Virtual</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Physical: <span className="font-bold text-gray-800">₹800</span></p>
                    <p className="text-sm text-gray-600">Virtual: <span className="font-bold text-gray-800">₹500</span></p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Next Available:</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 3 10:30 AM</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 4 11:00 AM</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 5 9:00 AM</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Book Appointment
                  </button>
                </div>

                {/* Doctor 2 */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      MC
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">Dr. Michael Chen</h3>
                      <p className="text-teal-600 font-semibold">General Physician</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold">4.8</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">12 yrs exp</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">3200+ patients</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">🏥 Physical</span>
                    <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-semibold">💻 Virtual</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Physical: <span className="font-bold text-gray-800">₹600</span></p>
                    <p className="text-sm text-gray-600">Virtual: <span className="font-bold text-gray-800">₹400</span></p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Next Available:</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 2 3:00 PM</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 3 10:00 AM</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 5 2:00 PM</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Book Appointment
                  </button>
                </div>

                {/* Doctor 3 */}
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      ER
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">Dr. Emily Rodriguez</h3>
                      <p className="text-teal-600 font-semibold">Dermatologist</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-semibold">4.7</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">10 yrs exp</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">1800+ patients</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">🏥 Physical</span>
                    <span className="bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-xs font-semibold">💻 Virtual</span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">Physical: <span className="font-bold text-gray-800">₹700</span></p>
                    <p className="text-sm text-gray-600">Virtual: <span className="font-bold text-gray-800">₹450</span></p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Next Available:</p>
                    <div className="flex gap-2 flex-wrap">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 2 11:00 AM</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 3 1:00 PM</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Nov 4 10:30 AM</span>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Book Appointment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* AI Chatbot Section */}
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">AI Health Assistant</h2>
                  <p className="text-gray-600">24/7 Medical Support</p>
                </div>
              </div>
              <button 
                onClick={() => setShowChatbot(!showChatbot)}
                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                {showChatbot ? 'Close Chat' : 'Start Chat'}
              </button>
            </div>

            {showChatbot && (
              <div className="mt-6">
                {/* Medical Disclaimer */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <div>
                      <h4 className="font-bold text-yellow-800 mb-1">Medical Disclaimer</h4>
                      <p className="text-sm text-yellow-700">This AI chatbot provides general health information only. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment.</p>
                    </div>
                  </div>
                </div>

                {/* Chat Interface */}
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 mb-4">
                  {/* AI Greeting */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-md max-w-lg">
                      <p className="font-semibold text-gray-800 mb-2">👋 Hello! I'm your AI Health Assistant. I can help you with:</p>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4">
                        <li>• General health questions</li>
                        <li>• Symptom information</li>
                        <li>• Wellness tips</li>
                        <li>• Medication queries</li>
                        <li>• Preventive care advice</li>
                      </ul>
                      <p className="text-sm text-gray-600 mt-3">How can I assist you today?</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && (
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mr-2">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                          </div>
                        )}
                        <div className={`${msg.sender === 'user' ? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white' : 'bg-white text-gray-800'} rounded-2xl px-4 py-2 max-w-md shadow-md`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Questions */}
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">⚡ Quick Questions:</p>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setChatInput("What are symptoms of flu?")} className="bg-white hover:bg-gray-50 text-gray-700 text-xs px-3 py-2 rounded-full border border-gray-200 transition-colors">
                        What are symptoms of flu?
                      </button>
                      <button onClick={() => setChatInput("How to reduce stress?")} className="bg-white hover:bg-gray-50 text-gray-700 text-xs px-3 py-2 rounded-full border border-gray-200 transition-colors">
                        How to reduce stress?
                      </button>
                      <button onClick={() => setChatInput("Tips for better sleep")} className="bg-white hover:bg-gray-50 text-gray-700 text-xs px-3 py-2 rounded-full border border-gray-200 transition-colors">
                        Tips for better sleep
                      </button>
                    </div>
                  </div>

                  {/* Input Box */}
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your health question..."
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="bg-gradient-to-r from-teal-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
