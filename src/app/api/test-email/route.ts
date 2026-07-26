import { NextRequest, NextResponse } from 'next/server'
import { BUSINESS_EMAIL, emailLayout, paragraph, sendEmail } from '@/lib/email'

/**
 * Diagnostic for the Resend setup.
 *
 * GET  — reports which env vars are present, sends nothing.
 * POST — sends a test message to `to` (defaults to BUSINESS_EMAIL).
 */

function config() {
  return {
    RESEND_API_KEY: process.env.RESEND_API_KEY ? 'set' : 'MISSING',
    EMAIL_FROM: process.env.EMAIL_FROM ?? 'MISSING (falling back to onboarding@resend.dev)',
    BUSINESS_EMAIL,
  }
}

export async function GET() {
  return NextResponse.json({
    config: config(),
    note: "EMAIL_FROM's domain must be verified in Resend, otherwise every send is rejected.",
  })
}

export async function POST(request: NextRequest) {
  let to = BUSINESS_EMAIL

  try {
    const body = await request.json()
    if (body?.to) to = body.to
  } catch {
    // No body supplied — fall back to the business inbox.
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY is not set.', config: config() },
      { status: 500 }
    )
  }

  const result = await sendEmail({
    to,
    subject: 'Odomite Rentals — email configuration test',
    html: emailLayout({
      heading: 'Your email setup works.',
      preheader: 'Test message from the Odomite Rentals site.',
      body: paragraph(
        `This is a test message sent through Resend at ${new Date().toLocaleString()}. If you can read this, order confirmations, contact enquiries and newsletter signups will deliver too.`
      ),
    }),
  })

  return NextResponse.json(
    { ...result, to, config: config() },
    { status: result.sent ? 200 : 502 }
  )
}
