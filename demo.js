// demo.js - Interactive Demo of SanjeevniAI Backend
const axios = require('axios');
const readline = require('readline');

const API_BASE = 'http://localhost:3000/api';
let currentUser = null;
let authToken = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function displayMenu() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         🏥 SanjeevniAI - Backend Demo System 🏥           ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  if (!currentUser) {
    console.log('  1. 👤 Create New User Account');
    console.log('  2. 🔑 Login as Existing User');
    console.log('  3. 👨‍⚕️ Create Doctor Account');
    console.log('  4. 🏢 Create NGO Account');
  } else {
    console.log(`  ✅ Logged in as: ${currentUser.personalDetails?.firstName || currentUser.organizationDetails?.name}\n`);
    console.log('  5. 🤖 Chat with AI Medical Assistant');
    console.log('  6. 💊 Save Health Metrics');
    console.log('  7. 📊 View Health Summary');
    console.log('  8. 📅 Book Appointment (User only)');
    console.log('  9. 📋 View My Appointments');
    console.log('  10. 💬 View Chat History');
    console.log('  11. 🚪 Logout');
  }
  console.log('  0. ❌ Exit\n');
}

async function createUser() {
  console.log('\n═══ Create New User Account ═══');
  const firstName = await question('First Name: ');
  const lastName = await question('Last Name: ');
  const email = await question('Email: ');
  const phone = await question('Phone (10 digits): ');
  const password = await question('Password: ');
  const village = await question('Village/City: ');
  const district = await question('District: ');
  const state = await question('State: ');
  const pincode = await question('Pincode (6 digits): ');
  const age = await question('Age: ');
  const gender = await question('Gender (Male/Female/Other): ');
  
  try {
    const userData = {
      personalDetails: {
        firstName,
        lastName,
        dateOfBirth: new Date(new Date().getFullYear() - parseInt(age), 0, 1),
        gender,
        age: parseInt(age)
      },
      contactInfo: {
        email,
        phoneNumber: { primary: phone }
      },
      password,
      address: { village, district, state, pincode }
    };
    
    const response = await axios.post(`${API_BASE}/auth/signup/user`, userData);
    console.log('\n✅ User account created successfully!');
    currentUser = response.data.user;
    authToken = response.data.token;
    console.log(`Welcome, ${currentUser.personalDetails.firstName}!`);
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
  }
}

async function loginUser() {
  console.log('\n═══ Login ═══');
  const email = await question('Email: ');
  const password = await question('Password: ');
  
  try {
    const response = await axios.post(`${API_BASE}/auth/login/user`, { email, password });
    console.log('\n✅ Login successful!');
    currentUser = response.data.user;
    authToken = response.data.token;
    console.log(`Welcome back, ${currentUser.personalDetails.firstName}!`);
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
  }
}

async function chatWithAI() {
  console.log('\n═══ AI Medical Assistant ═══');
  console.log('Type your medical question (or "back" to return):\n');
  
  const message = await question('You: ');
  if (message.toLowerCase() === 'back') return;
  
  try {
    const response = await axios.post(
      `${API_BASE}/ai/chat`,
      { message },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('\n🤖 AI Assistant:', response.data.response);
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
  }
}

async function saveHealthMetrics() {
  console.log('\n═══ Save Health Metrics ═══');
  
  const weight = await question('Weight (kg): ');
  const height = await question('Height (cm): ');
  const bloodPressureSys = await question('Blood Pressure - Systolic: ');
  const bloodPressureDia = await question('Blood Pressure - Diastolic: ');
  const heartRate = await question('Heart Rate (bpm): ');
  const mood = await question('Mood (happy/sad/anxious/calm): ');
  const stress = await question('Stress Level (1-10): ');
  const sleep = await question('Sleep Quality (1-10): ');
  
  try {
    const metrics = {
      userId: currentUser._id,
      date: new Date(),
      physical: {
        vitals: {
          bloodPressure: { 
            systolic: parseInt(bloodPressureSys), 
            diastolic: parseInt(bloodPressureDia) 
          },
          heartRate: parseInt(heartRate)
        },
        bodyMetrics: {
          weight: parseFloat(weight),
          height: parseFloat(height)
        }
      },
      mental: {
        mood: { primary: mood, intensity: 7 },
        stressLevel: parseInt(stress),
        sleepQuality: parseInt(sleep),
        energyLevel: 10 - parseInt(stress)
      }
    };
    
    const response = await axios.post(
      `${API_BASE}/health/metrics`,
      metrics,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    console.log('\n✅ Health metrics saved successfully!');
    console.log(`Physical Score: ${response.data.summary.physicalScore}/100`);
    console.log(`Mental Score: ${response.data.summary.mentalScore}/100`);
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
  }
}

async function viewHealthSummary() {
  console.log('\n═══ Health Summary ═══');
  
  try {
    const response = await axios.get(
      `${API_BASE}/health/summary/${currentUser._id}?days=30`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    const summary = response.data.data;
    console.log(`\nPeriod: ${summary.period}`);
    console.log(`Total Entries: ${summary.entriesCount}`);
    
    if (summary.averages) {
      console.log('\n📊 Average Scores:');
      console.log(`  Physical Health: ${summary.averages.physical || 'N/A'}/100`);
      console.log(`  Mental Health: ${summary.averages.mental || 'N/A'}/100`);
      console.log(`  Overall: ${summary.averages.overall || 'N/A'}/100`);
    }
    
    if (summary.latest) {
      console.log('\n📈 Latest Reading:');
      console.log(`  Physical: ${summary.latest.physicalScore || 'N/A'}/100`);
      console.log(`  Mental: ${summary.latest.mentalScore || 'N/A'}/100`);
    }
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.message || error.message);
  }
}

async function main() {
  console.log('\n🚀 Starting SanjeevniAI Backend Demo...\n');
  console.log('⚡ Make sure the backend server is running on http://localhost:3000\n');
  
  let running = true;
  
  while (running) {
    displayMenu();
    const choice = await question('Select an option: ');
    
    switch (choice) {
      case '1':
        await createUser();
        break;
      case '2':
        await loginUser();
        break;
      case '5':
        if (currentUser) await chatWithAI();
        break;
      case '6':
        if (currentUser) await saveHealthMetrics();
        break;
      case '7':
        if (currentUser) await viewHealthSummary();
        break;
      case '11':
        currentUser = null;
        authToken = null;
        console.log('\n✅ Logged out successfully!');
        break;
      case '0':
        running = false;
        console.log('\n👋 Thank you for using SanjeevniAI!\n');
        break;
      default:
        console.log('\n⚠️  Invalid option or feature not yet implemented');
    }
    
    if (running && choice !== '0') {
      await question('\nPress Enter to continue...');
    }
  }
  
  rl.close();
  process.exit(0);
}

// Start the demo
main().catch(error => {
  console.error('Demo error:', error.message);
  rl.close();
  process.exit(1);
});
