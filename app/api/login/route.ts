import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import Account from '@/models/Account'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = (body.email || '').trim().toLowerCase()
    const password = body.password || ''
    const role = (body.role || 'User').trim()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    await dbConnect()

    const account = await Account.findOne({ email })
    if (!account) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    // Normalise Patient → User
    const normalizedAccountRole = account.role === 'Patient' ? 'User' : account.role
    const normalizedRequestedRole = role === 'Patient' ? 'User' : role

    if (normalizedRequestedRole && normalizedAccountRole && normalizedAccountRole !== normalizedRequestedRole) {
      return NextResponse.json(
        { error: `Account is registered as ${account.role}, not ${role}` },
        { status: 403 }
      )
    }

    const passwordMatch = await bcrypt.compare(password, account.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    let dashboardPath = '/dashboard/patient'
    if (normalizedAccountRole === 'Doctor') dashboardPath = '/dashboard/doctor'
    else if (normalizedAccountRole === 'NGO') dashboardPath = '/dashboard/ngo'

    return NextResponse.json({
      ok: true,
      email: account.email,
      role: normalizedAccountRole,
      dashboardPath,
      displayName: account.displayName,
    })
  } catch (err) {
    console.error('[/api/login]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
