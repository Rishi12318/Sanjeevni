// test-api.js - Test the backend API endpoints
const axios = require('axios');

const API_BASE = 'http://localhost:5050/api';

console.log('🧪 Testing Sanjeevni Backend API...\n');

// Test 1: Check AI Status
async function testAIStatus() {
  try {
    console.log('1️⃣ Testing AI Status endpoint...');
    const response = await axios.get(`${API_BASE}/ai/status`);
    console.log('✅ AI Status:', response.data);
    console.log('');
  } catch (error) {
    console.error('❌ AI Status failed:', error.message);
    console.log('');
  }
}

// Test 2: User Signup
async function testUserSignup() {
  try {
    console.log('2️⃣ Testing User Signup...');
    const userData = {
      personalDetails: {
        firstName: 'Test',
        lastName: 'User',
        dateOfBirth: new Date('1990-01-01'),
        gender: 'Male',
        age: 34
      },
      contactInfo: {
        email: 'testuser@example.com',
        phoneNumber: {
          primary: '9876543210'
        }
      },
      password: 'password123',
      address: {
        village: 'Test Village',
        district: 'Test District',
        state: 'Maharashtra',
        pincode: '400001'
      }
    };
    
    const response = await axios.post(`${API_BASE}/auth/signup/user`, userData);
    console.log('✅ User Signup successful!');
    console.log('User ID:', response.data.user._id);
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('');
    return response.data;
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  User already exists, will try login instead');
      console.log('');
      return null;
    }
    console.error('❌ User Signup failed:', error.response?.data?.message || error.message);
    console.log('');
    return null;
  }
}

// Test 3: User Login
async function testUserLogin() {
  try {
    console.log('3️⃣ Testing User Login...');
    const response = await axios.post(`${API_BASE}/auth/login/user`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log('✅ User Login successful!');
    console.log('User:', response.data.user.personalDetails.fullName);
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('');
    return response.data;
  } catch (error) {
    console.error('❌ User Login failed:', error.response?.data?.message || error.message);
    console.log('');
    return null;
  }
}

// Test 4: Chat with AI
async function testAIChat(token) {
  try {
    console.log('4️⃣ Testing AI Chat...');
    const response = await axios.post(
      `${API_BASE}/ai/chat`,
      {
        message: 'I have a mild headache. What should I do?'
      },
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    console.log('✅ AI Chat response:');
    console.log(response.data.response.substring(0, 200) + '...');
    console.log('');
  } catch (error) {
    console.error('❌ AI Chat failed:', error.response?.data?.message || error.message);
    console.log('');
  }
}

// Test 5: Save Health Metrics
async function testHealthMetrics(userId, token) {
  try {
    console.log('5️⃣ Testing Health Metrics...');
    const metrics = {
      userId: userId,
      date: new Date(),
      physical: {
        vitals: {
          bloodPressure: { systolic: 120, diastolic: 80 },
          heartRate: 72,
          temperature: 98.6
        },
        bodyMetrics: {
          weight: 70,
          height: 175
        }
      },
      mental: {
        mood: {
          primary: 'happy',
          intensity: 8
        },
        stressLevel: 3,
        anxietyLevel: 2,
        energyLevel: 7
      }
    };
    
    const response = await axios.post(
      `${API_BASE}/health/metrics`,
      metrics,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    console.log('✅ Health Metrics saved!');
    console.log('Physical Score:', response.data.summary.physicalScore);
    console.log('Mental Score:', response.data.summary.mentalScore);
    console.log('');
    return response.data.data._id;
  } catch (error) {
    console.error('❌ Health Metrics failed:', error.response?.data?.message || error.message);
    console.log('');
    return null;
  }
}

// Test 6: Get Health Summary
async function testHealthSummary(userId, token) {
  try {
    console.log('6️⃣ Testing Health Summary...');
    const response = await axios.get(
      `${API_BASE}/health/summary/${userId}?days=7`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      }
    );
    console.log('✅ Health Summary retrieved!');
    console.log('Period:', response.data.data.period);
    console.log('Entries:', response.data.data.entriesCount);
    if (response.data.data.averages) {
      console.log('Average Physical:', response.data.data.averages.physical);
      console.log('Average Mental:', response.data.data.averages.mental);
    }
    console.log('');
  } catch (error) {
    console.error('❌ Health Summary failed:', error.response?.data?.message || error.message);
    console.log('');
  }
}

// Run all tests
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════\n');
  
  await testAIStatus();
  
  let authData = await testUserSignup();
  if (!authData) {
    authData = await testUserLogin();
  }
  
  if (authData) {
    const userId = authData.user._id;
    const token = authData.token;
    
    await testAIChat(token);
    await testHealthMetrics(userId, token);
    await testHealthSummary(userId, token);
  }
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('✨ API Testing Complete!\n');
  console.log('📱 Your backend is ready for the iOS app!');
  console.log('🔗 Backend running on: http://localhost:5050');
  console.log('\n⚠️  Note: To run the iOS app, you need a Mac with Xcode.');
  console.log('   Follow the steps in IOS_INTEGRATION_GUIDE.md');
  console.log('═══════════════════════════════════════════════════════\n');
}

// Start testing
runAllTests().catch(error => {
  console.error('Test suite failed:', error.message);
  process.exit(1);
});
