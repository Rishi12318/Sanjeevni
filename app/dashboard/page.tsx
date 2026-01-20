'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userName, setUserName] = useState('User')
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
      router.push('/login')
      return
    }
    
    const email = localStorage.getItem('userEmail') || 'user@example.com'
    const role = localStorage.getItem('selectedRole') || 'User'
    
    // Redirect to role-specific dashboard
    if (role === 'Doctor') {
      router.push('/dashboard/doctor')
      return
    } else if (role === 'NGO') {
      router.push('/dashboard/ngo')
      return
    } else if (role === 'User') {
      router.push('/dashboard/patient')
      return
    }
    
    setUserEmail(email)
    setUserName(role)
  }, [router])

  const logout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('selectedRole')
    router.push('/')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-h-full bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center cursor-pointer">
            <svg className="w-10 h-10 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <h1 className="caveat text-3xl font-bold text-gray-800">Sanjeevni AI</h1>
          </Link>
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-sm text-gray-500">{userName}</p>
              <p className="text-sm text-gray-700 font-medium">{userEmail}</p>
            </div>
            <button onClick={logout} className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
              Sign Out
            </button>
            <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, {userName}!</h2>
          <p className="text-gray-600 text-lg">Here's your health dashboard overview</p>
        </div>

        {/* Health Meter Section */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 shadow-2xl mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Your Health Score</h3>
              <p className="text-teal-100">Based on recent activities and checkups</p>
            </div>
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                <circle 
                  cx="64" 
                  cy="64" 
                  r="56" 
                  stroke="white" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray="351.68"
                  strokeDashoffset="70"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">85%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">2</p>
            <p className="text-xs text-gray-500">Appointments</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Medical</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">12</p>
            <p className="text-xs text-gray-500">Records</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Unread</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">5</p>
            <p className="text-xs text-gray-500">Messages</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Active</p>
            <p className="text-3xl font-bold text-gray-800 mb-1">3</p>
            <p className="text-xs text-gray-500">Prescriptions</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Checkup Completed</p>
                  <p className="text-sm text-gray-600">Annual health checkup with Dr. Sarah Johnson</p>
                  <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Lab Report Ready</p>
                  <p className="text-sm text-gray-600">Blood test results are now available</p>
                  <p className="text-xs text-gray-500 mt-1">5 days ago</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">Medication Reminder</p>
                  <p className="text-sm text-gray-600">Time to take your evening medication</p>
                  <p className="text-xs text-gray-500 mt-1">1 week ago</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Health Tips</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border-l-4 border-teal-500">
                <p className="font-semibold text-gray-800 mb-2">💧 Stay Hydrated</p>
                <p className="text-sm text-gray-600">Drink at least 8 glasses of water daily for optimal health</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-l-4 border-blue-500">
                <p className="font-semibold text-gray-800 mb-2">🏃 Daily Exercise</p>
                <p className="text-sm text-gray-600">30 minutes of physical activity can boost your energy</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-l-4 border-indigo-500">
                <p className="font-semibold text-gray-800 mb-2">😴 Quality Sleep</p>
                <p className="text-sm text-gray-600">Aim for 7-8 hours of sleep each night</p>
              </div>

              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-l-4 border-purple-500">
                <p className="font-semibold text-gray-800 mb-2">🥗 Balanced Diet</p>
                <p className="text-sm text-gray-600">Include fruits, vegetables, and whole grains in your meals</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center p-6 bg-teal-50 rounded-xl hover:bg-teal-100 transition-all hover:scale-105 shadow-md">
              <svg className="w-12 h-12 text-teal-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span className="font-semibold text-gray-800">Book Appointment</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all hover:scale-105 shadow-md">
              <svg className="w-12 h-12 text-blue-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              <span className="font-semibold text-gray-800">AI Chatbot</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all hover:scale-105 shadow-md">
              <svg className="w-12 h-12 text-indigo-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span className="font-semibold text-gray-800">Health Records</span>
            </button>

            <button className="flex flex-col items-center justify-center p-6 bg-pink-50 rounded-xl hover:bg-pink-100 transition-all hover:scale-105 shadow-md">
              <svg className="w-12 h-12 text-pink-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span className="font-semibold text-gray-800">Prescriptions</span>
            </button>
          </div>
        </div>
      </main>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Scheduled Appointments */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-teal-600 mb-3">Scheduled</h3>
              <div className="space-y-3">
                <div className="bg-teal-50 rounded-xl p-4 border-l-4 border-teal-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">Dr. Sarah Johnson</h4>
                      <p className="text-sm text-gray-600">Cardiologist</p>
                      <div className="mt-2 flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Nov 3, 2026 - 10:30 AM
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-teal-500 text-white text-xs rounded-full">Confirmed</span>
                  </div>
                </div>

                <div className="bg-teal-50 rounded-xl p-4 border-l-4 border-teal-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">Dr. Michael Chen</h4>
                      <p className="text-sm text-gray-600">General Physician</p>
                      <div className="mt-2 flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Nov 5, 2026 - 2:00 PM
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-teal-500 text-white text-xs rounded-full">Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Past Appointments */}
            <div>
              <h3 className="text-lg font-semibold text-gray-600 mb-3">Past</h3>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-gray-300">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">Dr. Emily Williams</h4>
                      <p className="text-sm text-gray-600">Dermatologist</p>
                      <div className="mt-2 flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        Oct 28, 2026 - 3:00 PM
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-400 text-white text-xs rounded-full">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
