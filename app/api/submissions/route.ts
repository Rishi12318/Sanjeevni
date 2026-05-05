import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Submission from '@/models/Submission'

export async function GET() {
  try {
    await dbConnect()
    const submissions = await Submission.find({})
      .sort({ submittedAt: -1 })
      .limit(50)
      .select('_id role email submittedAt status')
      .lean()

    const items = submissions.map((s: any) => ({
      id: s._id,
      role: s.role,
      email: s.email,
      submittedAt: s.submittedAt,
      status: s.status,
    }))

    return NextResponse.json({ ok: true, count: items.length, submissions: items })
  } catch (err) {
    console.error('[/api/submissions]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
