// models/NGO.js - Comprehensive NGO model for SanjeevAnI AI
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ngoSchema = new mongoose.Schema({
  // Organization Details
  organizationDetails: {
    name: {
      type: String,
      required: [true, 'Please provide organization name'],
      trim: true,
      unique: true
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide NGO registration number'],
      unique: true,
      trim: true
    },
    registrationType: {
      type: String,
      required: [true, 'Please select registration type'],
      enum: ['society', 'trust', 'section_8_company', '12a_registered', 'fcra', 'ngo_darpan', 'other']
    },
    yearEstablished: {
      type: Number,
      required: [true, 'Please provide year of establishment'],
      min: 1900,
      max: new Date().getFullYear()
    },
    
    // Tax & Legal Numbers
    panNumber: {
      type: String,
      required: [true, 'Please provide PAN number'],
      trim: true,
      uppercase: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please provide a valid PAN number']
    },
    tanNumber: {
      type: String,
      trim: true,
      uppercase: true
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please provide a valid GST number']
    },
    
    // Mission & Vision
    missionStatement: {
      type: String,
      required: [true, 'Please provide your mission statement'],
      maxlength: 2000
    },
    vision: {
      type: String,
      maxlength: 1000
    },
    
    // Branding
    logoUrl: String,
    website: {
      type: String,
      trim: true,
      lowercase: true
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
      youtube: String
    },
    
    // Communication
    preferredLanguage: {
      type: [String],
      enum: ['hindi', 'punjabi', 'english', 'marathi', 'tamil', 'telugu', 'bengali', 'gujarati', 'kannada', 'malayalam', 'other'],
      default: ['hindi', 'english']
    }
  },

  // Founder/Representative Details
  representative: {
    name: {
      type: String,
      required: [true, 'Please provide representative name'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'Please provide designation'],
      enum: ['founder', 'president', 'secretary', 'director', 'trustee', 'ceo', 'managing_trustee', 'other']
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    phoneNumber: {
      primary: {
        type: String,
        required: [true, 'Please provide phone number'],
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
      },
      whatsapp: {
        type: String,
        trim: true,
        match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
      },
      landline: String
    },
    identityProof: {
      type: {
        type: String,
        enum: ['aadhaar', 'pan', 'voter_id', 'passport', 'driving_license']
      },
      documentUrl: String,
      verified: {
        type: Boolean,
        default: false
      }
    }
  },

  // Authentication
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false
  },

  // Registered Office Address
  registeredAddress: {
    buildingName: String,
    street: String,
    village: String,
    district: {
      type: String,
      required: [true, 'Please provide district']
    },
    state: {
      type: String,
      required: [true, 'Please provide state']
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
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

  // Professional/Operational Details
  operationalDetails: {
    // Focus Areas
    focusAreas: [{
      type: String,
      required: true,
      enum: [
        'healthcare',
        'rural_development',
        'women_empowerment',
        'child_welfare',
        'education',
        'emergency_response',
        'mental_health',
        'maternal_health',
        'community_health',
        'elderly_care',
        'disability_support',
        'nutrition',
        'sanitation',
        'disease_prevention',
        'health_awareness',
        'other'
      ]
    }],

    // Geographical Coverage
    serviceAreas: {
      states: [{
        type: String
      }],
      districts: [{
        type: String
      }],
      villages: [{
        type: String
      }],
      coverageType: {
        type: String,
        enum: ['local', 'district', 'state', 'multi_state', 'national', 'international']
      }
    },

    // Impact Metrics
    beneficiariesServed: {
      annually: {
        type: Number,
        min: 0
      },
      total: {
        type: Number,
        min: 0
      },
      lastUpdated: Date
    },

    // Team Composition
    teamComposition: {
      totalMembers: {
        type: Number,
        min: 0
      },
      volunteers: {
        type: Number,
        min: 0
      },
      medicalStaff: {
        doctors: { type: Number, default: 0 },
        nurses: { type: Number, default: 0 },
        paramedics: { type: Number, default: 0 }
      },
      communityHealthWorkers: {
        type: Number,
        default: 0
      },
      administrativeStaff: {
        type: Number,
        default: 0
      },
      otherStaff: {
        type: Number,
        default: 0
      }
    },

    // Resources & Infrastructure
    resources: {
      mobileHealthUnits: {
        count: { type: Number, default: 0 },
        operational: { type: Number, default: 0 }
      },
      ambulances: {
        count: { type: Number, default: 0 },
        type: [{
          type: String,
          enum: ['basic', 'advanced', 'patient_transport', 'neonatal', 'cardiac']
        }]
      },
      healthCenters: {
        count: { type: Number, default: 0 },
        locations: [String]
      },
      medicalEquipment: [{
        name: String,
        quantity: Number,
        condition: {
          type: String,
          enum: ['excellent', 'good', 'fair', 'needs_replacement']
        }
      }],
      medicineStock: {
        hasStock: {
          type: Boolean,
          default: false
        },
        categories: [{
          type: String,
          enum: ['essential_medicines', 'emergency_drugs', 'chronic_disease', 'first_aid', 'maternal_health', 'child_health']
        }]
      },
      teleconsultationFacility: {
        available: {
          type: Boolean,
          default: false
        },
        platform: String,
        capacity: Number
      }
    },

    // Partnerships
    partnerships: {
      hospitals: [{
        name: String,
        location: String,
        partnershipType: {
          type: String,
          enum: ['referral', 'collaboration', 'mou', 'service_provider']
        },
        activeFrom: Date
      }],
      governmentBodies: [{
        department: String,
        level: {
          type: String,
          enum: ['central', 'state', 'district', 'block', 'panchayat']
        },
        partnershipType: String
      }],
      otherNGOs: [{
        name: String,
        focusArea: String,
        collaborationType: String
      }],
      corporateSponsors: [{
        companyName: String,
        industry: String,
        supportType: {
          type: String,
          enum: ['csr', 'donation', 'in_kind', 'volunteer', 'technical']
        },
        activeFrom: Date
      }]
    },

    // Funding & Budget
    funding: {
      annualBudget: {
        amount: Number,
        year: Number
      },
      fundingSources: [{
        type: String,
        enum: ['government_grant', 'csr', 'international_funding', 'individual_donations', 'crowdfunding', 'self_funded', 'other']
      }],
      governmentGrants: [{
        scheme: String,
        amount: Number,
        year: Number,
        department: String
      }],
      csrPartnerships: [{
        companyName: String,
        amount: Number,
        duration: String,
        purpose: String
      }],
      internationalFunding: [{
        organization: String,
        country: String,
        amount: Number,
        purpose: String,
        fcraApproved: Boolean
      }]
    },

    // Programs & Initiatives
    healthPrograms: {
      healthCamps: [{
        type: {
          type: String,
          enum: ['general', 'eye', 'dental', 'gynecology', 'pediatric', 'diabetes', 'hypertension', 'multi_specialty']
        },
        location: String,
        date: Date,
        beneficiaries: Number,
        services: [String]
      }],
      vaccinationDrives: [{
        vaccinationType: String,
        location: String,
        date: Date,
        peopleVaccinated: Number
      }],
      maternalCareInitiatives: [{
        programName: String,
        description: String,
        beneficiaries: Number,
        startDate: Date,
        ongoing: Boolean
      }],
      healthEducationPrograms: [{
        topic: String,
        targetAudience: String,
        sessionsHeld: Number,
        participantsReached: Number
      }]
    },

    // Emergency Response
    emergencyCapabilities: {
      available24x7: {
        type: Boolean,
        default: false
      },
      emergencyResponseTeam: {
        type: Boolean,
        default: false
      },
      disasterResponse: {
        type: Boolean,
        default: false
      },
      ambulanceService: {
        type: Boolean,
        default: false
      },
      emergencyMedicines: {
        type: Boolean,
        default: false
      },
      responseTimeMinutes: Number,
      emergencyHotline: String
    },

    // Success Stories
    impactMetrics: {
      successStories: [{
        title: String,
        description: String,
        date: Date,
        impactArea: String,
        beneficiariesImpacted: Number,
        mediaUrl: String
      }],
      awards: [{
        title: String,
        awardedBy: String,
        year: Number,
        category: String
      }],
      testimonials: [{
        name: String,
        designation: String,
        feedback: String,
        date: Date
      }]
    }
  },

  // Legal Verification Documents
  documents: {
    registrationCertificate: {
      documentUrl: String,
      issueDate: Date,
      expiryDate: Date,
      issuingAuthority: String,
      verified: {
        type: Boolean,
        default: false
      },
      verifiedBy: String,
      verifiedDate: Date
    },
    certificate12A: {
      documentUrl: String,
      certificateNumber: String,
      issueDate: Date,
      expiryDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    certificate80G: {
      documentUrl: String,
      certificateNumber: String,
      issueDate: Date,
      expiryDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    fcraRegistration: {
      documentUrl: String,
      registrationNumber: String,
      issueDate: Date,
      expiryDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    auditedFinancialStatements: [{
      year: Number,
      documentUrl: String,
      auditorName: String,
      verified: {
        type: Boolean,
        default: false
      }
    }],
    trustDeed: {
      documentUrl: String,
      registrationDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    memorandumOfAssociation: {
      documentUrl: String,
      verified: {
        type: Boolean,
        default: false
      }
    },
    panCard: {
      documentUrl: String,
      verified: {
        type: Boolean,
        default: false
      }
    },
    otherDocuments: [{
      name: String,
      documentUrl: String,
      uploadDate: Date
    }]
  },

  // Verification Status
  verificationStatus: {
    documentsVerified: {
      type: Boolean,
      default: false
    },
    fieldVerificationDone: {
      type: Boolean,
      default: false
    },
    fieldVerificationDate: Date,
    fieldVerificationBy: String,
    fieldVerificationReport: String,
    backgroundCheckDone: {
      type: Boolean,
      default: false
    },
    backgroundCheckDate: Date,
    backgroundCheckReport: String,
    approvalStatus: {
      type: String,
      enum: ['pending', 'under_review', 'approved', 'rejected', 'suspended'],
      default: 'pending'
    },
    approvedBy: String,
    approvedDate: Date,
    rejectionReason: String,
    platformAccessGranted: {
      type: Boolean,
      default: false
    },
    accessLevel: {
      type: String,
      enum: ['basic', 'standard', 'premium', 'restricted'],
      default: 'basic'
    }
  },

  // System Fields
  role: {
    type: String,
    default: 'ngo',
    enum: ['ngo']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  rating: {
    overall: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    reviews: [{
      reviewedBy: String,
      rating: Number,
      comment: String,
      date: Date
    }]
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

// Virtual for display name
ngoSchema.virtual('displayName').get(function() {
  return this.organizationDetails.name;
});

// Update timestamp
ngoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
ngoSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
ngoSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if NGO is fully verified
ngoSchema.methods.isFullyVerified = function() {
  return this.verificationStatus.documentsVerified &&
         this.verificationStatus.fieldVerificationDone &&
         this.verificationStatus.backgroundCheckDone &&
         this.verificationStatus.approvalStatus === 'approved';
};

// Method to get verification completion percentage
ngoSchema.methods.getVerificationProgress = function() {
  let progress = 0;
  const steps = 5;
  
  if (this.verificationStatus.documentsVerified) progress += 20;
  if (this.verificationStatus.fieldVerificationDone) progress += 20;
  if (this.verificationStatus.backgroundCheckDone) progress += 20;
  if (this.verificationStatus.approvalStatus === 'approved') progress += 30;
  if (this.verificationStatus.platformAccessGranted) progress += 10;
  
  return progress;
};

// Method to check if NGO can respond to emergencies
ngoSchema.methods.canHandleEmergencies = function() {
  return this.operationalDetails.emergencyCapabilities.available24x7 &&
         this.operationalDetails.emergencyCapabilities.emergencyResponseTeam &&
         this.isFullyVerified();
};

// Method to get total team size
ngoSchema.methods.getTotalTeamSize = function() {
  const team = this.operationalDetails.teamComposition;
  return (team.totalMembers || 0) +
         (team.volunteers || 0) +
         (team.medicalStaff?.doctors || 0) +
         (team.medicalStaff?.nurses || 0) +
         (team.medicalStaff?.paramedics || 0) +
         (team.communityHealthWorkers || 0) +
         (team.administrativeStaff || 0);
};

// Method to check if NGO has medical capability
ngoSchema.methods.hasMedicalCapability = function() {
  const medical = this.operationalDetails.teamComposition.medicalStaff;
  return (medical?.doctors > 0 || medical?.nurses > 0 || medical?.paramedics > 0);
};

// Method to get service readiness score
ngoSchema.methods.getServiceReadinessScore = function() {
  let score = 0;
  
  // Verification (40 points)
  if (this.isFullyVerified()) score += 40;
  else score += (this.getVerificationProgress() * 0.4);
  
  // Medical capability (20 points)
  if (this.hasMedicalCapability()) score += 20;
  
  // Resources (20 points)
  const resources = this.operationalDetails.resources;
  if (resources.ambulances?.count > 0) score += 5;
  if (resources.mobileHealthUnits?.count > 0) score += 5;
  if (resources.medicineStock?.hasStock) score += 5;
  if (resources.teleconsultationFacility?.available) score += 5;
  
  // Emergency capability (10 points)
  if (this.canHandleEmergencies()) score += 10;
  
  // Coverage (10 points)
  const coverage = this.operationalDetails.serviceAreas;
  if (coverage.villages?.length > 0 || coverage.districts?.length > 0) score += 10;
  
  return Math.min(score, 100);
};

// Method to check if documents are expiring soon (within 60 days)
ngoSchema.methods.getExpiringDocuments = function() {
  const expiring = [];
  const sixtyDaysFromNow = new Date();
  sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
  
  const docs = this.documents;
  
  if (docs.registrationCertificate?.expiryDate && 
      new Date(docs.registrationCertificate.expiryDate) < sixtyDaysFromNow) {
    expiring.push('Registration Certificate');
  }
  
  if (docs.certificate12A?.expiryDate && 
      new Date(docs.certificate12A.expiryDate) < sixtyDaysFromNow) {
    expiring.push('12A Certificate');
  }
  
  if (docs.certificate80G?.expiryDate && 
      new Date(docs.certificate80G.expiryDate) < sixtyDaysFromNow) {
    expiring.push('80G Certificate');
  }
  
  if (docs.fcraRegistration?.expiryDate && 
      new Date(docs.fcraRegistration.expiryDate) < sixtyDaysFromNow) {
    expiring.push('FCRA Registration');
  }
  
  return expiring;
};

// Indexes for faster queries
ngoSchema.index({ 'organizationDetails.name': 1 });
ngoSchema.index({ 'organizationDetails.registrationNumber': 1 });
ngoSchema.index({ 'representative.email': 1 });
ngoSchema.index({ 'registeredAddress.district': 1, 'registeredAddress.state': 1 });
ngoSchema.index({ 'operationalDetails.focusAreas': 1 });
ngoSchema.index({ 'operationalDetails.serviceAreas.districts': 1 });
ngoSchema.index({ 'verificationStatus.approvalStatus': 1 });
ngoSchema.index({ 'verificationStatus.platformAccessGranted': 1 });
ngoSchema.index({ isActive: 1, isFeatured: 1 });
ngoSchema.index({ 'registeredAddress.gpsCoordinates.latitude': 1, 'registeredAddress.gpsCoordinates.longitude': 1 });

module.exports = mongoose.model('NGO', ngoSchema);
