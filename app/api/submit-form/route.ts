import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import Submission from '@/models/Submission'
import Account from '@/models/Account'

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1'

async function getOllamaSummary(prompt: string): Promise<string> {
  try {
    const url = `${OLLAMA_BASE_URL.replace(/\/$/, '')}/api/generate`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false }),
      signal: AbortSignal.timeout(20_000),
    })
    if (!res.ok) return ''
    const data = await res.json()
    if (typeof data?.response === 'string') return data.response.trim()
    return ''
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const role = payload.role
    const email = payload.email
    const password = payload.password
    const signatureBase64: string = payload.signatureBase64 || payload.signature_base64 || ''

    if (!signatureBase64) {
      return NextResponse.json({ error: 'Missing signatureBase64' }, { status: 400 })
    }

    await dbConnect()

    const submissionCount = await Submission.countDocuments()
    let uniqueId: string | undefined
    if (role === 'NGO') {
      uniqueId = `NGO-${String(submissionCount + 1).padStart(6, '0')}`
    }

    // Summarise with Ollama (best effort — never blocks the response)
    const ollamaSummary = await getOllamaSummary(
      `Summarize this healthcare registration in one short line. Role: ${role}. Data: ${JSON.stringify(payload).slice(0, 800)}`
    )

    // Truncate base64 stored in DB (mirrors Django behaviour)
    const signatureBase64Truncated = signatureBase64.slice(0, 200)

    const submission = await Submission.create({
      role,
      email,
      phone: payload.phone,
      address: payload.address,
      city: payload.city,
      state: payload.state,
      zipCode: payload.zipCode || payload.zip_code,

      firstName: payload.firstName || payload.first_name,
      lastName: payload.lastName || payload.last_name,
      dateOfBirth: payload.dateOfBirth,
      gender: payload.gender,
      bloodGroup: payload.bloodGroup,
      emergencyContactName: payload.emergencyContactName,
      emergencyContactRelation: payload.emergencyContactRelation,
      emergencyContactPhone: payload.emergencyContactPhone,
      medicalConditions: payload.medicalConditions,
      currentMedications: payload.currentMedications,
      allergies: payload.allergies,
      previousSurgeries: payload.previousSurgeries,
      insuranceProvider: payload.insuranceProvider,
      insurancePolicyNumber: payload.insurancePolicyNumber,
      insuranceGroupId: payload.insuranceGroupId,
      preferredPaymentMethod: payload.preferredPaymentMethod,

      fullName: payload.fullName || payload.full_name,
      licenseNumber: payload.licenseNumber || payload.medicalLicenseNumber,
      specialization: payload.specialization,
      yearsOfExperience: payload.yearsOfExperience,
      medicalSchool: payload.medicalSchool,
      graduationYear: payload.graduationYear,
      boardCertifications: payload.boardCertifications,
      hospitalAffiliations: payload.hospitalAffiliations,
      clinicAddress: payload.clinicAddress,
      consultationFee: payload.consultationFee,
      availableDays: payload.availableDays,
      availableTimeSlots: payload.availableTimeSlots,
      languagesSpoken: payload.languagesSpoken,
      telemedicineAvailable: payload.telemedicineAvailable,
      acceptsInsurance: payload.acceptsInsurance,
      insuranceNetworks: payload.insuranceNetworks,

      organizationName: payload.organizationName || payload.organization_name,
      registrationNumber: payload.ngoRegistrationNumber || payload.registrationNumber,
      mission: payload.missionStatement || payload.mission,
      websiteUrl: payload.websiteUrl,
      contactPersonName: payload.contactPersonName,
      contactPersonDesignation: payload.contactPersonDesignation,
      areasOfOperation: payload.areasOfOperation,
      servicesOffered: payload.servicesOffered,
      targetBeneficiaries: payload.targetBeneficiaries,
      annualBudget: payload.annualBudget,
      fundingSources: payload.fundingSources,
      numberOfVolunteers: payload.numberOfVolunteers,
      numberOfStaff: payload.numberOfStaff,
      previousHealthcareProjects: payload.previousHealthcareProjects,
      partnershipsCollaborations: payload.partnershipsCollaborations,

      signatureBase64: signatureBase64Truncated,
      uniqueId,
      ollamaSummary,

      q1: payload.q1,
      q2: payload.q2,
      q3: payload.q3,
      q4: payload.q4,
    })

    // Create / update Account
    if (email && password) {
      let accountRole = role === 'Patient' ? 'User' : (role || 'User')
      const displayName =
        payload.fullName ||
        payload.full_name ||
        payload.organizationName ||
        payload.organization_name ||
        payload.firstName ||
        payload.first_name ||
        email

      const passwordHash = await bcrypt.hash(password, 10)

      await Account.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          $set: {
            role: accountRole,
            displayName,
            passwordHash,
          },
        },
        { upsert: true, new: true }
      )
    }

    return NextResponse.json({
      ok: true,
      id: submission._id,
      uniqueId: uniqueId || null,
      ollamaSummary,
    })
  } catch (err) {
    console.error('[/api/submit-form]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
