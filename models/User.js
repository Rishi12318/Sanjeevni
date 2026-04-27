// models/User.js - Comprehensive user model for SanjeevAnI AI
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Personal Details
  personalDetails: {
    firstName: {
      type: String,
      required: [true, 'Please provide your first name'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Please provide your last name'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide your date of birth']
    },
    age: {
      type: Number,
      // Auto-calculated from DOB
    },
    gender: {
      type: String,
      required: [true, 'Please specify your gender'],
      enum: ['male', 'female', 'transgender', 'other']
    },
    maritalStatus: {
      type: String,
      enum: ['single', 'married', 'divorced', 'widowed', 'other']
    },
    profession: {
      type: String,
      enum: ['farmer', 'student', 'teacher', 'daily_wage_worker', 'homemaker', 'unemployed', 'business', 'government_employee', 'private_employee', 'other']
    },
    educationLevel: {
      type: String,
      enum: ['no_formal_education', 'primary', 'secondary', 'higher_secondary', 'graduate', 'postgraduate', 'other']
    },
    monthlyIncomeRange: {
      type: String,
      enum: ['below_5000', '5000_10000', '10000_20000', '20000_50000', 'above_50000', 'prefer_not_to_say']
    }
  },

  // Contact Information
  contactInfo: {
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phoneNumber: {
      primary: {
        type: String,
        required: [true, 'Please provide your phone number'],
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
      },
      whatsapp: {
        type: String,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
      }
    },
    preferredLanguage: {
      type: [String],
      enum: ['hindi', 'punjabi', 'english', 'marathi', 'tamil', 'telugu', 'bengali', 'gujarati', 'kannada', 'malayalam', 'other'],
      default: ['hindi']
    }
  },

  // Address Information
  address: {
    houseNumber: String,
    street: String,
    village: {
      type: String,
      required: [true, 'Please provide your village/city']
    },
    tehsil: String,
    district: {
      type: String,
      required: [true, 'Please provide your district']
    },
    state: {
      type: String,
      required: [true, 'Please provide your state']
    },
    pincode: {
      type: String,
      required: [true, 'Please provide your pincode'],
      match: [/^\d{6}$/, 'Please provide a valid 6-digit pincode']
    },
    gpsCoordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    landmark: String
  },

  // Emergency Contacts
  emergencyContacts: [{
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true,
      enum: ['spouse', 'parent', 'child', 'sibling', 'friend', 'neighbor', 'relative', 'other']
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
    },
    decisionMakingAuthority: {
      type: Boolean,
      default: false
    },
    priority: {
      type: Number,
      min: 1,
      max: 5,
      default: 1
    }
  }],

  // Authentication
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },

  // Medical Details
  medicalDetails: {
    // Basic Health Metrics
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']
    },
    height: {
      value: {
        type: Number, // in centimeters
        min: 50,
        max: 250
      },
      unit: {
        type: String,
        default: 'cm'
      }
    },
    weight: {
      value: {
        type: Number, // in kilograms
        min: 2,
        max: 300
      },
      unit: {
        type: String,
        default: 'kg'
      }
    },
    bmi: {
      type: Number,
      // Auto-calculated from height and weight
    },

    // Chronic Conditions
    chronicConditions: [{
      condition: {
        type: String,
        enum: ['diabetes', 'hypertension', 'asthma', 'heart_disease', 'thyroid', 'arthritis', 'kidney_disease', 'liver_disease', 'cancer', 'copd', 'tuberculosis', 'epilepsy', 'mental_health', 'other']
      },
      diagnosisYear: Number,
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe', 'critical']
      },
      notes: String
    }],

    // Allergies
    allergies: {
      medications: [{
        name: String,
        reactionType: {
          type: String,
          enum: ['rash', 'anaphylaxis', 'nausea', 'breathing_difficulty', 'swelling', 'other']
        },
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe', 'life_threatening']
        }
      }],
      foods: [{
        name: String,
        reactionType: String,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe', 'life_threatening']
        }
      }]
    },

    // Current Medications
    currentMedications: [{
      medicationName: String,
      dosage: String,
      frequency: {
        type: String,
        enum: ['once_daily', 'twice_daily', 'thrice_daily', 'as_needed', 'weekly', 'monthly', 'other']
      },
      startDate: Date,
      purpose: String,
      prescribedBy: String
    }],

    // Surgical History
    surgicalHistory: [{
      procedureName: String,
      datePerformed: Date,
      hospital: String,
      surgeon: String,
      complications: String,
      notes: String
    }],

    // Family Medical History
    familyMedicalHistory: [{
      condition: {
        type: String,
        enum: ['diabetes', 'hypertension', 'heart_disease', 'cancer', 'asthma', 'mental_illness', 'stroke', 'kidney_disease', 'thyroid', 'other']
      },
      relation: {
        type: String,
        enum: ['mother', 'father', 'sibling', 'grandparent', 'child', 'other']
      },
      ageOfOnset: Number,
      notes: String
    }],

    // Lifestyle Factors
    lifestyle: {
      smokingStatus: {
        type: String,
        enum: ['never', 'former', 'current_light', 'current_moderate', 'current_heavy']
      },
      alcoholConsumption: {
        type: String,
        enum: ['never', 'occasional', 'moderate', 'heavy', 'former']
      },
      exerciseFrequency: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very_active']
      },
      dietType: {
        type: String,
        enum: ['vegetarian', 'non_vegetarian', 'vegan', 'eggetarian']
      },
      sleepHours: {
        type: Number,
        min: 0,
        max: 24
      },
      stressLevel: {
        type: String,
        enum: ['low', 'moderate', 'high', 'very_high']
      }
    }
  },

  // Insurance & Healthcare Access
  healthcareAccess: {
    insuranceDetails: {
      hasInsurance: {
        type: Boolean,
        default: false
      },
      insuranceType: {
        type: String,
        enum: ['ayushman_bharat', 'private', 'government_scheme', 'employer_provided', 'none', 'other']
      },
      policyNumber: String,
      expiryDate: Date,
      coverageAmount: Number
    },
    nearestHealthcareFacility: {
      name: String,
      type: {
        type: String,
        enum: ['primary_health_center', 'community_health_center', 'district_hospital', 'private_clinic', 'private_hospital', 'ayush_center']
      },
      distance: Number, // in kilometers
      address: String,
      phoneNumber: String
    },
    accessToTransport: {
      type: String,
      enum: ['own_vehicle', 'public_transport', 'ambulance_service', 'community_transport', 'no_transport']
    }
  },

  // Consent & Privacy
  consent: {
    dataProcessing: {
      type: Boolean,
      required: true,
      default: false
    },
    aiAssistance: {
      type: Boolean,
      required: true,
      default: false
    },
    dataSharing: {
      type: Boolean,
      default: false
    },
    emergencyContactPermission: {
      type: Boolean,
      default: true
    },
    consentDate: {
      type: Date,
      default: Date.now
    }
  },

  // System Fields
  role: {
    type: String,
    default: 'user',
    enum: ['user']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationMethod: {
    type: String,
    enum: ['phone_otp', 'email', 'aadhaar', 'manual', 'none']
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.personalDetails.firstName} ${this.personalDetails.lastName}`;
});

// Auto-calculate age from DOB
userSchema.pre('save', function(next) {
  if (this.personalDetails.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.personalDetails.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    this.personalDetails.age = age;
  }
  next();
});

// Auto-calculate BMI
userSchema.pre('save', function(next) {
  if (this.medicalDetails.height?.value && this.medicalDetails.weight?.value) {
    const heightInMeters = this.medicalDetails.height.value / 100;
    const bmi = this.medicalDetails.weight.value / (heightInMeters * heightInMeters);
    this.medicalDetails.bmi = Math.round(bmi * 10) / 10;
  }
  next();
});

// Update timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get BMI category
userSchema.methods.getBMICategory = function() {
  const bmi = this.medicalDetails.bmi;
  if (!bmi) return 'unknown';
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};

// Method to check if user has chronic conditions
userSchema.methods.hasChronicConditions = function() {
  return this.medicalDetails.chronicConditions && this.medicalDetails.chronicConditions.length > 0;
};

// Method to get risk level based on medical history
userSchema.methods.getRiskLevel = function() {
  let riskScore = 0;
  
  // Age factor
  if (this.personalDetails.age > 60) riskScore += 2;
  else if (this.personalDetails.age > 45) riskScore += 1;
  
  // Chronic conditions
  const severeConditions = this.medicalDetails.chronicConditions?.filter(c => c.severity === 'severe' || c.severity === 'critical').length || 0;
  riskScore += severeConditions * 2;
  
  // Lifestyle factors
  if (this.medicalDetails.lifestyle?.smokingStatus?.includes('current')) riskScore += 1;
  if (this.medicalDetails.lifestyle?.alcoholConsumption === 'heavy') riskScore += 1;
  
  // BMI
  const bmiCategory = this.getBMICategory();
  if (bmiCategory === 'obese') riskScore += 1;
  
  if (riskScore >= 5) return 'high';
  if (riskScore >= 3) return 'moderate';
  return 'low';
};

// Index for faster queries
userSchema.index({ 'contactInfo.email': 1 });
userSchema.index({ 'contactInfo.phoneNumber.primary': 1 });
userSchema.index({ 'address.district': 1, 'address.state': 1 });
userSchema.index({ 'address.gpsCoordinates.latitude': 1, 'address.gpsCoordinates.longitude': 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
