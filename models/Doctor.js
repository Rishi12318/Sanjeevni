// models/Doctor.js - Comprehensive Doctor Model for SanjeevAnI AI
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = new mongoose.Schema({
  // Personal Details
  personalDetails: {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Please provide your date of birth']
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Please specify your gender']
    },
    profilePhoto: {
      type: String // URL or path to uploaded photo
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
    primaryPhone: {
      type: String,
      required: [true, 'Please provide your primary phone number'],
      unique: true,
      trim: true
    },
    whatsappNumber: {
      type: String,
      required: [true, 'Please provide your WhatsApp number'],
      trim: true
    },
    emergencyContacts: [{
      name: String,
      relationship: String,
      phone: String
    }]
  },

  // Address Details
  address: {
    street: String,
    city: { 
      type: String, 
      required: [true, 'Please provide your city'] 
    },
    state: { 
      type: String, 
      required: [true, 'Please provide your state'] 
    },
    pincode: { 
      type: String, 
      required: [true, 'Please provide your pincode'] 
    },
    country: { 
      type: String, 
      default: 'India' 
    },
    gpsCoordinates: {
      latitude: Number,
      longitude: Number
    }
  },

  // Language Proficiency (for rural communication)
  languages: {
    type: [String],
    enum: ['Hindi', 'Punjabi', 'English', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Urdu', 'Odia', 'Assamese', 'Other'],
    required: [true, 'Please specify languages you can communicate in']
  },

  // Professional Information
  professionalInfo: {
    medicalLicense: {
      licenseNumber: {
        type: String,
        required: [true, 'Please provide your medical license number'],
        unique: true,
        trim: true
      },
      issuingAuthority: {
        type: String,
        required: [true, 'Please provide the issuing authority']
      },
      issueDate: Date,
      expiryDate: {
        type: Date,
        required: [true, 'Please provide license expiry date']
      }
    },
    
    medicalDegree: {
      degree: {
        type: String,
        enum: ['MBBS', 'MD', 'MS', 'BDS', 'MDS', 'BAMS', 'BHMS', 'BPT', 'MPT', 'BUMS', 'DNB', 'DM', 'MCh', 'Other'],
        required: [true, 'Please provide your primary medical degree']
      },
      institution: {
        type: String,
        required: [true, 'Please provide your institution name']
      },
      yearOfCompletion: {
        type: Number,
        required: [true, 'Please provide year of completion']
      },
      additionalDegrees: [{
        degree: String,
        institution: String,
        year: Number
      }]
    },

    specializations: [{
      type: String,
      enum: [
        'General Medicine',
        'Pediatrics',
        'Gynecology & Obstetrics',
        'Cardiology',
        'Orthopedics',
        'Dermatology',
        'Ophthalmology',
        'ENT (Ear, Nose, Throat)',
        'Psychiatry',
        'Neurology',
        'Rural Healthcare',
        'Ayurveda',
        'Homeopathy',
        'Emergency Medicine',
        'Family Medicine',
        'Internal Medicine',
        'General Surgery',
        'Anesthesiology',
        'Radiology',
        'Pathology',
        'Pulmonology',
        'Nephrology',
        'Gastroenterology',
        'Endocrinology',
        'Oncology',
        'Urology',
        'Rheumatology',
        'Geriatrics',
        'Neonatology',
        'Critical Care',
        'Other'
      ]
    }],

    currentAffiliation: {
      hospitalName: String,
      clinicName: String,
      address: String,
      workingHours: String
    },

    experience: {
      totalYears: {
        type: Number,
        required: [true, 'Please provide your total years of experience'],
        min: 0
      },
      previousWorkHistory: [{
        organization: String,
        designation: String,
        from: Date,
        to: Date,
        location: String
      }]
    },

    governmentRegistrations: {
      medicalCouncilRegistration: {
        type: String,
        required: [true, 'Please provide your Medical Council registration number']
      },
      stateCouncilNumber: String,
      otherRegistrations: [String]
    },

    certifications: [{
      name: String,
      issuingBody: String,
      issueDate: Date,
      expiryDate: Date,
      certificateUrl: String
    }],

    areasOfExpertise: [String],
    specialInterests: [String],
    
    ruralHealthcareExperience: {
      hasExperience: {
        type: Boolean,
        default: false
      },
      yearsInRural: Number,
      locations: [String]
    },

    telemedicineExperience: {
      hasExperience: {
        type: Boolean,
        default: false
      },
      platforms: [String],
      yearsSinceStarted: Number
    }
  },

  // Consultation Details
  consultationDetails: {
    feeStructure: {
      onlineConsultation: {
        type: Number,
        required: [true, 'Please provide online consultation fee'],
        min: 0
      },
      offlineConsultation: {
        type: Number,
        required: [true, 'Please provide offline consultation fee'],
        min: 0
      },
      emergencyConsultation: {
        type: Number,
        min: 0
      },
      followUpFee: {
        type: Number,
        min: 0
      }
    },

    availability: {
      schedule: [{
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        slots: [{
          startTime: String, // Format: "HH:MM" (24-hour)
          endTime: String,
          type: {
            type: String,
            enum: ['Online', 'Offline', 'Both']
          }
        }]
      }],
      averageConsultationDuration: {
        type: Number,
        default: 15 // in minutes
      },
      isAvailableForEmergency: {
        type: Boolean,
        default: false
      }
    },

    consultationLanguages: {
      type: [String],
      required: [true, 'Please specify consultation languages']
    },
    
    preferredPatientAgeGroups: [{
      type: String,
      enum: ['Infants (0-1)', 'Children (1-12)', 'Teenagers (13-18)', 'Adults (19-60)', 'Seniors (60+)', 'All Ages']
    }]
  },

  // Service Preferences
  servicePreferences: {
    emergencyConsultations: {
      type: Boolean,
      default: false
    },
    healthCampParticipation: {
      type: Boolean,
      default: false
    },
    mentorshipProgram: {
      type: Boolean,
      default: false
    },
    criticalCareHandling: {
      type: Boolean,
      default: false
    },
    geographicalAreasServed: [{
      city: String,
      district: String,
      state: String,
      radiusKm: Number
    }],
    aiTriageSupport: {
      willingToUse: {
        type: Boolean,
        default: true
      },
      feedbackOnAI: String
    },
    homeVisits: {
      available: {
        type: Boolean,
        default: false
      },
      charges: Number,
      maxDistance: Number // in km
    }
  },

  // Verification Documents
  verificationDocuments: {
    medicalLicenseCopy: {
      type: String, // URL or file path
      required: [true, 'Please upload your medical license copy']
    },
    degreeCertificates: [{
      type: String
    }],
    identityProof: {
      type: String, // Aadhar/PAN/Passport
      required: [true, 'Please upload identity proof']
    },
    hospitalID: String,
    professionalPhotographs: [String]
  },

  // Authentication
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },

  // System Fields
  role: {
    type: String,
    default: 'doctor',
    enum: ['doctor']
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  verificationStatus: {
    type: String,
    enum: ['Pending', 'Under Review', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  
  verificationNotes: String,
  
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  
  verifiedAt: Date,

  // Statistics & Performance
  statistics: {
    totalConsultations: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    successfulTreatments: {
      type: Number,
      default: 0
    },
    patientsServed: {
      type: Number,
      default: 0
    }
  },

  // Account Status
  accountStatus: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended', 'Pending'],
    default: 'Pending'
  },
  
  isActive: {
    type: Boolean,
    default: true
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
}, {
  timestamps: true
});

// Indexes for better query performance
doctorSchema.index({ 'contactInfo.email': 1 });
doctorSchema.index({ 'contactInfo.primaryPhone': 1 });
doctorSchema.index({ 'professionalInfo.medicalLicense.licenseNumber': 1 });
doctorSchema.index({ 'professionalInfo.specializations': 1 });
doctorSchema.index({ 'address.city': 1, 'address.state': 1 });
doctorSchema.index({ verificationStatus: 1 });
doctorSchema.index({ accountStatus: 1 });

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update the updatedAt timestamp
doctorSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check password
doctorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
doctorSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.personalDetails.fullName,
    specializations: this.professionalInfo.specializations,
    experience: this.professionalInfo.experience.totalYears,
    languages: this.languages,
    consultationFee: this.consultationDetails.feeStructure,
    rating: this.statistics.rating,
    totalReviews: this.statistics.totalReviews,
    isVerified: this.isVerified,
    availability: this.consultationDetails.availability
  };
};

module.exports = mongoose.model('Doctor', doctorSchema);
