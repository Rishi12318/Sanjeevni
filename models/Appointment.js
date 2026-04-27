// models/Appointment.js - Doctor appointments
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  // Patient Details
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  patientName: {
    type: String,
    required: true
  },
  
  // Doctor Details
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true
  },
  doctorName: {
    type: String,
    required: true
  },
  
  // Appointment Details
  appointmentDate: {
    type: Date,
    required: true,
    index: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  
  appointmentType: {
    type: String,
    enum: ['online', 'in_person', 'home_visit', 'emergency'],
    required: true
  },
  
  consultationType: {
    type: String,
    enum: ['general', 'followup', 'specialist', 'emergency', 'second_opinion'],
    default: 'general'
  },
  
  // Chief Complaint
  chiefComplaint: {
    type: String,
    required: true
  },
  symptoms: [{
    type: String
  }],
  
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show', 'rescheduled'],
    default: 'scheduled',
    index: true
  },
  
  // Consultation Details
  consultation: {
    startTime: Date,
    endTime: Date,
    diagnosis: String,
    prescription: [{
      medicationName: String,
      dosage: String,
      frequency: String,
      duration: String,
      instructions: String
    }],
    labTests: [{
      testName: String,
      reason: String,
      urgent: Boolean
    }],
    notes: String,
    followUpRequired: Boolean,
    followUpDate: Date,
    referral: {
      specialistType: String,
      reason: String,
      urgency: {
        type: String,
        enum: ['routine', 'urgent', 'emergency']
      }
    }
  },
  
  // Payment
  payment: {
    consultationFee: Number,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'waived', 'insurance_claimed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'insurance', 'free']
    },
    paymentDate: Date,
    transactionId: String
  },
  
  // Communication
  meetingLink: String,
  meetingId: String,
  
  // Reminders
  reminders: [{
    sentAt: Date,
    type: {
      type: String,
      enum: ['sms', 'email', 'whatsapp', 'notification']
    },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'failed']
    }
  }],
  
  // Ratings & Feedback
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  },
  
  // Cancellation
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'system']
    },
    reason: String,
    cancelledAt: Date
  },
  
  // Metadata
  createdBy: {
    type: String,
    enum: ['patient', 'doctor', 'admin', 'system'],
    default: 'patient'
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
appointmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if appointment is upcoming
appointmentSchema.methods.isUpcoming = function() {
  return this.appointmentDate > new Date() && 
         (this.status === 'scheduled' || this.status === 'confirmed');
};

// Method to check if appointment can be cancelled
appointmentSchema.methods.canCancel = function() {
  const now = new Date();
  const appointmentTime = new Date(this.appointmentDate);
  const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);
  
  return hoursDifference > 2 && 
         (this.status === 'scheduled' || this.status === 'confirmed');
};

// Method to mark as completed
appointmentSchema.methods.complete = function(consultationData) {
  this.status = 'completed';
  this.consultation = {
    ...this.consultation,
    ...consultationData,
    endTime: new Date()
  };
  return this.save();
};

// Method to cancel appointment
appointmentSchema.methods.cancel = function(cancelledBy, reason) {
  this.status = 'cancelled';
  this.cancellation = {
    cancelledBy,
    reason,
    cancelledAt: new Date()
  };
  return this.save();
};

// Indexes for faster queries
appointmentSchema.index({ patientId: 1, appointmentDate: -1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: -1 });
appointmentSchema.index({ status: 1, appointmentDate: 1 });
appointmentSchema.index({ appointmentDate: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
