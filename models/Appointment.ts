import mongoose, { Schema, Document } from 'mongoose'

export interface IAppointment extends Document {
  doctorName: string
  patientName?: string
  patientEmail?: string
  patientPhone?: string
  appointmentType: 'physical' | 'virtual'
  hospital?: string
  date: string
  time: string
  reason?: string
  createdAt: Date
}

const appointmentSchema = new Schema<IAppointment>(
  {
    doctorName: { type: String, required: true },
    patientName: { type: String },
    patientEmail: { type: String },
    patientPhone: { type: String },
    appointmentType: { type: String, enum: ['physical', 'virtual'], default: 'physical' },
    hospital: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', appointmentSchema)
