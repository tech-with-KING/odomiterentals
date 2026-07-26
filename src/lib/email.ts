import { Resend } from 'resend';

/**
 * Single entry point for outbound email. Everything goes through Resend.
 *
 * Required env:
 *   RESEND_API_KEY  — Resend API key
 *   EMAIL_FROM      — sender, e.g. "Odomite Rentals <orders@odomiterentals.com>".
 *                     The domain MUST be verified in Resend or sends are rejected.
 *   BUSINESS_EMAIL  — where owner notifications land (defaults to the shop inbox)
 */

const BRAND = {
  gold: '#c79a3e',
  goldDeep: '#9a7526',
  goldSoft: '#f3ead6',
  ink: '#141210',
  mutedInk: '#6b645c',
  background: '#faf8f5',
  surface: '#ffffff',
  hairline: '#e8e2d9',
};

export const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || 'odomitegroupsllc@gmail.com';
export const BUSINESS_PHONE = '+1 (862) 230-6639';

function getFromAddress() {
  return process.env.EMAIL_FROM || `Odomite Rentals <onboarding@resend.dev>`;
}

let client: Resend | null = null;

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

export interface SendEmailArgs {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  sent: boolean;
  id?: string;
  error?: string;
}

/**
 * Sends an email, never throwing — callers decide how a failure affects their
 * flow (an order must still succeed even if its confirmation bounces).
 */
export async function sendEmail({ to, subject, html, replyTo }: SendEmailArgs): Promise<SendEmailResult> {
  const resend = getClient();

  if (!resend) {
    const error = 'RESEND_API_KEY is not set — email not sent.';
    console.error(error);
    return { sent: false, error };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      const message = error.message ?? 'Resend rejected the message';

      // By far the most common cause in practice: no verified domain, so Resend
      // stays in testing mode and silently refuses every recipient except the
      // account owner. Spell out the fix rather than echoing the raw error.
      if (/only send testing emails/i.test(message)) {
        console.error(
          `Resend is in testing mode, so "${to}" was NOT emailed. ` +
            'Verify a domain at resend.com/domains, then set EMAIL_FROM to an address on that ' +
            `domain (currently "${getFromAddress()}"). Original error: ${message}`
        );
      } else {
        console.error('Resend rejected the message:', error);
      }

      return { sent: false, error: message };
    }

    return { sent: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error';
    console.error('Error sending email:', message);
    return { sent: false, error: message };
  }
}

/** Wraps content in the Odomite shell so every email matches the site. */
export function emailLayout({
  heading,
  preheader,
  body,
}: {
  heading: string;
  preheader?: string;
  body: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.background};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:${BRAND.ink};">
  ${
    preheader
      ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>`
      : ''
  }
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.background};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${BRAND.surface};border:1px solid ${BRAND.hairline};border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:${BRAND.ink};padding:28px 32px;">
              <div style="font-size:22px;font-weight:600;color:#ffffff;letter-spacing:-0.02em;">
                Odomite <span style="font-size:12px;letter-spacing:0.2em;color:rgba(255,255,255,0.7);text-transform:uppercase;">Rentals</span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 20px;font-size:24px;line-height:1.2;font-weight:600;color:${BRAND.ink};letter-spacing:-0.02em;">${heading}</h1>
              ${body}
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid ${BRAND.hairline};padding:24px 32px;background:${BRAND.background};">
              <p style="margin:0 0 6px;font-size:13px;color:${BRAND.mutedInk};">
                Questions? Call <a href="tel:+18622306639" style="color:${BRAND.goldDeep};text-decoration:none;">${BUSINESS_PHONE}</a>
                or reply to this email.
              </p>
              <p style="margin:0;font-size:12px;color:${BRAND.mutedInk};">
                Odomite Rentals · 331 Seymour Ave, Newark, NJ 07112
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function paragraph(text: string) {
  return `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${BRAND.mutedInk};">${text}</p>`;
}

export function detailRows(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
    ${rows
      .map(
        ([label, value]) => `<tr>
          <td style="padding:8px 0;border-bottom:1px solid ${BRAND.hairline};font-size:14px;color:${BRAND.mutedInk};">${label}</td>
          <td style="padding:8px 0;border-bottom:1px solid ${BRAND.hairline};font-size:14px;color:${BRAND.ink};text-align:right;font-weight:500;">${value}</td>
        </tr>`
      )
      .join('')}
  </table>`;
}

export function calloutBox(inner: string) {
  return `<div style="background:${BRAND.goldSoft};border-radius:12px;padding:18px 20px;margin:0 0 20px;">${inner}</div>`;
}

export function button(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:${BRAND.gold};color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;padding:12px 24px;border-radius:999px;">${label}</a>`;
}

/** Escapes user-supplied text before it goes into an HTML email. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export { BRAND };
