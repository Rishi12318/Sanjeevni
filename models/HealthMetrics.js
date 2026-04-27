// models/HealthMetrics.js - Physical and Mental Health Tracking
const mongoose = require('mongoose');

const healthMetricsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Date of measurement
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Physical Health Metrics
  physical: {
    // Vital Signs
    vitalSigns: {
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
        unit: { type: String, default: 'mmHg' }
      },
      heartRate: {
        value: Number,
        unit: { type: String, default: 'bpm' }
      },
      temperature: {
        value: Number,
        unit: { type: String, default: 'F' }
      },
      respiratoryRate: {
        value: Number,
        unit: { type: String, default: 'breaths/min' }
      },
      oxygenSaturation: {
        value: Number,
        unit: { type: String, default: '%' }
      }
    },
    
    // Body Measurements
    bodyMetrics: {
      weight: Number,
      height: Number,
      bmi: Number,
      waistCircumference: Number,
      bodyFatPercentage: Number
    },
    
    // Blood Glucose
    bloodGlucose: {
      value: Number,
      testType: {
        type: String,
        enum: ['fasting', 'random', 'postprandial', 'hba1c']
      },
      unit: { type: String, default: 'mg/dL' }
    },
    
    // Activity
    activity: {
      steps: Number,
      activeMinutes: Number,
      caloriesBurned: Number,
      distance: Number,
      exerciseType: String,
      exerciseDuration: Number
    },
    
    // Sleep
    sleep: {
      hoursSlept: Number,
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent']
      },
      bedTime: Date,
      wakeTime: Date,
      interruptions: Number
    },
    
    // Pain Assessment
    pain: {
      level: {
        type: Number,
        min: 0,
        max: 10
      },
      location: String,
      type: {
        type: String,
        enum: ['sharp', 'dull', 'throbbing', 'burning', 'aching', 'cramping']
      },
      duration: String
    },
    
    // Overall Physical Health Score (0-100)
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Mental Health Metrics
  mental: {
    // Mood Assessment
    mood: {
      primary: {
        type: String,
        enum: ['very_happy', 'happy', 'neutral', 'sad', 'very_sad', 'anxious', 'stressed', 'calm', 'energetic', 'tired']
      },
      intensity: {
        type: Number,
        min: 1,
        max: 10
      },
      notes: String
    },
    
    // Stress Level
    stressLevel: {
      type: Number,
      min: 0,
      max: 10
    },
    
    // Anxiety Level
    anxietyLevel: {
      type: Number,
      min: 0,
      max: 10
    },
    
    // Depression Screening (PHQ-9 style)
    depression: {
      score: {
        type: Number,
        min: 0,
        max: 27
      },
      severity: {
        type: String,
        enum: ['none', 'minimal', 'mild', 'moderate', 'moderately_severe', 'severe']
      }
    },
    
    // Energy Level
    energyLevel: {
      type: Number,
      min: 0,
      max: 10
    },
    
    // Meditation/Mindfulness
    meditation: {
      practiced: Boolean,
      duration: Number, // minutes
      type: String
    },
    
    // Social Interaction
    socialInteraction: {
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent']
      },
      duration: Number, // minutes
      type: String
    },
    
    // Cognitive Function
    cognitive: {
      concentration: {
        type: Number,
        min: 0,
        max: 10
      },
      memory: {
        type: Number,
        min: 0,
        max: 10
      },
      clarity: {
        type: Number,
        min: 0,
        max: 10
      }
    },
    
    // Coping Mechanisms Used
    copingMechanisms: [{
      type: String,
      enum: ['exercise', 'meditation', 'talking_to_friend', 'professional_help', 'music', 'art', 'writing', 'breathing_exercises', 'other']
    }],
    
    // Overall Mental Health Score (0-100)
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  
  // Lifestyle Factors
  lifestyle: {
    diet: {
      quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent']
      },
      meals: Number,
      waterIntake: Number, // liters
      junkFood: Boolean
    },
    
    substanceUse: {
      alcohol: Boolean,
      smoking: Boolean,
      drugs: Boolean
    },
    
    screenTime: {
      hours: Number
    }
  },
  
  // Symptoms Reported
  symptoms: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    duration: String
  }],
  
  // Medications Taken Today
  medicationsTaken: [{
    name: String,
    dosage: String,
    time: Date,
    skipped: Boolean
  }],
  
  // Notes
  notes: String,
  
  // Data Source
  dataSource: {
    type: String,
    enum: ['manual', 'wearable', 'app', 'doctor', 'ai_assessment'],
    default: 'manual'
  },
  
  // AI Assessment
  aiAssessment: {
    performedAt: Date,
    recommendations: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical']
    },
    alertsTriggered: [{
      type: String,
      message: String,
      timestamp: Date
    }]
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp
healthMetricsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Auto-calculate BMI if height and weight are provided
  if (this.physical?.bodyMetrics?.weight && this.physical?.bodyMetrics?.height) {
    const heightInMeters = this.physical.bodyMetrics.height / 100;
    this.physical.bodyMetrics.bmi = Math.round(
      (this.physical.bodyMetrics.weight / (heightInMeters * heightInMeters)) * 10
    ) / 10;
  }
  
  next();
});

// Method to calculate overall physical health score
healthMetricsSchema.methods.calculatePhysicalScore = function() {
  let score = 50; // baseline
  
  // Vital signs (30 points)
  if (this.physical?.vitalSigns?.bloodPressure) {
    const bp = this.physical.vitalSigns.bloodPressure;
    if (bp.systolic >= 90 && bp.systolic <= 120 && bp.diastolic >= 60 && bp.diastolic <= 80) {
      score += 10;
    }
  }
  
  if (this.physical?.vitalSigns?.heartRate?.value) {
    const hr = this.physical.vitalSigns.heartRate.value;
    if (hr >= 60 && hr <= 100) score += 10;
  }
  
  if (this.physical?.vitalSigns?.oxygenSaturation?.value >= 95) {
    score += 10;
  }
  
  // BMI (20 points)
  if (this.physical?.bodyMetrics?.bmi) {
    const bmi = this.physical.bodyMetrics.bmi;
    if (bmi >= 18.5 && bmi <= 24.9) score += 20;
    else if (bmi >= 25 && bmi <= 29.9) score += 10;
  }
  
  // Activity (20 points)
  if (this.physical?.activity?.steps >= 10000) score += 10;
  if (this.physical?.activity?.activeMinutes >= 30) score += 10;
  
  // Sleep (15 points)
  if (this.physical?.sleep?.hoursSlept >= 7 && this.physical?.sleep?.hoursSlept <= 9) {
    score += 15;
  }
  
  // Pain (15 points) - less pain = higher score
  if (!this.physical?.pain?.level || this.physical.pain.level <= 2) {
    score += 15;
  } else if (this.physical.pain.level <= 5) {
    score += 7;
  }
  
  this.physical.overallScore = Math.min(Math.max(score, 0), 100);
  return this.physical.overallScore;
};

// Method to calculate overall mental health score
healthMetricsSchema.methods.calculateMentalScore = function() {
  let score = 50; // baseline
  
  // Mood (20 points)
  if (this.mental?.mood?.primary) {
    const goodMoods = ['very_happy', 'happy', 'calm', 'energetic'];
    if (goodMoods.includes(this.mental.mood.primary)) {
      score += 20;
    } else if (this.mental.mood.primary === 'neutral') {
      score += 10;
    }
  }
  
  // Stress (15 points)
  if (this.mental?.stressLevel !== undefined) {
    score += (10 - this.mental.stressLevel) * 1.5;
  }
  
  // Anxiety (15 points)
  if (this.mental?.anxietyLevel !== undefined) {
    score += (10 - this.mental.anxietyLevel) * 1.5;
  }
  
  // Energy (15 points)
  if (this.mental?.energyLevel >= 7) score += 15;
  else if (this.mental?.energyLevel >= 5) score += 10;
  
  // Cognitive function (20 points)
  if (this.mental?.cognitive) {
    const avgCognitive = (
      (this.mental.cognitive.concentration || 0) +
      (this.mental.cognitive.memory || 0) +
      (this.mental.cognitive.clarity || 0)
    ) / 3;
    score += avgCognitive * 2;
  }
  
  // Meditation/mindfulness (10 points)
  if (this.mental?.meditation?.practiced) score += 10;
  
  // Coping mechanisms (5 points)
  if (this.mental?.copingMechanisms?.length > 0) score += 5;
  
  this.mental.overallScore = Math.min(Math.max(score, 0), 100);
  return this.mental.overallScore;
};

// Method to get health status summary
healthMetricsSchema.methods.getHealthSummary = function() {
  return {
    date: this.date,
    physical: {
      score: this.physical?.overallScore || this.calculatePhysicalScore(),
      status: this.getStatusFromScore(this.physical?.overallScore || 50)
    },
    mental: {
      score: this.mental?.overallScore || this.calculateMentalScore(),
      status: this.getStatusFromScore(this.mental?.overallScore || 50)
    },
    overall: {
      score: Math.round(
        ((this.physical?.overallScore || 50) + (this.mental?.overallScore || 50)) / 2
      )
    }
  };
};

// Helper method to get status from score
healthMetricsSchema.methods.getStatusFromScore = function(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
};

// Indexes for faster queries
healthMetricsSchema.index({ userId: 1, date: -1 });
healthMetricsSchema.index({ userId: 1, 'aiAssessment.riskLevel': 1 });
healthMetricsSchema.index({ date: 1 });

module.exports = mongoose.model('HealthMetrics', healthMetricsSchema);
