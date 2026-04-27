// index.js - Main application entry point for Sanjeevni
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connect, disconnect } = require('./onnet-db');
const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');
const aiRoutes = require('./routes/ai');
const chatRoutes = require('./routes/chat');
const appointmentRoutes = require('./routes/appointments');
const healthMetricsRoutes = require('./routes/healthMetrics');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for mobile app
app.use(cors({
  origin: '*', // Allow all origins for development (restrict in production)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health', healthMetricsRoutes);

// Serve HTML pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start server
async function startServer() {
  let dbConnected = false;
  try {
    await connect();
    dbConnected = true;
  } catch (err) {
    console.error('⚠️  Continuing without database connection. Some API routes may not work.');
  }

  // Start Express server regardless, so static pages work
  app.listen(PORT, () => {
    console.log('\n🚀 Sanjeevni application started successfully!');
    console.log(`📡 Server running on http://localhost:${PORT}`);
    if (!dbConnected) {
      console.log('   (DB not connected - check MONGO_URI or start MongoDB)');
    }
    console.log('\n📋 Available routes:');
    console.log('   - Homepage: http://localhost:' + PORT);
    console.log('   - Signup: http://localhost:' + PORT + '/signup');
    console.log('   - Login: http://localhost:' + PORT + '/login');
    console.log('\n📚 API Endpoints:');
    console.log('   POST /api/auth/signup/user - User signup');
    console.log('   POST /api/auth/signup/doctor - Doctor signup');
    console.log('   POST /api/auth/signup/ngo - NGO signup');
    console.log('   POST /api/auth/login/user - User login');
    console.log('   POST /api/auth/login/doctor - Doctor login');
    console.log('   POST /api/auth/login/ngo - NGO login');
    console.log('\n📧 OTP Verification:');
    console.log('   POST /api/otp/send-otp - Send OTP to email');
    console.log('   POST /api/otp/verify-otp - Verify OTP');
    console.log('   POST /api/otp/resend-otp - Resend OTP');
    console.log('\n🤖 AI Medical Assistant:');
    console.log('   GET  /api/ai/status - Check AI service status');
    console.log('   POST /api/ai/triage - Medical triage assessment');
    console.log('   POST /api/ai/symptoms - Symptom analysis');
    console.log('   POST /api/ai/advice - Health advice');
    console.log('   POST /api/ai/emergency - Emergency assessment');
    console.log('   POST /api/ai/medication - Medication information');
    console.log('   POST /api/ai/chat - Chat with AI');
    console.log('\n💬 Chat History:');
    console.log('   POST /api/chat/save - Save chat conversation');
    console.log('   GET  /api/chat/user/:userId - Get user chat history');
    console.log('   GET  /api/chat/session/:sessionId - Get specific session');
    console.log('\n📅 Appointments:');
    console.log('   POST /api/appointments/create - Book appointment');
    console.log('   GET  /api/appointments/patient/:patientId - Patient appointments');
    console.log('   GET  /api/appointments/doctor/:doctorId - Doctor appointments');
    console.log('   PUT  /api/appointments/:id/confirm - Confirm appointment');
    console.log('   PUT  /api/appointments/:id/cancel - Cancel appointment');
    console.log('   PUT  /api/appointments/:id/complete - Complete appointment');
    console.log('\n🏥 Health Metrics:');
    console.log('   POST /api/health/metrics - Save health data');
    console.log('   GET  /api/health/metrics/user/:userId - Get health history');
    console.log('   GET  /api/health/summary/:userId - Get health summary');
    console.log('   GET  /api/health/trends/:userId - Get health trends\n');
  });
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await disconnect();
  process.exit(0);
});

// Run the application
startServer();
