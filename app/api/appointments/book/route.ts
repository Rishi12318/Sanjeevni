import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const doctorName = body.doctorName || body.doctor_name || body.doctor
    const date = body.date
    const time = body.time

    if (!doctorName || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorName, date, time' },
        { status: 400 }
      )
    }

    await dbConnect()

    const appt = await Appointment.create({
      doctorName,
      patientName: body.patientName || body.patient_name,
      patientEmail: body.patientEmail || body.patient_email,
      patientPhone: body.patientPhone || body.patient_phone,
      appointmentType: body.appointmentType || body.appointment_type || 'physical',
      hospital: body.hospital,
      date,
      time,
      reason: body.reason,
    })

    return NextResponse.json({ ok: true, appointmentId: appt._id, message: 'Appointment booked' })
  } catch (err) {
    console.error('[/api/appointments/book]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
