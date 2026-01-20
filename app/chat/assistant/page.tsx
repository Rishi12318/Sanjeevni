'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  quickActions?: string[];
  doctorRecommendation?: {
    name: string;
    specialization: string;
    reason: string;
  };
}

export default function AIHealthAssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initial greeting
    setMessages([{
      id: '1',
      text: "Hello! 👋 I'm your AI Health Assistant. I'm here to help you with health information, symptom checks, and connecting you with the right doctors. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      quickActions: ['Check Symptoms', 'Find a Doctor', 'Book Appointment', 'Health Tips']
    }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      let botMessage: Message = {
        id: Date.now().toString(),
        text: '',
        sender: 'bot',
        timestamp: new Date()
      };

      const lowerMessage = userMessage.toLowerCase();

      // Symptom check responses
      if (lowerMessage.includes('headache') || lowerMessage.includes('head pain')) {
        botMessage.text = "I understand you're experiencing headaches. This could be due to various reasons like stress, dehydration, or tension. Let me ask you a few questions:\n\n• How long have you had this headache?\n• Is it a throbbing or constant pain?\n• Do you have any other symptoms like nausea or sensitivity to light?\n\nBased on your symptoms, I can recommend the right specialist for you.";
        botMessage.quickActions = ['Mild headache', 'Severe headache', 'With other symptoms'];
      } 
      else if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
        botMessage.text = "Fever can indicate an infection or inflammation. To help you better:\n\n• What is your temperature reading?\n• How long have you had the fever?\n• Any other symptoms like cough, sore throat, or body ache?\n\nI can connect you with a General Physician who can diagnose and treat you properly.";
        botMessage.quickActions = ['Book Doctor', 'Home Remedies', 'Emergency'];
        botMessage.doctorRecommendation = {
          name: 'Dr. Michael Chen',
          specialization: 'General Physician',
          reason: 'Best suited for fever diagnosis and treatment'
        };
      }
      else if (lowerMessage.includes('chest pain') || lowerMessage.includes('heart')) {
        botMessage.text = "⚠️ Chest pain requires immediate attention. I recommend:\n\n1. If severe or accompanied by shortness of breath - Call 108 immediately\n2. For mild discomfort - Consult with a Cardiologist\n3. Avoid physical exertion until checked\n\nWould you like me to book an urgent appointment with our Cardiologist?";
        botMessage.quickActions = ['Emergency Call', 'Book Cardiologist', 'More Info'];
        botMessage.doctorRecommendation = {
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiologist',
          reason: 'Immediate cardiac consultation recommended'
        };
      }
      else if (lowerMessage.includes('skin') || lowerMessage.includes('rash') || lowerMessage.includes('acne')) {
        botMessage.text = "For skin concerns, a Dermatologist can provide the best treatment. Common issues include:\n\n• Acne and breakouts\n• Rashes and allergies\n• Skin infections\n• Pigmentation issues\n\nI can connect you with Dr. Emily Rodriguez, our experienced Dermatologist.";
        botMessage.quickActions = ['Book Dermatologist', 'Skin Care Tips'];
        botMessage.doctorRecommendation = {
          name: 'Dr. Emily Rodriguez',
          specialization: 'Dermatologist',
          reason: 'Expert in treating all skin conditions'
        };
      }
      else if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('mental')) {
        botMessage.text = "I understand mental health is just as important as physical health. It's great that you're reaching out. I can help you with:\n\n• Stress management techniques\n• Breathing exercises\n• Professional counseling referrals\n• Mindfulness resources\n\nWould you like some immediate relaxation techniques or prefer to speak with a mental health professional?";
        botMessage.quickActions = ['Breathing Exercise', 'Book Counselor', 'Self-Care Tips'];
      }
      else if (lowerMessage.includes('find') && lowerMessage.includes('doctor')) {
        botMessage.text = "I can help you find the right doctor! We have:\n\n• General Physicians - For common health issues\n• Cardiologists - Heart and cardiovascular health\n• Dermatologists - Skin, hair, and nail concerns\n• And many more specialists\n\nWhat type of doctor are you looking for?";
        botMessage.quickActions = ['General Physician', 'Cardiologist', 'Dermatologist', 'View All'];
      }
      else if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
        botMessage.text = "I'd be happy to help you book an appointment! You can:\n\n1. Choose from our available doctors\n2. Select Physical or Virtual consultation\n3. Pick your preferred date and time\n\nWould you like to proceed with booking?";
        botMessage.quickActions = ['Yes, Book Now', 'View Doctors First'];
      }
      else if (lowerMessage.includes('tip') || lowerMessage.includes('health')) {
        botMessage.text = "Here are some daily health tips for you:\n\n• 💧 Drink 8 glasses of water daily\n• 🥗 Eat a balanced diet with fruits and vegetables\n• 🏃 Exercise for at least 30 minutes\n• 😴 Get 7-8 hours of quality sleep\n• 🧘 Practice stress management\n\nWould you like personalized health recommendations based on your profile?";
        botMessage.quickActions = ['Get Personalized Tips', 'Nutrition Advice', 'Exercise Plan'];
      }
      else {
        botMessage.text = "I'm here to help! I can assist you with:\n\n• 🩺 Symptom checking\n• 👨‍⚕️ Finding the right doctor\n• 📅 Booking appointments\n• 💊 General health information\n• 🏥 Locating nearby hospitals\n\nPlease tell me what you need help with, or choose from the options below.";
        botMessage.quickActions = ['Check Symptoms', 'Find Doctor', 'Book Appointment', 'Health Tips'];
      }

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    simulateBotResponse(input);
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
    handleSend();
  };

  const handleBookDoctor = (doctorName: string) => {
    router.push('/appointments/book?fromAI=true&doctor=' + encodeURIComponent(doctorName));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-6 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="text-white hover:text-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl text-white font-bold" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
              AI Health Assistant
            </h1>
            <p className="text-white text-sm opacity-90">24/7 Medical Support</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white text-sm">Online</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'bot' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 font-semibold">AI Assistant</span>
                  </div>
                )}
                
                <div className={`${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-3xl rounded-tr-none'
                    : 'bg-white text-gray-800 rounded-3xl rounded-tl-none shadow-lg'
                } px-6 py-4`}>
                  <p className="whitespace-pre-line" style={{ fontStyle: message.sender === 'bot' ? 'italic' : 'normal' }}>
                    {message.text}
                  </p>
                  <p className="text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Doctor Recommendation Card */}
                {message.doctorRecommendation && (
                  <div className="mt-4 bg-white rounded-2xl p-4 shadow-lg border-2 border-teal-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">👨‍⚕️ Recommended Doctor:</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-800">{message.doctorRecommendation.name}</p>
                        <p className="text-sm text-teal-600">{message.doctorRecommendation.specialization}</p>
                        <p className="text-xs text-gray-600 mt-1 italic">{message.doctorRecommendation.reason}</p>
                      </div>
                      <button
                        onClick={() => handleBookDoctor(message.doctorRecommendation!.name)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Action Buttons */}
                {message.quickActions && message.quickActions.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {message.quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleQuickAction(action)}
                        className="bg-teal-50 hover:bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold border border-teal-200 transition-all"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 rounded-3xl rounded-tl-none shadow-lg px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t-4 border-teal-500 px-6 py-4 shadow-2xl">
        <div className="max-w-4xl mx-auto">
          {/* Disclaimer */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r-xl">
            <p className="text-xs text-yellow-800 italic">
              💡 This AI provides general health information. Always consult a healthcare professional for medical advice.
            </p>
          </div>

          {/* Input Field */}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your health question..."
              className="flex-1 bg-gray-100 border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              style={{ fontStyle: 'italic' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all ${
                input.trim()
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
