import { NextRequest, NextResponse } from 'next/server'
import { BUSINESS_EMAIL, emailLayout, escapeHtml, paragraph, sendEmail } from '@/lib/email'
import { supabaseAdmin } from '@/lib/supabase-admin'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  try {
    const { email, source } = (await request.json()) as { email?: string; source?: string }
    const address = email?.trim().toLowerCase()

    if (!address || !EMAIL_PATTERN.test(address)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // Signups are recorded first so the admin subscriber list stays accurate even
    // if email delivery is down. Re-subscribing an existing address is a no-op
    // rather than an error.
    const { error: saveError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .upsert(
        { email: address, source: source?.trim() || 'website', status: 'subscribed', unsubscribed_at: null },
        { onConflict: 'email' }
      )

    if (saveError) {
      console.error('Newsletter subscriber save failed:', saveError)
      return NextResponse.json(
        { error: 'We could not complete your signup right now. Please try again later.' },
        { status: 500 }
      )
    }

    const notification = await sendEmail({
      to: BUSINESS_EMAIL,
      subject: `Newsletter signup — ${address}`,
      replyTo: address,
      html: emailLayout({
        heading: 'New newsletter signup',
        preheader: address,
        body: paragraph(`<strong>${escapeHtml(address)}</strong> subscribed from the website.`),
      }),
    })

    // The subscriber is already stored, so a failed notification is logged
    // rather than surfaced — the signup itself succeeded.
    if (!notification.sent) {
      console.error('Newsletter notification failed:', notification.error)
    }

    const welcome = await sendEmail({
      to: address,
      subject: "You're on the list — Odomite Rentals",
      replyTo: BUSINESS_EMAIL,
      html: emailLayout({
        heading: "You're on the list.",
        preheader: 'Promotions, new arrivals and early-access offers.',
        body: `
          ${paragraph(
            'Thanks for subscribing. We send promotions, new arrivals and the occasional early-access offer — only when we have something worth sharing.'
          )}
          ${paragraph('Not what you expected? Just reply to this email and we will remove you.')}
        `,
      }),
    })

    if (!welcome.sent) {
      console.error('Newsletter welcome email failed:', welcome.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error handling newsletter signup:', error)
    return NextResponse.json({ error: 'Failed to complete signup.' }, { status: 500 })
  }
}
