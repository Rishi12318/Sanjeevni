# Quick Start Guide - SanjeevAnI AI Medical Platform

## Prerequisites Setup

### 1. Install Ollama (Required for AI Features)

**Download and Install:**
- Visit: https://ollama.ai/download
- Download the Windows installer
- Run the installer (Ollama will start automatically)

**Verify Installation:**
```powershell
ollama --version
```

### 2. Pull the Medical AI Model

```powershell
ollama pull monotykamary/medichat-llama3
```

This will download ~4.7GB. Wait for completion.

**Verify Model:**
```powershell
ollama list
```

You should see `monotykamary/medichat-llama3` in the list.

## Start the Application

### 1. Ensure MongoDB is Running

```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Start if not running
net start MongoDB
```

### 2. Start the Server

```powershell
npm start
```

You should see:
```
✓ Onnet: Connected to MongoDB
✓ Ollama AI Service is available
✓ medichat-llama3 model is ready
🚀 Sanjeevni application started successfully!
📡 Server running on http://localhost:5050
```

## Access the Application

### Main Pages
- **Homepage:** http://localhost:5050
- **Signup:** http://localhost:5050/signup
- **Login:** http://localhost:5050/login
- **AI Assistant:** http://localhost:5050/ai-assistant.html
- **User Registration:** http://localhost:5050/user-registration.html

### API Endpoints

**Authentication:**
- POST `/api/auth/signup/user` - Patient registration
- POST `/api/auth/signup/doctor` - Doctor registration  
- POST `/api/auth/signup/ngo` - NGO registration
- POST `/api/auth/login/user` - Patient login
- POST `/api/auth/login/doctor` - Doctor login
- POST `/api/auth/login/ngo` - NGO login

**AI Medical Assistant:**
- GET `/api/ai/status` - Check AI service status
- POST `/api/ai/triage` - Medical triage assessment
- POST `/api/ai/symptoms` - Symptom analysis
- POST `/api/ai/advice` - Health advice
- POST `/api/ai/emergency` - Emergency assessment
- POST `/api/ai/medication` - Medication information
- POST `/api/ai/chat` - Chat with AI

## Test the AI Features

### Using the Web Interface

1. Open: http://localhost:5050/ai-assistant.html
2. Check the status indicator (should show "AI Service Available")
3. Try each feature:
   - **Medical Triage:** Enter symptoms and get urgency assessment
   - **Symptom Analysis:** Describe symptoms for possible conditions
   - **Health Advice:** Ask health questions
   - **Medication Info:** Look up medication information
   - **Chat:** Have a conversation with the medical AI

### Using API (via PowerShell/curl)

**Check AI Status:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5050/api/ai/status" -Method GET
```

**Medical Triage:**
```powershell
$body = @{
    patientData = @{
        age = 45
        gender = "male"
        complaint = "chest pain"
        symptoms = @("chest pain", "shortness of breath")
        painLevel = 8
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5050/api/ai/triage" -Method POST -Body $body -ContentType "application/json"
```

**Symptom Analysis:**
```powershell
$body = @{
    symptoms = "fever, cough, body ache for 3 days"
    patientHistory = @{
        age = 35
        gender = "female"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5050/api/ai/symptoms" -Method POST -Body $body -ContentType "application/json"
```

**Health Advice:**
```powershell
$body = @{
    query = "How to manage diabetes with diet?"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5050/api/ai/advice" -Method POST -Body $body -ContentType "application/json"
```

## Troubleshooting

### AI Service Not Available

**Check Ollama is Running:**
```powershell
# Check Ollama process
Get-Process ollama -ErrorAction SilentlyContinue

# Restart Ollama (if needed)
ollama serve
```

**Check Model is Installed:**
```powershell
ollama list
```

If model is missing:
```powershell
ollama pull monotykamary/medichat-llama3
```

### MongoDB Connection Issues

```powershell
# Check MongoDB service
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Check if port 27017 is listening
netstat -ano | findstr :27017
```

### Port Already in Use

If port 5050 is in use, change it:
```powershell
$env:PORT=5051
npm start
```

### Slow AI Responses

First AI request may take 30-60 seconds (model loading). Subsequent requests are faster.

**Tips for Better Performance:**
- Keep Ollama running (don't stop between requests)
- Use GPU if available (Ollama auto-detects)
- Ensure 8GB+ RAM available
- Close other heavy applications

## Features Overview

### For Patients (Users)
- Comprehensive medical profile with chronic conditions tracking
- AI-powered symptom checker
- Medical triage assessment
- Health advice chatbot
- Medication information lookup
- Emergency assessment

### For Doctors
- Professional verification system
- Specialization and availability management
- Patient consultation tracking
- License and credential verification
- AI-assisted diagnosis support

### For NGOs
- Organization verification
- Service area coverage tracking
- Team and resource management
- Health camp organization
- Emergency response coordination
- Impact metrics tracking

### AI Capabilities
- **Medical Triage:** Urgency assessment (critical/high/moderate/low)
- **Symptom Analysis:** Differential diagnosis suggestions
- **Health Advice:** Culturally appropriate health guidance
- **Emergency Assessment:** Critical situation evaluation
- **Medication Info:** Drug information with allergy warnings
- **Chat:** Interactive medical consultation

## Important Disclaimers

⚠️ **Medical AI Disclaimer:**
- AI responses are for informational purposes only
- NOT a substitute for professional medical advice
- Always consult qualified healthcare professionals
- In emergencies, call emergency services immediately
- Verify all AI recommendations with doctors

## Next Steps

1. ✅ Test AI features on http://localhost:3000/ai-assistant.html
2. ✅ Register test accounts for User, Doctor, NGO
3. ✅ Verify MongoDB data storage
4. 🔄 Add JWT authentication to AI routes
5. 🔄 Implement multi-language support (Hindi, Punjabi)
6. 🔄 Add voice input for rural users
7. 🔄 Create mobile-responsive UI
8. 🔄 Deploy to production server

## Resources

- **Ollama Docs:** https://github.com/ollama/ollama
- **Ollama API:** https://github.com/ollama/ollama/blob/main/docs/api.md
- **Model Info:** https://ollama.ai/library/monotykamary/medichat-llama3
- **MongoDB Docs:** https://docs.mongodb.com
- **Express.js:** https://expressjs.com

## Support

If you encounter issues:
1. Check logs in terminal
2. Verify all services are running (MongoDB, Ollama)
3. Check `OLLAMA_SETUP.md` for detailed troubleshooting
4. Review API endpoint documentation above

---

**Current Version:** 1.0.0  
**Last Updated:** October 31, 2025
