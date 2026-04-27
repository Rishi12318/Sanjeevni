# SanjeevniAI iOS App - Backend Integration Guide

## ✅ Backend Setup Complete

Your Node.js backend is now running and ready for the iOS app!

**Server Status:** Running on `http://localhost:3000`
**Database:** MongoDB connected to `progome` database

---

## 📱 iOS App Integration Steps

### Step 1: Add New Swift Files to Xcode Project

1. Open `SanjeevniAI.xcodeproj` in Xcode
2. Add these new files to your project:
   - `APIService.swift` (✅ Created)
   - `AuthenticationManager.swift` (✅ Created)

**How to add:**
- Drag and drop the files from Finder into your Xcode project navigator
- Make sure "Copy items if needed" is checked
- Ensure "SanjeevniAI" target is selected

### Step 2: Update APIConfig for Your Network

**For iOS Simulator (Mac):**
```swift
// In APIService.swift, line 14
static let baseURL = "http://localhost:3000/api"
```

**For Real iPhone/iPad Device:**
1. Find your computer's IP address:
   ```powershell
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Update APIService.swift:
   ```swift
   static let baseURL = "http://192.168.1.100:3000/api"
   ```

### Step 3: Update ContentView.swift to Use Real Authentication

Replace the hardcoded login in `ContentView.swift` with real API calls.

**Find this code (around line 73):**
```swift
func login(email: String, role: String) {
    self.userEmail = email
    self.currentRole = role
    self.userName = "Shubham" // Hardcoded for demo
    self.isAuthenticated = true
    self.needsSurvey = true
}
```

**Replace with:**
```swift
@Published var authManager = AuthenticationManager.shared

func login(email: String, password: String, role: String) {
    authManager.login(role: role, email: email, password: password) { success, error in
        if success {
            self.userEmail = email
            self.currentRole = role
            self.userName = authManager.getUserName()
            self.isAuthenticated = true
            self.needsSurvey = true
        } else {
            print("Login failed: \(error ?? "Unknown error")")
        }
    }
}
```

### Step 4: Update Info.plist for Network Access

Add this to your `Info.plist` to allow HTTP connections in development:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

**In Xcode:**
1. Select `Info.plist`
2. Click the `+` button
3. Add "App Transport Security Settings" (Dictionary)
4. Inside it, add "Allow Arbitrary Loads" (Boolean) = YES

---

## 🔌 Available API Endpoints

### Authentication
- `POST /api/auth/signup/user` - User signup
- `POST /api/auth/signup/doctor` - Doctor signup
- `POST /api/auth/signup/ngo` - NGO signup
- `POST /api/auth/login/user` - User login
- `POST /api/auth/login/doctor` - Doctor login
- `POST /api/auth/login/ngo` - NGO login

### AI Medical Assistant
- `POST /api/ai/chat` - Chat with AI assistant
- `POST /api/ai/triage` - Medical triage assessment
- `POST /api/ai/symptoms` - Symptom analysis
- `POST /api/ai/advice` - Health advice
- `POST /api/ai/emergency` - Emergency assessment
- `POST /api/ai/medication` - Medication information

### Chat History
- `POST /api/chat/save` - Save conversation
- `GET /api/chat/user/:userId` - Get user's chat history

### Appointments
- `POST /api/appointments/create` - Book appointment
- `GET /api/appointments/patient/:patientId` - Get patient appointments
- `GET /api/appointments/doctor/:doctorId` - Get doctor appointments
- `PUT /api/appointments/:id/confirm` - Confirm appointment
- `PUT /api/appointments/:id/complete` - Complete appointment

### Health Metrics
- `POST /api/health/metrics` - Save health data
- `GET /api/health/summary/:userId` - Get health summary
- `GET /api/health/trends/:userId` - Get health trends

---

## 📝 Example Usage in SwiftUI

### 1. Login Example
```swift
Button("Login") {
    AuthenticationManager.shared.login(
        role: "User",
        email: "user@example.com",
        password: "password123"
    ) { success, error in
        if success {
            print("Login successful!")
        } else {
            print("Error: \(error ?? "Unknown")")
        }
    }
}
```

### 2. Chat with AI Example
```swift
APIService.shared.chatWithAI(message: "I have a headache")
    .sink { completion in
        if case .failure(let error) = completion {
            print("Error: \(error)")
        }
    } receiveValue: { response in
        if let aiResponse = response.data {
            print("AI: \(aiResponse.response)")
        }
    }
    .store(in: &cancellables)
```

### 3. Save Health Metrics Example
```swift
let metrics: [String: Any] = [
    "physical": [
        "vitals": [
            "bloodPressure": ["systolic": 120, "diastolic": 80],
            "heartRate": 72
        ]
    ],
    "mental": [
        "mood": ["primary": "happy", "intensity": 8],
        "stressLevel": 3
    ]
]

APIService.shared.saveHealthMetrics(userId: userId, metrics: metrics)
    .sink { completion in
        // Handle completion
    } receiveValue: { response in
        print("Metrics saved!")
    }
    .store(in: &cancellables)
```

---

## 🔧 Testing the Integration

### Test 1: Check Server is Running
Open browser: `http://localhost:3000`
You should see the Sanjeevni homepage

### Test 2: Test API Endpoint
In Terminal/PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/ai/status" -Method GET
```

Expected response:
```json
{
  "success": true,
  "service": "Gemini AI Medical Assistant",
  "status": "connected"
}
```

### Test 3: Test from iOS Simulator
1. Build and run the app in Xcode
2. Try to login/signup
3. Check Xcode console for network logs

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to server"
**Solution:**
- Make sure backend is running (`node index.js`)
- Check if using correct IP address
- Verify Info.plist has App Transport Security settings

### Problem: "Invalid response"
**Solution:**
- Check server terminal for errors
- Verify API endpoint URLs match
- Use Postman to test endpoints directly

### Problem: "Authentication failed"
**Solution:**
- Make sure you're using correct role (User/Doctor/NGO)
- Check email and password format
- Verify user exists in MongoDB

---

## 📊 Database Models

Your backend has these models ready:

1. **User** - Patient medical records
2. **Doctor** - Doctor profiles and credentials
3. **NGO** - NGO organization details
4. **ChatHistory** - AI conversation history
5. **Appointment** - Doctor appointments
6. **HealthMetrics** - Physical & mental health tracking

---

## 🚀 Next Steps

1. **Add these files to Xcode** (APIService.swift, AuthenticationManager.swift)
2. **Update Info.plist** for network access
3. **Modify ContentView.swift** to use AuthenticationManager
4. **Test login/signup** functionality
5. **Integrate AI chat** with real API calls
6. **Add health metrics** tracking
7. **Implement appointments** booking

---

## 📱 Running the Complete System

**Terminal 1 - Backend Server:**
```powershell
cd C:\Users\rishi\OneDrive\Desktop\sanjeevni
node index.js
```

**Xcode - iOS App:**
1. Open SanjeevniAI.xcodeproj
2. Select iPhone simulator or your device
3. Press ▶️ Run

Both should be running simultaneously for the app to work!

---

## 💡 Pro Tips

1. **Development:** Use iOS Simulator with localhost
2. **Testing on Device:** Use your computer's IP address
3. **Production:** Deploy backend to cloud (Heroku, AWS, Azure)
4. **Security:** Add proper JWT validation and HTTPS in production

---

## ✅ Current Status

- ✅ Backend API running on port 3000
- ✅ MongoDB connected
- ✅ CORS enabled for mobile app
- ✅ All routes configured (Auth, AI, Chat, Appointments, Health)
- ✅ Swift API service files created
- ✅ Authentication manager ready
- ⏳ Need to integrate with Xcode project
- ⏳ Need to update ContentView.swift

**Your backend is ready! Now integrate it with your iOS app! 🎉**
