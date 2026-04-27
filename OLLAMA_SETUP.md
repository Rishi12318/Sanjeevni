# Ollama AI Setup for SanjeevAnI

## Installation Instructions

### Step 1: Install Ollama

**Windows:**
1. Download Ollama from: https://ollama.ai/download
2. Run the installer
3. Ollama will start automatically as a service

**Verify Installation:**
```powershell
ollama --version
```

### Step 2: Pull the Medical AI Model

Once Ollama is installed, pull the medichat-llama3 model:

```powershell
ollama pull monotykamary/medichat-llama3
```

This may take several minutes depending on your internet connection (model size: ~4.7GB).

### Step 3: Verify Model Installation

```powershell
ollama list
```

You should see `monotykamary/medichat-llama3` in the list.

### Step 4: Test the Model

```powershell
ollama run monotykamary/medichat-llama3
```

Try a test query:
```
What are the symptoms of diabetes?
```

Type `/bye` to exit.

### Step 5: Configure Environment Variables (Optional)

Create a `.env` file in your project root if you need to customize:

```env
OLLAMA_URL=http://localhost:11434
AI_MODEL=monotykamary/medichat-llama3
```

### Step 6: Start Your Application

```powershell
npm start
```

The AI service will automatically connect to Ollama.

## API Endpoints

Once Ollama is running, the following AI endpoints are available:

### Check AI Status
```
GET /api/ai/status
```

### Medical Triage
```
POST /api/ai/triage
Body: {
  "patientData": {
    "age": 45,
    "gender": "male",
    "complaint": "chest pain",
    "symptoms": ["chest pain", "shortness of breath"],
    "duration": "30 minutes",
    "painLevel": 8,
    "chronicConditions": ["hypertension"],
    "vitalSigns": {
      "bloodPressure": "160/95",
      "heartRate": 110,
      "temperature": "98.6"
    }
  }
}
```

### Symptom Analysis
```
POST /api/ai/symptoms
Body: {
  "symptoms": "fever, cough, body ache for 3 days",
  "patientHistory": {
    "age": 35,
    "gender": "female",
    "chronicConditions": [],
    "allergies": ["penicillin"]
  }
}
```

### Health Advice
```
POST /api/ai/advice
Body: {
  "query": "How to manage diabetes with diet?",
  "patientContext": {
    "age": 50,
    "gender": "male",
    "location": "Rural Punjab",
    "language": "Hindi"
  }
}
```

### Emergency Assessment
```
POST /api/ai/emergency
Body: {
  "description": "Patient collapsed, not responding",
  "vitalSigns": {
    "bloodPressure": "80/50",
    "heartRate": 140,
    "respiratoryRate": 25
  }
}
```

### Medication Information
```
POST /api/ai/medication
Body: {
  "medicationName": "Metformin",
  "patientAllergies": ["penicillin", "sulfa drugs"]
}
```

### Chat with AI
```
POST /api/ai/chat
Body: {
  "message": "What should I do for a headache?",
  "conversationHistory": [
    { "role": "user", "content": "I have a headache" },
    { "role": "assistant", "content": "How long have you had this headache?" }
  ]
}
```

## Troubleshooting

### Ollama Not Running
```powershell
# Check if Ollama service is running
Get-Service ollama

# Start Ollama manually
ollama serve
```

### Model Not Found
```powershell
# Pull the model again
ollama pull monotykamary/medichat-llama3

# List installed models
ollama list
```

### Connection Refused
- Make sure Ollama is running on port 11434
- Check firewall settings
- Verify `OLLAMA_URL` in your .env file

### Slow Responses
- First request may be slow (model loading)
- Consider using GPU if available
- Reduce `max_tokens` in AI service for faster responses

## Performance Tips

1. **Keep Ollama Running:** Don't stop the Ollama service between requests
2. **GPU Acceleration:** Ollama automatically uses GPU if available (NVIDIA/AMD)
3. **Memory:** Ensure at least 8GB RAM available for the model
4. **Concurrent Requests:** Ollama can handle multiple requests, but response time increases

## Model Information

**Model:** monotykamary/medichat-llama3
- **Size:** ~4.7GB
- **Base:** Llama 3 architecture
- **Specialization:** Medical conversations and diagnosis
- **Languages:** Primarily English (can be adapted for Hindi/Punjabi with prompts)
- **Context Window:** 8K tokens

## Security & Disclaimers

⚠️ **IMPORTANT:**
- AI responses are for informational purposes only
- NOT a substitute for professional medical advice
- Always include disclaimers in patient-facing interfaces
- Critical cases should immediately contact emergency services
- Verify all AI recommendations with qualified medical professionals

## Alternative Models (if needed)

If medichat-llama3 is unavailable, you can use:

```powershell
# General purpose medical model
ollama pull llama3:latest

# Smaller, faster model
ollama pull mistral:latest
```

Update `.env`:
```env
AI_MODEL=llama3:latest
```

## Resources

- Ollama Documentation: https://github.com/ollama/ollama
- Model Library: https://ollama.ai/library
- API Documentation: https://github.com/ollama/ollama/blob/main/docs/api.md
