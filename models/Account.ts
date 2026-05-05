import mongoose, { Schema, Document } from 'mongoose'

export interface IAccount extends Document {
  email: string
  passwordHash: string
  role: string
  displayName?: string
  createdAt: Date
}

const accountSchema = new Schema<IAccount>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, default: 'User' },
    displayName: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Account || mongoose.model<IAccount>('Account', accountSchema)
