// routes/ai.js - AI Medical Assistant Routes
const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Middleware to check if user is authenticated (you can add JWT verification here)
const authenticate = (req, res, next) => {
  // TODO: Add JWT authentication
  // For now, just pass through
  next();
};

// @route   POST /api/ai/triage
// @desc    Perform medical triage assessment
// @access  Private
router.post('/triage', authenticate, async (req, res) => {
  try {
    const { patientData } = req.body;
    
    if (!patientData || !patientData.complaint) {
      return res.status(400).json({
        success: false,
        message: 'Patient complaint is required'
      });
    }

    const triageResult = await aiService.performTriage(patientData);
    
    res.json({
      success: true,
      data: triageResult,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Triage error:', error);
    res.status(500).json({
      success: false,
      message: 'Triage assessment failed',
      error: error.message
    });
  }
});

// @route   POST /api/ai/symptoms
// @desc    Analyze symptoms
// @access  Private
router.post('/symptoms', authenticate, async (req, res) => {
  try {
    const { symptoms, patientHistory } = req.body;
    
    if (!symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms are required'
      });
    }

    const analysis = await aiService.analyzeSymptoms(symptoms, patientHistory);
    
    res.json({
      success: true,
      data: analysis,
      disclaimer: 'This is an AI-generated analysis and not a substitute for professional medical diagnosis',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Symptom analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Symptom analysis failed',
      error: error.message
    });
  }
});

// @route   POST /api/ai/advice
// @desc    Get health advice
// @access  Private
router.post('/advice', authenticate, async (req, res) => {
  try {
    const { query, patientContext } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const advice = await aiService.getHealthAdvice(query, patientContext);
    
    res.json({
      success: true,
      data: advice,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Health advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate health advice',
      error: error.message
    });
  }
});

// @route   POST /api/ai/emergency
// @desc    Assess emergency situation
// @access  Private
router.post('/emergency', authenticate, async (req, res) => {
  try {
    const { description, vitalSigns } = req.body;
    
    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Emergency description is required'
      });
    }

    const assessment = await aiService.assessEmergency(description, vitalSigns);
    
    res.json({
      success: true,
      data: assessment,
      warning: 'In case of emergency, always call emergency services first',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Emergency assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Emergency assessment failed',
      error: error.message
    });
  }
});

// @route   POST /api/ai/medication
// @desc    Get medication information
// @access  Private
router.post('/medication', authenticate, async (req, res) => {
  try {
    const { medicationName, patientAllergies } = req.body;
    
    if (!medicationName) {
      return res.status(400).json({
        success: false,
        message: 'Medication name is required'
      });
    }

    const info = await aiService.getMedicationInfo(medicationName, patientAllergies || []);
    
    res.json({
      success: true,
      data: info,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Medication info error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve medication information',
      error: error.message
    });
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with medical AI
// @access  Private
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const response = await aiService.chat(message, conversationHistory || []);
    
    res.json({
      success: true,
      data: response,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Chat failed',
      error: error.message
    });
  }
});

// @route   GET /api/ai/status
// @desc    Check AI service status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    await aiService.checkAvailability();
    
    res.json({
      success: true,
      data: {
        available: aiService.isAvailable,
        model: aiService.modelName,
        ollamaUrl: aiService.ollamaUrl
      }
    });
  } catch (error) {
    res.json({
      success: false,
      data: {
        available: false,
        error: error.message
      }
    });
  }
});

module.exports = router;
