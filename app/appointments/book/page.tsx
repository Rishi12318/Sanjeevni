'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  patients: number;
  physicalFee: number;
  virtualFee: number;
  avatar: string;
}

interface Hospital {
  id: string;
  name: string;
  location: string;
  distance: string;
  facilities: string[];
}

export default function BookAppointmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get('doctor');

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentType, setAppointmentType] = useState<'physical' | 'virtual'>('physical');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reasonForVisit, setReasonForVisit] = useState('');

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      experience: 15,
      rating: 4.9,
      patients: 2500,
      physicalFee: 800,
      virtualFee: 500,
      avatar: 'SJ'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'General Physician',
      experience: 12,
      rating: 4.8,
      patients: 3200,
      physicalFee: 600,
      virtualFee: 400,
      avatar: 'MC'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Dermatologist',
      experience: 10,
      rating: 4.7,
      patients: 1800,
      physicalFee: 700,
      virtualFee: 450,
      avatar: 'ER'
    }
  ];

  const hospitals: Hospital[] = [
    {
      id: '1',
      name: 'Apollo Hospital',
      location: 'Jubilee Hills, Hyderabad',
      distance: '2.5 km',
      facilities: ['Emergency', 'ICU', 'Lab', 'Pharmacy']
    },
    {
      id: '2',
      name: 'Yashoda Hospital',
      location: 'Somajiguda, Hyderabad',
      distance: '4.1 km',
      facilities: ['Emergency', 'Surgery', 'Lab', 'Imaging']
    },
    {
      id: '3',
      name: 'CARE Hospital',
      location: 'Banjara Hills, Hyderabad',
      distance: '3.8 km',
      facilities: ['Emergency', 'ICU', 'Cardiology', 'Pharmacy']
    }
  ];

  const availableDates = [
    '2026-01-21',
    '2026-01-22',
    '2026-01-23',
    '2026-01-24',
    '2026-01-25'
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM',
    '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  useEffect(() => {
    if (doctorId) {
      const doctor = doctors.find(d => d.id === doctorId);
      if (doctor) setSelectedDoctor(doctor);
    } else if (doctors.length > 0) {
      setSelectedDoctor(doctors[0]);
    }
  }, [doctorId]);

  const handleConfirmAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert('Please complete all required fields');
      return;
    }

    // Show confirmation
    const appointmentSummary = `
Appointment Confirmed! 🎉

Doctor: ${selectedDoctor.name}
Specialization: ${selectedDoctor.specialization}
Type: ${appointmentType === 'physical' ? 'Physical Consultation' : 'Virtual Consultation'}
${appointmentType === 'physical' && selectedHospital ? `Hospital: ${selectedHospital.name}` : ''}
Date: ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${selectedTime}
Fee: ₹${appointmentType === 'physical' ? selectedDoctor.physicalFee : selectedDoctor.virtualFee}
${reasonForVisit ? `\nReason: ${reasonForVisit}` : ''}

You will receive a confirmation SMS and email shortly.
    `;

    alert(appointmentSummary);
    router.push('/dashboard/patient');
  };

  if (!selectedDoctor) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-8 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="text-white hover:text-gray-100 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back
          </button>
          <h1 className="text-4xl md:text-5xl text-white font-bold mb-2" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Book Doctor Appointment
          </h1>
          <p className="text-white text-lg opacity-90">Schedule your consultation in simple steps</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Doctor Profile Card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex items-start gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
              {selectedDoctor.avatar}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedDoctor.name}</h2>
              <p className="text-xl text-teal-600 font-semibold mb-3">{selectedDoctor.specialization}</p>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-semibold">{selectedDoctor.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span>{selectedDoctor.experience} years experience</span>
                <span className="text-gray-400">•</span>
                <span>{selectedDoctor.patients}+ patients</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 bg-teal-50 rounded-2xl p-4 border-2 border-teal-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <span className="text-sm font-semibold text-gray-700">Physical Consultation</span>
              </div>
              <p className="text-2xl font-bold text-teal-600">₹{selectedDoctor.physicalFee}</p>
            </div>
            <div className="flex-1 bg-cyan-50 rounded-2xl p-4 border-2 border-cyan-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span className="text-sm font-semibold text-gray-700">Virtual Consultation</span>
              </div>
              <p className="text-2xl font-bold text-cyan-600">₹{selectedDoctor.virtualFee}</p>
            </div>
          </div>
        </div>

        {/* Appointment Type Selection */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            Step 1: Choose Consultation Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setAppointmentType('physical')}
              className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                appointmentType === 'physical'
                  ? 'border-teal-500 bg-teal-50 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                appointmentType === 'physical' ? 'bg-teal-500' : 'bg-gray-200'
              }`}>
                <svg className={`w-8 h-8 ${appointmentType === 'physical' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-800">Physical Visit</p>
                <p className="text-sm text-gray-600">In-person consultation at hospital</p>
                <p className="text-lg font-bold text-teal-600 mt-1">₹{selectedDoctor.physicalFee}</p>
              </div>
              {appointmentType === 'physical' && (
                <svg className="w-8 h-8 text-teal-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              )}
            </button>

            <button
              onClick={() => setAppointmentType('virtual')}
              className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
                appointmentType === 'virtual'
                  ? 'border-cyan-500 bg-cyan-50 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-cyan-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                appointmentType === 'virtual' ? 'bg-cyan-500' : 'bg-gray-200'
              }`}>
                <svg className={`w-8 h-8 ${appointmentType === 'virtual' ? 'text-white' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-800">Virtual Visit</p>
                <p className="text-sm text-gray-600">Video consultation from home</p>
                <p className="text-lg font-bold text-cyan-600 mt-1">₹{selectedDoctor.virtualFee}</p>
              </div>
              {appointmentType === 'virtual' && (
                <svg className="w-8 h-8 text-cyan-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Hospital Selection (Only for Physical) */}
        {appointmentType === 'physical' && (
          <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              Step 2: Select Hospital
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hospitals.map((hospital) => (
                <button
                  key={hospital.id}
                  onClick={() => setSelectedHospital(hospital)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all ${
                    selectedHospital?.id === hospital.id
                      ? 'border-teal-500 bg-teal-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                  }`}
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{hospital.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{hospital.location}</p>
                  <p className="text-xs text-teal-600 font-semibold mb-3">📍 {hospital.distance} away</p>
                  <div className="flex flex-wrap gap-2">
                    {hospital.facilities.map((facility, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                        {facility}
                      </span>
                    ))}
                  </div>
                  {selectedHospital?.id === hospital.id && (
                    <div className="mt-3 flex items-center justify-center">
                      <svg className="w-6 h-6 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date and Time Selection */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            {appointmentType === 'physical' ? 'Step 3' : 'Step 2'}: Select Date & Time
          </h3>
          
          {/* Date Selection */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Choose Date:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {availableDates.map((date) => {
                const dateObj = new Date(date);
                const isSelected = selectedDate === date;
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 shadow-lg transform scale-105'
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-xs text-gray-600">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="text-2xl font-bold text-gray-800">{dateObj.getDate()}</p>
                    <p className="text-xs text-gray-600">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Choose Time:</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {timeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  const isUnavailable = Math.random() > 0.7; // Random unavailability for demo
                  return (
                    <button
                      key={time}
                      onClick={() => !isUnavailable && setSelectedTime(time)}
                      disabled={isUnavailable}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        isUnavailable
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isSelected
                          ? 'border-teal-500 bg-teal-50 text-teal-600 shadow-lg transform scale-105'
                          : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reason for Visit */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
            {appointmentType === 'physical' ? 'Step 4' : 'Step 3'}: Reason for Visit (Optional)
          </h3>
          <textarea
            value={reasonForVisit}
            onChange={(e) => setReasonForVisit(e.target.value)}
            placeholder="Describe your symptoms or reason for consultation..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-2 italic">💡 AI Tip: Providing details helps the doctor prepare for your consultation</p>
        </div>
      </div>

      {/* Sticky Summary Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-teal-500 shadow-2xl p-6 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">Booking Summary:</p>
            <p className="text-lg font-bold text-gray-800">
              {selectedDoctor.name} • {appointmentType === 'physical' ? 'Physical' : 'Virtual'} 
              {selectedDate && ` • ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
              {selectedTime && ` • ${selectedTime}`}
            </p>
            {appointmentType === 'physical' && selectedHospital && (
              <p className="text-sm text-gray-600">{selectedHospital.name}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Total Fee:</p>
            <p className="text-3xl font-bold text-teal-600">
              ₹{appointmentType === 'physical' ? selectedDoctor.physicalFee : selectedDoctor.virtualFee}
            </p>
          </div>
          <button
            onClick={handleConfirmAppointment}
            disabled={!selectedDate || !selectedTime || (appointmentType === 'physical' && !selectedHospital)}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
              !selectedDate || !selectedTime || (appointmentType === 'physical' && !selectedHospital)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-2xl transform hover:scale-105'
            }`}
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
