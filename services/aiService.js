// services/aiService.js - AI Medical Assistant using Google Gemini AI
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.isAvailable = false;
    this.genAI = null;
    this.model = null;
    this.checkAvailability();
  }

  // Check if Gemini API is configured
  async checkAvailability() {
    try {
      if (!this.apiKey) {
        console.log('⚠️  Gemini API key not configured. AI features will use fallback responses.');
        this.isAvailable = false;
        return;
      }

      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: this.modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_NONE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_NONE',
          },
        ],
      });
      
      // Test the API with a simple request
      const result = await this.model.generateContent('Hello');
      const response = await result.response;
      
      if (response) {
        this.isAvailable = true;
        console.log('✓ Google Gemini AI Service is available');
        console.log(`✓ Using model: ${this.modelName}`);
      }
    } catch (error) {
      this.isAvailable = false;
      console.log('⚠️  Gemini AI Service not available:', error.message);
      console.log('⚠️  AI features will use fallback responses. To enable AI, check your GEMINI_API_KEY in .env file');
      // Don't throw - just mark as unavailable and continue
    }
  }

  // Medical Triage - Assess patient urgency
  async performTriage(patientData) {
    if (!this.isAvailable) {
      return this.getFallbackTriage(patientData);
    }

    const prompt = this.buildTriagePrompt(patientData);
    
    try {
      const response = await this.generateResponse(prompt);
      return this.parseTriageResponse(response);
    } catch (error) {
      console.error('AI Triage Error:', error.message);
      return this.getFallbackTriage(patientData);
    }
  }

  // Symptom Analysis
  async analyzeSymptoms(symptoms, patientHistory = {}) {
    if (!this.isAvailable) {
      return this.getFallbackSymptomAnalysis(symptoms);
    }

    const prompt = `As a medical AI assistant, analyze the following symptoms and provide possible conditions, recommended actions, and urgency level.

Patient Symptoms: ${symptoms}

Patient History:
- Age: ${patientHistory.age || 'Not provided'}
- Gender: ${patientHistory.gender || 'Not provided'}
- Chronic Conditions: ${patientHistory.chronicConditions?.join(', ') || 'None'}
- Current Medications: ${patientHistory.currentMedications?.join(', ') || 'None'}
- Allergies: ${patientHistory.allergies?.join(', ') || 'None'}

Please provide:
1. Possible medical conditions (differential diagnosis)
2. Urgency level (low, moderate, high, critical)
3. Recommended immediate actions
4. When to seek medical attention
5. Red flag symptoms to watch for
6. Home care recommendations

Response format: JSON with keys: possibleConditions, urgencyLevel, immediateActions, whenToSeekCare, redFlags, homeCare`;

    try {
      const response = await this.generateResponse(prompt);
      return this.parseSymptomAnalysis(response);
    } catch (error) {
      console.error('Symptom Analysis Error:', error.message);
      return this.getFallbackSymptomAnalysis(symptoms);
    }
  }

  // Health Advice
  async getHealthAdvice(query, patientContext = {}) {
    if (!this.isAvailable) {
      return {
        advice: 'AI service is currently unavailable. Please consult with a healthcare professional.',
        disclaimer: 'This is not a substitute for professional medical advice.'
      };
    }

    const prompt = `As a medical AI assistant for rural healthcare in India, provide health advice for the following query.

Query: ${query}

Patient Context:
- Age: ${patientContext.age || 'Not provided'}
- Gender: ${patientContext.gender || 'Not provided'}
- Location: ${patientContext.location || 'Rural India'}
- Language Preference: ${patientContext.language || 'English'}

Provide culturally appropriate, easy-to-understand advice considering rural healthcare constraints. Include:
1. Direct answer to the query
2. Prevention tips
3. Home remedies (if applicable)
4. When to consult a doctor
5. Resources available in rural areas

Keep the language simple and culturally sensitive.`;

    try {
      const response = await this.generateResponse(prompt);
      return {
        advice: response,
        disclaimer: 'This advice is AI-generated and not a substitute for professional medical consultation.'
      };
    } catch (error) {
      console.error('Health Advice Error:', error.message);
      return {
        advice: 'Unable to generate advice at this time. Please consult a healthcare professional.',
        error: error.message
      };
    }
  }

  // Emergency Assessment
  async assessEmergency(description, vitalSigns = {}) {
    const prompt = `EMERGENCY ASSESSMENT - Respond immediately with urgency level and action required.

Description: ${description}

Vital Signs:
- Blood Pressure: ${vitalSigns.bloodPressure || 'Not provided'}
- Heart Rate: ${vitalSigns.heartRate || 'Not provided'}
- Temperature: ${vitalSigns.temperature || 'Not provided'}
- Respiratory Rate: ${vitalSigns.respiratoryRate || 'Not provided'}
- Oxygen Saturation: ${vitalSigns.oxygenSaturation || 'Not provided'}

Provide IMMEDIATE assessment:
1. Emergency Level: CRITICAL/HIGH/MODERATE/LOW
2. Immediate Actions Required
3. Call Ambulance: YES/NO
4. Time Sensitivity (minutes until care needed)
5. First Aid Steps
6. What NOT to do

Format: JSON`;

    try {
      const response = await this.generateResponse(prompt, { temperature: 0.3 });
      return this.parseEmergencyAssessment(response);
    } catch (error) {
      console.error('Emergency Assessment Error:', error.message);
      return {
        emergencyLevel: 'HIGH',
        immediateActions: ['Call emergency services immediately', 'Do not move the patient', 'Monitor vital signs'],
        callAmbulance: true,
        timeSensitivity: 'Immediate',
        note: 'AI assessment failed - err on the side of caution'
      };
    }
  }

  // Medication Information
  async getMedicationInfo(medicationName, patientAllergies = []) {
    const prompt = `Provide information about the medication: ${medicationName}

Patient has allergies to: ${patientAllergies.join(', ') || 'None reported'}

Include:
1. Common uses
2. Dosage guidelines (general - remind patient to follow doctor's prescription)
3. Side effects (common and serious)
4. Contraindications
5. Interactions with common medications
6. Food/alcohol interactions
7. Storage instructions
8. What to do if dose is missed
9. WARNING: Any allergy concerns based on patient's known allergies

Format for rural Indian context with simple language.`;

    try {
      const response = await this.generateResponse(prompt);
      return {
        medication: medicationName,
        information: response,
        allergyWarning: this.checkAllergyWarning(medicationName, patientAllergies),
        disclaimer: 'Always follow your doctor\'s prescription. This is general information only.'
      };
    } catch (error) {
      return {
        medication: medicationName,
        error: 'Information not available. Please consult a pharmacist or doctor.',
        allergyWarning: this.checkAllergyWarning(medicationName, patientAllergies)
      };
    }
  }

  // Chat with Medical AI
  async chat(message, conversationHistory = []) {
    if (!this.isAvailable) {
      return {
        response: 'AI service is currently unavailable. Please try again later or consult a healthcare professional.',
        available: false
      };
    }

    const context = conversationHistory.length > 0 
      ? `Previous conversation:\n${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\n`
      : '';

    const prompt = `${context}User: ${message}\n\nAssistant (Medical AI):`;

    try {
      const response = await this.generateResponse(prompt, { 
        temperature: 0.7,
        max_tokens: 500 
      });
      
      return {
        response: response,
        available: true,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        response: 'I apologize, but I\'m having trouble responding right now. Please consult a healthcare professional.',
        available: false,
        error: error.message
      };
    }
  }

  // Core function to generate AI response using Gemini
  async generateResponse(prompt, options = {}) {
    if (!this.isAvailable || !this.model) {
      throw new Error('Gemini AI service is not available');
    }

    try {
      const medicalContext = `You are a medical AI assistant for SanjeevAnI, a rural healthcare platform in India. 
Provide accurate, helpful, and culturally appropriate medical information. 
Always remind users that this is AI-generated advice and they should consult healthcare professionals for proper diagnosis and treatment.
Use simple language suitable for rural Indian patients.

`;

      const fullPrompt = medicalContext + prompt;
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  // Helper: Build triage prompt
  buildTriagePrompt(patientData) {
    return `MEDICAL TRIAGE ASSESSMENT

Patient Information:
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- Chief Complaint: ${patientData.complaint}
- Symptoms: ${patientData.symptoms?.join(', ') || 'Not specified'}
- Duration: ${patientData.duration || 'Not specified'}
- Pain Level (1-10): ${patientData.painLevel || 'Not specified'}
- Chronic Conditions: ${patientData.chronicConditions?.join(', ') || 'None'}
- Current Medications: ${patientData.currentMedications?.join(', ') || 'None'}

Vital Signs:
- Blood Pressure: ${patientData.vitalSigns?.bloodPressure || 'Not measured'}
- Temperature: ${patientData.vitalSigns?.temperature || 'Not measured'}
- Heart Rate: ${patientData.vitalSigns?.heartRate || 'Not measured'}

Provide triage assessment in JSON format:
{
  "urgencyLevel": "critical|high|moderate|low",
  "triageCategory": "red|orange|yellow|green",
  "estimatedWaitTime": "immediate|<30min|<2hours|<24hours",
  "recommendedCare": "emergency_room|urgent_care|primary_care|self_care",
  "reasoning": "brief explanation",
  "redFlags": ["list of concerning symptoms"],
  "immediateActions": ["recommended actions"]
}`;
  }

  // Helper: Parse triage response
  parseTriageResponse(response) {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // JSON parsing failed
    }

    // Fallback parsing
    return {
      urgencyLevel: this.extractUrgencyFromText(response),
      triageCategory: 'yellow',
      recommendedCare: 'primary_care',
      reasoning: response,
      note: 'Parsed from AI text response'
    };
  }

  // Helper: Parse symptom analysis
  parseSymptomAnalysis(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // JSON parsing failed
    }

    return {
      possibleConditions: ['Unable to parse - please consult a doctor'],
      urgencyLevel: 'moderate',
      immediateActions: ['Monitor symptoms', 'Consult healthcare provider'],
      rawResponse: response
    };
  }

  // Helper: Parse emergency assessment
  parseEmergencyAssessment(response) {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      // JSON parsing failed
    }

    return {
      emergencyLevel: 'HIGH',
      immediateActions: ['Seek immediate medical attention'],
      callAmbulance: true,
      rawResponse: response
    };
  }

  // Helper: Extract urgency from text
  extractUrgencyFromText(text) {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('critical') || lowerText.includes('emergency')) return 'critical';
    if (lowerText.includes('urgent') || lowerText.includes('high')) return 'high';
    if (lowerText.includes('moderate')) return 'moderate';
    return 'low';
  }

  // Helper: Check allergy warnings
  checkAllergyWarning(medication, allergies) {
    const medLower = medication.toLowerCase();
    const allergyWarnings = [];

    allergies.forEach(allergy => {
      const allergyLower = allergy.toLowerCase();
      if (medLower.includes(allergyLower) || allergyLower.includes(medLower)) {
        allergyWarnings.push(`WARNING: Patient is allergic to ${allergy}`);
      }
    });

    // Common drug class warnings
    if (medLower.includes('penicillin') && allergies.some(a => a.toLowerCase().includes('penicillin'))) {
      allergyWarnings.push('CRITICAL: Penicillin allergy detected!');
    }

    return allergyWarnings.length > 0 ? allergyWarnings : null;
  }

  // Fallback triage when AI is unavailable
  getFallbackTriage(patientData) {
    const symptoms = (patientData.symptoms || []).join(' ').toLowerCase();
    const painLevel = patientData.painLevel || 0;

    // Critical keywords
    const criticalKeywords = ['chest pain', 'difficulty breathing', 'unconscious', 'severe bleeding', 
                              'stroke', 'heart attack', 'seizure', 'severe head injury'];
    
    if (criticalKeywords.some(keyword => symptoms.includes(keyword)) || painLevel >= 9) {
      return {
        urgencyLevel: 'critical',
        triageCategory: 'red',
        estimatedWaitTime: 'immediate',
        recommendedCare: 'emergency_room',
        reasoning: 'Critical symptoms detected - immediate emergency care required',
        immediateActions: ['Call ambulance immediately', 'Do not move patient', 'Monitor vital signs'],
        fallback: true
      };
    }

    // High urgency keywords
    const highUrgencyKeywords = ['severe pain', 'high fever', 'vomiting blood', 'severe injury'];
    if (highUrgencyKeywords.some(keyword => symptoms.includes(keyword)) || painLevel >= 7) {
      return {
        urgencyLevel: 'high',
        triageCategory: 'orange',
        estimatedWaitTime: '<30min',
        recommendedCare: 'urgent_care',
        reasoning: 'Urgent medical attention recommended',
        immediateActions: ['Seek medical care within 30 minutes', 'Monitor symptoms closely'],
        fallback: true
      };
    }

    return {
      urgencyLevel: 'moderate',
      triageCategory: 'yellow',
      estimatedWaitTime: '<2hours',
      recommendedCare: 'primary_care',
      reasoning: 'Non-emergency condition - consult healthcare provider',
      immediateActions: ['Schedule appointment with doctor', 'Monitor symptoms'],
      fallback: true
    };
  }

  // Fallback symptom analysis
  getFallbackSymptomAnalysis(symptoms) {
    return {
      possibleConditions: ['Unable to analyze - AI service unavailable'],
      urgencyLevel: 'moderate',
      immediateActions: ['Consult a healthcare professional for proper diagnosis'],
      whenToSeekCare: 'Schedule appointment with doctor within 24-48 hours',
      note: 'AI analysis unavailable - please seek professional medical advice',
      fallback: true
    };
  }
}

// Singleton instance
const aiService = new AIService();

module.exports = aiService;
