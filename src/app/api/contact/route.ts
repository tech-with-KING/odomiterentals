import { NextRequest, NextResponse } from 'next/server'
import {
  BRAND,
  BUSINESS_EMAIL,
  detailRows,
  emailLayout,
  escapeHtml,
  paragraph,
  sendEmail,
} from '@/lib/email'

interface ContactPayload {
  name: string
  email: string
  phone?: string
  rentalType?: string
  subject?: string
  message: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const payload: ContactPayload = await request.json()
    const name = payload.name?.trim()
    const email = payload.email?.trim()
    const message = payload.message?.trim()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const subject = payload.subject?.trim() || `Rental enquiry — ${payload.rentalType || 'General'}`

    const rows: Array<[string, string]> = [
      ['Name', escapeHtml(name)],
      ['Email', escapeHtml(email)],
    ]
    if (payload.phone?.trim()) rows.push(['Phone', escapeHtml(payload.phone.trim())])
    if (payload.rentalType?.trim()) rows.push(['Looking for', escapeHtml(payload.rentalType.trim())])

    // Notify the shop. replyTo is the customer so a reply goes straight back to them.
    const notification = await sendEmail({
      to: BUSINESS_EMAIL,
      subject: `Website enquiry — ${subject}`,
      replyTo: email,
      html: emailLayout({
        heading: 'New website enquiry',
        preheader: `${name}: ${message.slice(0, 90)}`,
        body: `
          ${detailRows(rows)}
          <h2 style="margin:0 0 8px;font-size:16px;font-weight:600;color:${BRAND.ink};">Message</h2>
          <div style="background:${BRAND.background};border:1px solid ${BRAND.hairline};border-radius:12px;padding:16px 18px;font-size:15px;line-height:1.6;color:${BRAND.ink};white-space:pre-wrap;">${escapeHtml(
            message
          )}</div>
        `,
      }),
    })

    if (!notification.sent) {
      console.error('Contact enquiry email failed:', notification.error)
      return NextResponse.json(
        { error: 'We could not send your message right now. Please call us instead.' },
        { status: 502 }
      )
    }

    // Acknowledge the customer. Best-effort — the enquiry already reached the shop.
    const acknowledgement = await sendEmail({
      to: email,
      subject: 'We received your message — Odomite Rentals',
      replyTo: BUSINESS_EMAIL,
      html: emailLayout({
        heading: `Thanks for reaching out, ${escapeHtml(name.split(' ')[0])}.`,
        preheader: 'We typically reply within the hour during business hours.',
        body: `
          ${paragraph(
            'We have your message and will get back to you shortly — usually within the hour during business hours.'
          )}
          <h2 style="margin:24px 0 8px;font-size:16px;font-weight:600;color:${BRAND.ink};">What you sent us</h2>
          <div style="background:${BRAND.background};border:1px solid ${BRAND.hairline};border-radius:12px;padding:16px 18px;font-size:15px;line-height:1.6;color:${BRAND.mutedInk};white-space:pre-wrap;">${escapeHtml(
            message
          )}</div>
        `,
      }),
    })

    if (!acknowledgement.sent) {
      console.error('Contact acknowledgement email failed:', acknowledgement.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling contact enquiry:', error)
    return NextResponse.json({ error: 'Failed to send your message.' }, { status: 500 })
  }
}
