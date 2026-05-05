import mongoose, { Schema, Document } from 'mongoose'

export interface ISubmission extends Document {
  role?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string

  // Patient
  firstName?: string
  lastName?: string
  dateOfBirth?: Date
  gender?: string
  bloodGroup?: string
  emergencyContactName?: string
  emergencyContactRelation?: string
  emergencyContactPhone?: string
  medicalConditions?: string
  currentMedications?: string
  allergies?: string
  previousSurgeries?: string
  insuranceProvider?: string
  insurancePolicyNumber?: string
  insuranceGroupId?: string
  preferredPaymentMethod?: string

  // Doctor
  fullName?: string
  licenseNumber?: string
  specialization?: string
  yearsOfExperience?: number
  medicalSchool?: string
  graduationYear?: number
  boardCertifications?: string
  hospitalAffiliations?: string
  clinicAddress?: string
  consultationFee?: number
  availableDays?: string[]
  availableTimeSlots?: string
  languagesSpoken?: string[]
  telemedicineAvailable?: boolean
  acceptsInsurance?: boolean
  insuranceNetworks?: string

  // NGO
  organizationName?: string
  registrationNumber?: string
  establishedDate?: Date
  mission?: string
  websiteUrl?: string
  contactPersonName?: string
  contactPersonDesignation?: string
  areasOfOperation?: string[]
  servicesOffered?: string
  targetBeneficiaries?: string
  annualBudget?: string
  fundingSources?: string
  numberOfVolunteers?: number
  numberOfStaff?: number
  previousHealthcareProjects?: string
  partnershipsCollaborations?: string

  // Metadata
  signatureFilename?: string
  signatureBase64?: string
  uniqueId?: string
  ollamaSummary?: string
  submittedAt: Date
  status: string

  // Legacy q fields
  q1?: string
  q2?: string
  q3?: string
  q4?: string
}

const submissionSchema = new Schema<ISubmission>({
  role: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,

  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  emergencyContactName: String,
  emergencyContactRelation: String,
  emergencyContactPhone: String,
  medicalConditions: String,
  currentMedications: String,
  allergies: String,
  previousSurgeries: String,
  insuranceProvider: String,
  insurancePolicyNumber: String,
  insuranceGroupId: String,
  preferredPaymentMethod: String,

  fullName: String,
  licenseNumber: String,
  specialization: String,
  yearsOfExperience: Number,
  medicalSchool: String,
  graduationYear: Number,
  boardCertifications: String,
  hospitalAffiliations: String,
  clinicAddress: String,
  consultationFee: Number,
  availableDays: [String],
  availableTimeSlots: String,
  languagesSpoken: [String],
  telemedicineAvailable: Boolean,
  acceptsInsurance: Boolean,
  insuranceNetworks: String,

  organizationName: String,
  registrationNumber: String,
  establishedDate: Date,
  mission: String,
  websiteUrl: String,
  contactPersonName: String,
  contactPersonDesignation: String,
  areasOfOperation: [String],
  servicesOffered: String,
  targetBeneficiaries: String,
  annualBudget: String,
  fundingSources: String,
  numberOfVolunteers: Number,
  numberOfStaff: Number,
  previousHealthcareProjects: String,
  partnershipsCollaborations: String,

  signatureFilename: String,
  signatureBase64: String,
  uniqueId: String,
  ollamaSummary: String,
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },

  q1: String,
  q2: String,
  q3: String,
  q4: String,
})

export default mongoose.models.Submission || mongoose.model<ISubmission>('Submission', submissionSchema)
