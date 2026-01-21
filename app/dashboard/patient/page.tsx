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
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [medicineQuery, setMedicineQuery] = useState('');
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [showPhysicalBreakdown, setShowPhysicalBreakdown] = useState(false);
  const [showMentalPanel, setShowMentalPanel] = useState(false);
  const [showWellnessLayers, setShowWellnessLayers] = useState(false);
  const [expandPhysicalTrend, setExpandPhysicalTrend] = useState(false);
  const [showDoctors, setShowDoctors] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'bot'}>>([]);
  const [chatInput, setChatInput] = useState('');
  const [activeSection, setActiveSection] = useState<'dashboard' | 'appointments' | 'chatbot' | 'medicine'>('dashboard');

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
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const selectedRole = localStorage.getItem('selectedRole');
    
    if (!userEmail || !isLoggedIn) {
      router.push('/login');
      return;
    }
    
    // Redirect if wrong role
    if (selectedRole === 'Doctor') {
      router.push('/dashboard/doctor');
      return;
    } else if (selectedRole === 'NGO') {
      router.push('/dashboard/ngo');
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
    setActiveSection('medicine');
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
    <div className="min-h-screen bg-gradient-to-br from-teal-100/30 via-cyan-100/20 to-emerald-50/40" style={{background: 'linear-gradient(135deg, #d1f2eb 0%, #d0f0ef 25%, #c8ebe9 50%, #bfe5e3 75%, #b8e0dd 100%)'}}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-2xl transform -translate-x-full lg:translate-x-0 transition-transform z-50">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-teal-600">🏥 SanjeevniAI</h1>
          <p className="text-sm text-gray-600 mt-1">Healthcare Platform</p>
        </div>

        <nav className="p-4 space-y-2">
          <button 
            onClick={() => setActiveSection('dashboard')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full text-left relative overflow-hidden group cursor-pointer ${
              activeSection === 'dashboard' 
                ? 'bg-teal-50 text-teal-600 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {activeSection === 'dashboard' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveSection('appointments')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full text-left relative overflow-hidden group cursor-pointer ${
              activeSection === 'appointments' 
                ? 'bg-teal-50 text-teal-600 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {activeSection === 'appointments' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>Appointments</span>
          </button>
          <button 
            onClick={() => setActiveSection('chatbot')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full text-left relative overflow-hidden group cursor-pointer ${
              activeSection === 'chatbot' 
                ? 'bg-teal-50 text-teal-600 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {activeSection === 'chatbot' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
            <span>AI Chatbot</span>
          </button>
          <button 
            onClick={() => setActiveSection('medicine')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all w-full text-left relative overflow-hidden group cursor-pointer ${
              activeSection === 'medicine' 
                ? 'bg-teal-50 text-teal-600 shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {activeSection === 'medicine' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600 rounded-r"></div>
            )}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span>Medicine Matrix</span>
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
            <span className="text-sm text-gray-600">Patient</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-600">{email}</span>
          </div>
        </div>

        {/* Conditional Content Based on Active Section */}
        {/* Dashboard Content */}
        {activeSection === 'dashboard' && (
        <div className="p-8 space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Caveat, cursive' }}>
              {greeting}!
            </h1>
            <p className="text-gray-600">Signed up with {email}</p>
          </div>

          {/* Health Matrix - Enhanced Glassmorphism Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Physical Health Card - Frosted Glass Aesthetic */}
            <div 
              onMouseEnter={() => setShowPhysicalBreakdown(true)}
              onMouseLeave={() => setShowPhysicalBreakdown(false)}
              className="rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid',
                borderImage: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4), rgba(13, 148, 136, 0.2)) 1',
                boxShadow: '0 12px 40px rgba(20, 184, 166, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}
            >
              {/* Subtle hover blur increase */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              ></div>
              
              <div className="flex flex-col items-center relative z-10">
                {/* Minimal circular icon outline */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105" 
                  style={{border: '1.5px solid rgba(20, 184, 166, 0.35)'}}
                >
                  <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-teal-800" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>Physical Health</h3>
                
                {/* Refined circular progress ring with gradient */}
                <div className="relative w-32 h-32 mb-5">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle cx="64" cy="64" r="56" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="5" fill="none" />
                    <circle 
                      cx="64" cy="64" r="56" 
                      stroke="url(#physicalGradient)" 
                      strokeWidth="5" 
                      fill="none"
                      strokeDasharray="351.86"
                      strokeDashoffset="76.5"
                      className="transition-all duration-1000 ease-out"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="physicalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{stopColor: '#14b8a6', stopOpacity: 1}} />
                        <stop offset="100%" style={{stopColor: '#0d9488', stopOpacity: 0.85}} />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-semibold text-teal-800">78.2%</span>
                  </div>
                </div>
                
                <p className="text-sm text-teal-700 mb-2 font-semibold">Excellent condition</p>
                <p className="text-xs text-slate-600 italic">Steady improvement over 7 days</p>
                
                {/* Mini breakdown overlay on hover */}
                {showPhysicalBreakdown && (
                  <div className="absolute inset-0 bg-teal-700 bg-opacity-95 p-6 flex flex-col justify-center animate-[fadeIn_0.3s_ease-in]">
                    <h4 className="text-xl font-bold mb-4">Health Factors</h4>
                    
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Activity Level</span>
                          <span>85%</span>
                        </div>
                        <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full animate-[slideIn_0.8s_ease-out]" style={{width: '85%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Sleep Quality</span>
                          <span>72%</span>
                        </div>
                        <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full animate-[slideIn_0.8s_ease-out]" style={{width: '72%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Hydration</span>
                          <span>68%</span>
                        </div>
                        <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full animate-[slideIn_0.8s_ease-out]" style={{width: '68%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Vitals Stability</span>
                          <span>88%</span>
                        </div>
                        <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full animate-[slideIn_0.8s_ease-out]" style={{width: '88%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); setExpandPhysicalTrend(!expandPhysicalTrend); }}
                      className="mt-4 bg-white text-teal-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      View 7-Day Trend
                    </button>
                  </div>
                )}
                
                {/* Expanded 7-day trend */}
                {expandPhysicalTrend && (
                  <div className="absolute inset-0 bg-white text-gray-800 p-6 animate-[slideUp_0.4s_ease-out] overflow-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setExpandPhysicalTrend(false); }}
                      className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                    
                    <h3 className="text-2xl font-bold mb-4 text-teal-600">7-Day Health Trend</h3>
                    <div className="flex items-end justify-between h-32 gap-2 mb-4">
                      {[65, 68, 72, 70, 75, 78, 78.2].map((value, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-lg transition-all hover:opacity-80" 
                            style={{ height: `${(value / 100) * 100}%` }}
                          ></div>
                          <p className="text-xs text-gray-600 mt-2">Day {idx + 1}</p>
                          <p className="text-xs font-bold text-teal-600">{value}%</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">📈 Steady improvement with +13.2% over the week</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mental Health Card - Frosted Glass with Wave Animation */}
            <div 
              onClick={() => setShowMentalPanel(!showMentalPanel)}
              className="rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid',
                borderImage: 'linear-gradient(135deg, rgba(20, 184, 166, 0.35), rgba(6, 182, 212, 0.2)) 1',
                boxShadow: '0 12px 40px rgba(6, 182, 212, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}
            >
              {/* Calm glow effect on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              ></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105" 
                  style={{border: '1.5px solid rgba(6, 182, 212, 0.35)'}}
                >
                  <svg className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-cyan-800" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>Mental Health</h3>
                
                {/* Wave-style progress with teal gradient */}
                <div className="relative w-full h-28 mb-5">
                  <svg viewBox="0 0 200 100" className="w-full h-full">
                    <defs>
                      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(6, 182, 212, 0.7)" />
                        <stop offset="100%" stopColor="rgba(20, 184, 166, 0.3)" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,50 Q25,20 50,50 T100,50 T150,50 T200,50 L200,100 L0,100 Z"
                      fill="url(#waveGradient)"
                      className="animate-[wave_3s_ease-in-out_infinite]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-semibold text-cyan-800">90.8%</span>
                  </div>
                </div>
                
                <p className="text-sm text-cyan-700 mb-2 font-semibold">Very good state</p>
                <p className="text-xs text-slate-600 italic">Emotional balance consistently strong</p>
              </div>
              
              {/* Slide-up mental health panel */}
              {showMentalPanel && (
                <div className="absolute inset-0 bg-indigo-700 p-6 animate-[slideUp_0.4s_ease-out] overflow-auto">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowMentalPanel(false); }}
                    className="absolute top-4 right-4 text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  
                  <h3 className="text-xl font-bold text-white mb-4">Mental Wellness Insights</h3>
                  
                  <div className="space-y-4 text-white text-sm">
                    <div className="bg-white bg-opacity-20 rounded-xl p-3">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Mood Consistency</span>
                        <span>92%</span>
                      </div>
                      <p className="text-xs opacity-90">Your mood has been stable and positive throughout the week.</p>
                    </div>
                    
                    <div className="bg-white bg-opacity-20 rounded-xl p-3">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Stress Indicators</span>
                        <span className="text-green-300">Low</span>
                      </div>
                      <p className="text-xs opacity-90">Great job managing stress! Your relaxation practices are working well.</p>
                    </div>
                    
                    <div className="bg-white bg-opacity-20 rounded-xl p-3">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Restfulness Score</span>
                        <span>88%</span>
                      </div>
                      <p className="text-xs opacity-90">You're getting quality rest. Keep maintaining your sleep routine.</p>
                    </div>
                    
                    <div className="bg-indigo-800 rounded-xl p-4 mt-4">
                      <p className="font-semibold mb-2">💭 Daily Check-in</p>
                      <p className="text-xs mb-3 opacity-90">How are you feeling today?</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-white text-indigo-600 py-2 rounded-lg text-xs font-semibold hover:bg-opacity-90">😊 Great</button>
                        <button className="flex-1 bg-white text-indigo-600 py-2 rounded-lg text-xs font-semibold hover:bg-opacity-90">😐 Okay</button>
                        <button className="flex-1 bg-white text-indigo-600 py-2 rounded-lg text-xs font-semibold hover:bg-opacity-90">😔 Low</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Overall Wellness Card - Frosted Glass with Multi-layered Rings */}
            <div 
              onMouseEnter={() => setShowWellnessLayers(true)}
              onMouseLeave={() => setShowWellnessLayers(false)}
              className="rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid',
                borderImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(20, 184, 166, 0.2)) 1',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              ></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105" 
                  style={{border: '1.5px solid rgba(16, 185, 129, 0.35)'}}
                >
                  <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-emerald-800" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>Overall Wellness</h3>
                
                {/* Multi-layered progress rings with teal/emerald gradient */}
                <div className="relative w-40 h-40 mb-5">
                  {/* Outer ring - Physical (teal) */}
                  <svg className="absolute inset-0 transform -rotate-90 w-40 h-40">
                    <circle cx="80" cy="80" r="70" stroke="rgba(20, 184, 166, 0.15)" strokeWidth="5" fill="none" />
                    <circle 
                      cx="80" cy="80" r="70" 
                      stroke="#14b8a6" 
                      strokeWidth="5" 
                      fill="none"
                      strokeDasharray="439.82"
                      strokeDashoffset="95.76"
                      className={`transition-all duration-1000 ${showWellnessLayers ? 'opacity-90' : 'opacity-70'}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Middle ring - Mental (cyan) */}
                  <svg className="absolute inset-0 transform -rotate-90 w-40 h-40">
                    <circle cx="80" cy="80" r="58" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="5" fill="none" />
                    <circle 
                      cx="80" cy="80" r="58" 
                      stroke="#06b6d4" 
                      strokeWidth="5" 
                      fill="none"
                      strokeDasharray="364.42"
                      strokeDashoffset="33.53"
                      className={`transition-all duration-1000 ${showWellnessLayers ? 'opacity-90' : 'opacity-70'}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  {/* Inner ring - Lifestyle (emerald) */}
                  <svg className="absolute inset-0 transform -rotate-90 w-40 h-40">
                    <circle cx="80" cy="80" r="46" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="5" fill="none" />
                    <circle 
                      cx="80" cy="80" r="46" 
                      stroke="#10b981" 
                      strokeWidth="5" 
                      fill="none"
                      strokeDasharray="289.03"
                      strokeDashoffset="57.81"
                      className={`transition-all duration-1000 ${showWellnessLayers ? 'opacity-90' : 'opacity-70'}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl font-semibold text-emerald-800">84.5%</span>
                      {showWellnessLayers && (
                        <div className="text-xs mt-1">
                          <p className="text-teal-600 font-semibold">↑ +2.3%</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-emerald-700 mb-2 font-semibold">Great progress!</p>
                <p className="text-xs text-slate-600 italic text-center px-2">Strong balance between activity and rest</p>
                
                {showWellnessLayers && (
                  <div className="mt-4 space-y-2 text-xs w-full">
                    <div className="flex items-center justify-between rounded-lg p-2" style={{background: 'rgba(20, 184, 166, 0.15)'}}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                        <span className="text-teal-800 font-medium">Physical</span>
                      </div>
                      <span className="font-bold text-teal-800">78.2%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg p-2" style={{background: 'rgba(6, 182, 212, 0.15)'}}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                        <span className="text-cyan-800 font-medium">Mental</span>
                      </div>
                      <span className="font-bold text-cyan-800">90.8%</span>
                    </div>
                    <div className="flex items-center justify-between bg-white bg-opacity-20 rounded-lg p-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                        <span>Lifestyle</span>
                      </div>
                      <span className="font-bold">80.0%</span>
                    </div>
                    <div className="bg-purple-700 rounded-lg p-2 text-center">
                      <p className="text-xs">📊 Follow daily recommendations for +5% boost</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

          {/* Quick Actions - Enhanced SOS and Medicine Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SOS Emergency - Frosted Glass with Subtle Red Tint */}
            <div 
              className="rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
              onClick={(e) => {
                if (!(e.target as HTMLElement).closest('button')) {
                  callSOS();
                }
              }}
              style={{
                background: 'rgba(255, 245, 245, 0.4)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 12px 40px rgba(239, 68, 68, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
              }}
            >
              {/* Subtle pulse on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                style={{
                  background: 'rgba(254, 226, 226, 0.3)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              ></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105" 
                  style={{border: '1.5px solid rgba(239, 68, 68, 0.4)'}}
                >
                  <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-red-800" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>SOS Emergency</h3>
                <p className="text-base text-red-700 mb-3 font-semibold">24/7 Emergency Helpline</p>
                <p className="text-xs text-slate-600 mb-4 italic">Instant help, no AI delay</p>

                {/* Emergency Action Buttons with refined styling */}
                <div className="w-full space-y-3 mt-2">
                  <a 
                    href="tel:108"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-base transition-all text-red-800 hover:text-red-900"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Call 108 Ambulance
                  </a>
                  <a 
                    href="tel:102"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-base transition-all text-red-800 hover:text-red-900"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Call 102 Medical
                  </a>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition((pos) => {
                          const shareText = `🚨 Emergency! I need help. My location: https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
                          if (navigator.share) {
                            navigator.share({ title: 'Emergency Location', text: shareText });
                          } else {
                            alert('Location: ' + shareText);
                          }
                        });
                      }
                    }}
                    className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl font-semibold text-base transition-all text-red-800 hover:text-red-900"
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Share Live Location
                  </button>
                </div>
              </div>
            </div>

            {/* Medicine Matrix - Frosted Glass with Emerald Tint */}
            <div 
              className="rounded-3xl p-8 transition-all duration-500 transform hover:-translate-y-1 cursor-pointer relative overflow-hidden group"
              onClick={() => !showMedicineSearch && setShowMedicineSearch(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid rgba(16, 185, 129, 0.35)',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              }}
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                }}
              ></div>
              
              <div className="flex flex-col items-center relative z-10">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105" 
                  style={{border: '1.5px solid rgba(16, 185, 129, 0.35)'}}
                >
                  <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-emerald-800" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>Medicine Matrix</h3>
                <p className="text-base text-emerald-700 mb-4 font-semibold">Find nearby pharmacies</p>
                
                {!showMedicineSearch ? (
                  <>
                    <div className="flex gap-2 mb-4 flex-wrap justify-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-emerald-700" style={{background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.25)'}}>Nearest Pharmacy</span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium text-emerald-700" style={{background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.25)'}}>Repeat Last</span>
                    </div>
                    <div className="text-sm font-semibold px-4 py-2 rounded-full transition-all text-emerald-800" style={{background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)'}}>Search Medicines →</div>
                  </>
                ) : (
                  <div className="w-full space-y-4 animate-[slideDown_0.3s_ease-out]">
                    {/* Inline Search Field */}
                    <div className="relative">
                      <input 
                        type="text"
                        value={medicineQuery}
                        onChange={(e) => setMedicineQuery(e.target.value)}
                        placeholder="Search medicine or pharmacy..."
                        className="w-full bg-white text-gray-800 px-4 py-3 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <svg className="w-5 h-5 text-gray-400 absolute right-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>

                    {/* AI-Powered Suggestions */}
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 space-y-2">
                      <p className="text-xs opacity-90 italic mb-2">💡 Based on your recent prescriptions:</p>
                      {['Paracetamol 500mg', 'Vitamin D Supplements', 'Amoxicillin 250mg'].map((med, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setMedicineQuery(med);
                          }}
                          className="flex items-center justify-between w-full bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg text-sm transition-all"
                        >
                          <span>{med}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                        </button>
                      ))}
                    </div>

                    {/* Nearby Pharmacies Preview */}
                    <div className="bg-white bg-opacity-20 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold mb-2">📍 Nearest Pharmacies:</p>
                      {[
                        { name: 'Apollo Pharmacy', distance: '0.8 km', status: 'Open now' },
                        { name: 'MedPlus', distance: '1.2 km', status: 'Open 24/7' }
                      ].map((pharmacy, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white bg-opacity-20 px-3 py-2 rounded-lg text-sm">
                          <div>
                            <p className="font-semibold">{pharmacy.name}</p>
                            <p className="text-xs opacity-80">{pharmacy.distance} • {pharmacy.status}</p>
                          </div>
                          <button className="text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMedicineSearch(false);
                        setMedicineQuery('');
                      }}
                      className="w-full bg-white text-green-600 py-2 rounded-xl font-semibold hover:bg-opacity-90 transition-all"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes heartbeat {
              0%, 100% { transform: scale(1); }
              14% { transform: scale(1.15); }
              28% { transform: scale(1); }
              42% { transform: scale(1.15); }
              56% { transform: scale(1); }
            }
          `}</style>

          {/* Doctor Appointment Section - Frosted Glass Card */}
          <div className="rounded-3xl p-8 transition-all duration-300" style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(20, 184, 166, 0.25)',
            boxShadow: '0 12px 40px rgba(20, 184, 166, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-teal-800" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>Book Doctor Appointment</h2>
                <p className="text-slate-600 mt-1">Consult with certified doctors and specialists</p>
              </div>
              <button 
                onClick={() => router.push('/appointments/book')}
                className="px-6 py-3 rounded-xl font-semibold transition-all text-teal-800 hover:text-teal-900"
                style={{
                  background: 'rgba(20, 184, 166, 0.15)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                }}
              >
                Book Now
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

          {/* AI Chatbot Section - Frosted Glass Card */}
          <div className="rounded-3xl p-8 transition-all duration-300" style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(6, 182, 212, 0.25)',
            boxShadow: '0 12px 40px rgba(6, 182, 212, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          }}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{border: '1.5px solid rgba(6, 182, 212, 0.35)'}}>
                  <svg className="w-7 h-7 text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-cyan-800" style={{fontFamily: 'Georgia, serif', fontStyle: 'italic'}}>AI Health Assistant</h2>
                  <p className="text-slate-600">24/7 Medical Support</p>
                </div>
              </div>
              <button 
                onClick={() => router.push('/chat/assistant')}
                className="px-6 py-3 rounded-xl font-semibold transition-all text-cyan-800 hover:text-cyan-900"
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                }}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Appointments Section */}
        {activeSection === 'appointments' && (
        <div className="p-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Your Appointments
            </h1>
            <p className="text-gray-600">Manage your doctor consultations</p>
          </div>

          {/* Book New Appointment Button */}
          <div className="rounded-3xl p-8 text-center" style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
            border: '2px dashed rgba(20, 184, 166, 0.4)',
          }}>
            <svg className="w-16 h-16 mx-auto mb-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Book New Appointment</h3>
            <p className="text-gray-600 mb-4">Schedule a consultation with our doctors</p>
            <button 
              onClick={() => router.push('/appointments/book')}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              Browse Doctors & Book Now
            </button>
          </div>

          {/* Upcoming Appointments */}
          <div className="rounded-3xl p-8" style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(20, 184, 166, 0.25)',
            boxShadow: '0 12px 40px rgba(20, 184, 166, 0.08)',
          }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Upcoming Consultations</h3>
            <div className="space-y-4">
              {/* Sample Appointment 1 */}
              <div className="bg-white/60 rounded-2xl p-6 border border-teal-200/50 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                      SJ
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">Dr. Sarah Johnson</h4>
                      <p className="text-sm text-teal-600 font-semibold">Cardiologist</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          January 22, 2026
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          10:00 AM
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold">Physical</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Apollo Hospital, Jubilee Hills</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-lg text-sm font-semibold transition-all">View Details</button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-all">Cancel</button>
                  </div>
                </div>
              </div>

              {/* Sample Appointment 2 */}
              <div className="bg-white/60 rounded-2xl p-6 border border-cyan-200/50 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                      MC
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">Dr. Michael Chen</h4>
                      <p className="text-sm text-cyan-600 font-semibold">General Physician</p>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          January 24, 2026
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          2:00 PM
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold">Virtual</span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200/50 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Video Consultation</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg text-sm font-semibold transition-all">Join Call</button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-semibold transition-all">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Past Consultations */}
          <div className="rounded-3xl p-8" style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(156, 163, 175, 0.3)',
          }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Past Consultations</h3>
            <div className="space-y-3">
              <div className="bg-white/40 rounded-xl p-4 flex justify-between items-center hover:bg-white/60 transition-all">
                <div>
                  <p className="font-semibold text-gray-800">Dr. Emily Rodriguez - Dermatologist</p>
                  <p className="text-sm text-gray-600">January 15, 2026</p>
                </div>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-semibold">View Report</button>
              </div>
              <div className="bg-white/40 rounded-xl p-4 flex justify-between items-center hover:bg-white/60 transition-all">
                <div>
                  <p className="font-semibold text-gray-800">Dr. Rajesh Kumar - Orthopedic</p>
                  <p className="text-sm text-gray-600">January 10, 2026</p>
                </div>
                <button className="text-teal-600 hover:text-teal-700 text-sm font-semibold">View Report</button>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="rounded-3xl p-6" style={{
            background: 'rgba(255, 255, 255, 0.35)',
            border: '1.5px solid rgba(20, 184, 166, 0.2)',
          }}>
            <h4 className="text-lg font-bold text-gray-800 mb-4">Filter Appointments</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none">
                <option>All Types</option>
                <option>Physical</option>
                <option>Virtual</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none">
                <option>All Specialties</option>
                <option>Cardiologist</option>
                <option>General Physician</option>
                <option>Dermatologist</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none">
                <option>All Hospitals</option>
                <option>Apollo Hospital</option>
                <option>Yashoda Hospital</option>
                <option>CARE Hospital</option>
              </select>
              <input 
                type="date" 
                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>
          </div>
        </div>
        )}

        {/* AI Chatbot Section */}
        {activeSection === 'chatbot' && (
        <div className="p-8 h-[calc(100vh-200px)]">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            <div className="text-center mb-6">
              <h1 className="text-5xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                AI Health Assistant
              </h1>
              <p className="text-gray-600">Your 24/7 medical support companion</p>
            </div>

            <div className="flex-1 rounded-3xl p-8 flex flex-col" style={{
              background: 'rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(6, 182, 212, 0.25)',
              boxShadow: '0 12px 40px rgba(6, 182, 212, 0.08)',
            }}>
              {/* Welcome Message */}
              <div className="mb-6">
                <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-2">👋 Hello! How can I help you today?</h3>
                  <p className="text-cyan-50">I can help you with symptoms, health insights, finding doctors, and booking appointments.</p>
                </div>
              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button className="bg-white/60 p-4 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">🩺</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Check Symptoms</h4>
                      <p className="text-sm text-gray-600">Describe what you're feeling</p>
                    </div>
                  </div>
                </button>
                <button className="bg-white/60 p-4 rounded-xl border border-cyan-200/50 hover:shadow-lg transition-all text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">📊</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Understand Health Score</h4>
                      <p className="text-sm text-gray-600">Explain my metrics</p>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => router.push('/appointments/book')}
                  className="bg-white/60 p-4 rounded-xl border border-teal-200/50 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">👨‍⚕️</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Find a Doctor</h4>
                      <p className="text-sm text-gray-600">Get specialist recommendations</p>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => router.push('/appointments/book')}
                  className="bg-white/60 p-4 rounded-xl border border-cyan-200/50 hover:shadow-lg transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">📅</span>
                    <div>
                      <h4 className="font-bold text-gray-800">Book Appointment</h4>
                      <p className="text-sm text-gray-600">Schedule a consultation</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 bg-white/40 rounded-xl p-4 mb-4 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <p className="text-sm italic">Start a conversation by selecting an option above or typing below...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${
                          msg.sender === 'user' 
                            ? 'bg-teal-500 text-white' 
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your health question..."
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Medicine Matrix Section */}
        {activeSection === 'medicine' && (
        <div className="p-8 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Medicine Matrix
            </h1>
            <p className="text-gray-600">Find medicines and nearby pharmacies</p>
          </div>

          {/* Medicine Search */}
          <div className="rounded-3xl p-8" style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(16, 185, 129, 0.25)',
            boxShadow: '0 12px 40px rgba(16, 185, 129, 0.08)',
          }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Search Medicines</h3>
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={medicineQuery}
                onChange={(e) => setMedicineQuery(e.target.value)}
                placeholder="Search medicine name, condition, or symptom..."
                className="flex-1 px-6 py-4 rounded-xl border-2 border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>

            {/* Sample Medicine Results */}
            {medicineQuery && (
              <div className="space-y-3">
                <div className="bg-white/60 rounded-xl p-5 border border-emerald-200/50 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">Paracetamol 500mg</h4>
                      <p className="text-sm text-emerald-600 font-semibold">Pain Relief, Fever Reducer</p>
                      <p className="text-sm text-gray-600 mt-2">Available at 12 nearby pharmacies</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">₹45</p>
                      <p className="text-xs text-gray-500">10 tablets</p>
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-cyan-500 text-white py-2 rounded-lg font-semibold hover:bg-cyan-600 transition-all">
                    View Pharmacies
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Nearby Pharmacies */}
          <div className="rounded-3xl p-8" style={{
            background: 'rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(16, 185, 129, 0.25)',
          }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Nearby Pharmacies</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-xl p-5 border border-emerald-200/50">
                <h4 className="font-bold text-gray-800">Apollo Pharmacy</h4>
                <p className="text-sm text-gray-600">Jubilee Hills • 1.2 km away</p>
                <p className="text-xs text-emerald-600 font-semibold mt-2">⏰ Open 24/7</p>
                <button className="mt-3 text-emerald-600 text-sm font-semibold hover:underline">Get Directions →</button>
              </div>
              <div className="bg-white/60 rounded-xl p-5 border border-emerald-200/50">
                <h4 className="font-bold text-gray-800">MedPlus Pharmacy</h4>
                <p className="text-sm text-gray-600">Banjara Hills • 2.5 km away</p>
                <p className="text-xs text-emerald-600 font-semibold mt-2">⏰ Open till 11 PM</p>
                <button className="mt-3 text-emerald-600 text-sm font-semibold hover:underline">Get Directions →</button>
              </div>
            </div>
          </div>

          {/* Previous Prescriptions */}
          <div className="rounded-3xl p-8" style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1.5px solid rgba(156, 163, 175, 0.3)',
          }}>
            <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>Repeat Prescriptions</h3>
            <div className="space-y-3">
              <div className="bg-white/40 rounded-xl p-4 flex justify-between items-center hover:bg-white/60 transition-all">
                <div>
                  <p className="font-semibold text-gray-800">Blood Pressure Medication</p>
                  <p className="text-sm text-gray-600">Prescribed by Dr. Sarah Johnson • Jan 15</p>
                </div>
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600">
                  Reorder
                </button>
              </div>
              <div className="bg-white/40 rounded-xl p-4 flex justify-between items-center hover:bg-white/60 transition-all">
                <div>
                  <p className="font-semibold text-gray-800">Vitamin D Supplements</p>
                  <p className="text-sm text-gray-600">Prescribed by Dr. Michael Chen • Jan 10</p>
                </div>
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600">
                  Reorder
                </button>
              </div>
            </div>
          </div>

          {/* AI Medicine Guidance */}
          <div className="rounded-3xl p-8 text-center" style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.3)',
          }}>
            <svg className="w-16 h-16 mx-auto mb-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Need Medicine Guidance?</h3>
            <p className="text-gray-600 mb-4">Ask our AI about medicine usage, interactions, and precautions</p>
            <button 
              onClick={() => setActiveSection('chatbot')}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
        )}

      </main>
    </div>
  );
}
