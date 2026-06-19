import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'E-posta gerekli' }, { status: 400 })
  }

  // Always return success to prevent email enumeration attacks
  const user = await db.user.findUnique({ where: { email } })
  if (!user || !user.password) {
    return NextResponse.json({ ok: true })
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

  await db.verificationToken.deleteMany({ where: { identifier: `reset:${email}` } })

  await db.verificationToken.create({
    data: {
      identifier: `reset:${email}`,
      token,
      expires,
    },
  })

  const resetUrl = `${process.env.NEXTAUTH_URL}/sifresi-sifirla?token=${token}&email=${encodeURIComponent(email)}`

  // TODO: Send email with resetUrl using a mail provider (e.g. Resend, Nodemailer)
  // For now, log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[PASSWORD RESET URL]', resetUrl)
  }

  return NextResponse.json({ ok: true })
}
