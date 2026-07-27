import {
  BRAND,
  calloutBox,
  detailRows,
  emailLayout,
  escapeHtml,
  paragraph,
} from '@/lib/email';
import { COMMITMENT_FEE, DELIVERY_NOTE, formatPrice } from '@/lib/pricing';

/**
 * The order confirmation and business notification emails.
 *
 * Kept out of the route handler so the markup can be rendered and inspected
 * without submitting a real order.
 *
 * Email HTML rules that shape everything below: tables for layout, inline
 * styles only, absolute image URLs, and explicit width/height on every image.
 * Most clients block images until the reader allows them, so the text has to
 * carry the whole message on its own — the thumbnails are reinforcement, never
 * the only way to tell what was booked.
 */

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  duration: number;
  unitPrice: number;
  total: number;
  category: string;
  productId: string;
}

export interface OrderData {
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    rentalStartDate: string;
    specialInstructions: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    taxes: number;
    total: number;
  };
  orderDate: string;
  userId: string;
}

const money = formatPrice;

const THUMB = 72;

/**
 * "Friday, August 14, 2026" rather than "2026-08-14".
 * Parsed as UTC noon so a date-only string cannot slip a day either way.
 */
function formatRentalDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Product thumbnail, or a neutral tile when an item has no image. */
function thumbnail(item: OrderItem) {
  const box = `width:${THUMB}px;height:${THUMB}px;border-radius:10px;border:1px solid ${BRAND.hairline};background:${BRAND.background};`;

  if (!item.image) {
    return `<div style="${box}"></div>`;
  }

  return `<img
    src="${escapeHtml(item.image)}"
    alt="${escapeHtml(item.name)}"
    width="${THUMB}"
    height="${THUMB}"
    style="${box}display:block;object-fit:cover;"
  />`;
}

/**
 * One row per item, mirroring the cart: image, then what was booked, then the
 * line total on the right.
 */
export function renderItems(items: OrderItem[]) {
  return items
    .map(
      (item, index) => `
      <tr>
        <td width="${THUMB}" style="padding:${index === 0 ? '0' : '14px'} 14px 14px 0;vertical-align:top;">
          ${thumbnail(item)}
        </td>
        <td style="padding:${index === 0 ? '0' : '14px'} 0 14px;vertical-align:top;">
          <div style="font-size:15px;font-weight:600;line-height:1.35;color:${BRAND.ink};">
            ${escapeHtml(item.name)}
          </div>
          <div style="font-size:13px;line-height:1.5;color:${BRAND.mutedInk};margin-top:4px;">
            Qty ${item.quantity} &times; ${item.duration} ${item.duration === 1 ? 'day' : 'days'}
          </div>
          <div style="font-size:13px;line-height:1.5;color:${BRAND.mutedInk};">
            ${money(item.unitPrice)} per day
          </div>
        </td>
        <td style="padding:${index === 0 ? '0' : '14px'} 0 14px;vertical-align:top;text-align:right;white-space:nowrap;font-size:15px;font-weight:600;color:${BRAND.ink};">
          ${money(item.total)}
        </td>
      </tr>
      ${
        index < items.length - 1
          ? `<tr><td colspan="3" style="border-top:1px solid ${BRAND.hairline};font-size:0;line-height:0;">&nbsp;</td></tr>`
          : ''
      }`
    )
    .join('');
}

export function renderOrderSummary(orderData: OrderData) {
  const { items, pricing } = orderData;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse;">
      ${renderItems(items)}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px;border-top:1px solid ${BRAND.hairline};padding-top:8px;">
      <tr>
        <td style="padding:10px 0 6px;font-size:14px;color:${BRAND.mutedInk};">Rental items</td>
        <td style="padding:10px 0 6px;text-align:right;font-size:14px;color:${BRAND.ink};">${money(pricing.subtotal)}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:14px;color:${BRAND.mutedInk};">Delivery</td>
        <td style="padding:6px 0;text-align:right;font-size:14px;color:${BRAND.ink};">${DELIVERY_NOTE}</td>
      </tr>
      <tr>
        <td style="padding:12px 0 0;border-top:1px solid ${BRAND.hairline};font-size:16px;font-weight:600;color:${BRAND.ink};">Total</td>
        <td style="padding:12px 0 0;border-top:1px solid ${BRAND.hairline};text-align:right;font-size:18px;font-weight:600;color:${BRAND.gold};">${money(pricing.total)}</td>
      </tr>
    </table>
    <p style="margin:0 0 24px;font-size:13px;color:${BRAND.mutedInk};">No tax is added. Delivery is quoted separately.</p>`;
}

export function buildCustomerEmail(orderData: OrderData, orderId: string) {
  const { customerInfo } = orderData;
  const shortId = orderId.slice(0, 8).toUpperCase();

  const address = [
    customerInfo.address,
    [customerInfo.city, customerInfo.state].filter(Boolean).join(', '),
    customerInfo.zipCode,
  ]
    .filter(Boolean)
    .map(escapeHtml)
    .join('<br>');

  return emailLayout({
    heading: `Thank you, ${escapeHtml(customerInfo.firstName)}.`,
    preheader: `We've received your rental booking #${shortId}.`,
    body: `
      ${paragraph(
        "We've received your booking. We'll contact you to confirm availability, agree the delivery charge, and arrange the commitment fee. Nothing is charged online."
      )}

      ${calloutBox(`
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.18em;color:${BRAND.goldDeep};margin-bottom:6px;">Booking reference</div>
        <div style="font-size:18px;font-weight:600;color:${BRAND.ink};">#${shortId}</div>
      `)}

      <h2 style="margin:28px 0 14px;font-size:16px;font-weight:600;color:${BRAND.ink};">What you booked</h2>
      ${renderOrderSummary(orderData)}

      ${calloutBox(`
        <div style="font-size:15px;font-weight:600;color:${BRAND.ink};margin-bottom:6px;">A $${COMMITMENT_FEE} commitment fee secures your booking</div>
        <div style="font-size:14px;line-height:1.6;color:${BRAND.mutedInk};">
          It is not charged now. We'll arrange it with you when we call to confirm.
        </div>
      `)}

      <h2 style="margin:28px 0 12px;font-size:16px;font-weight:600;color:${BRAND.ink};">Delivery details</h2>
      ${detailRows([
        ['Rental start date', escapeHtml(formatRentalDate(customerInfo.rentalStartDate))],
        ['Delivery address', address],
        ['Phone', escapeHtml(customerInfo.phone)],
      ])}

      ${
        customerInfo.specialInstructions
          ? `<h2 style="margin:0 0 8px;font-size:16px;font-weight:600;color:${BRAND.ink};">Special instructions</h2>
             ${paragraph(escapeHtml(customerInfo.specialInstructions))}`
          : ''
      }
    `,
  });
}

/** A numbered step, for the "what happens on the call" sequence. */
function step(index: number, title: string, body: string) {
  return `
    <tr>
      <td width="36" style="padding:0 14px 18px 0;vertical-align:top;">
        <div style="width:28px;height:28px;border-radius:999px;background:${BRAND.goldSoft};color:${BRAND.goldDeep};font-size:13px;font-weight:600;text-align:center;line-height:28px;">${index}</div>
      </td>
      <td style="padding:0 0 18px;vertical-align:top;">
        <div style="font-size:15px;font-weight:600;color:${BRAND.ink};line-height:1.4;">${title}</div>
        <div style="font-size:14px;line-height:1.6;color:${BRAND.mutedInk};margin-top:3px;">${body}</div>
      </td>
    </tr>`;
}

function checklistItem(text: string) {
  return `
    <tr>
      <td width="20" style="padding:0 10px 10px 0;vertical-align:top;color:${BRAND.gold};font-size:15px;line-height:1.6;">&bull;</td>
      <td style="padding:0 0 10px;font-size:14px;line-height:1.6;color:${BRAND.mutedInk};">${text}</td>
    </tr>`;
}

/**
 * Sent straight after the confirmation. The confirmation says *what* was
 * booked; this one says what happens next and what the customer can do now, so
 * the confirmation call is short and delivery day goes smoothly.
 */
export function buildFollowUpEmail(orderData: OrderData, orderId: string) {
  const { customerInfo } = orderData;
  const shortId = orderId.slice(0, 8).toUpperCase();

  return emailLayout({
    heading: `What happens next, ${escapeHtml(customerInfo.firstName)}.`,
    preheader: `How your booking #${shortId} gets confirmed, and how to prepare for delivery.`,
    body: `
      ${paragraph(
        `Your booking <strong>#${shortId}</strong> is with us. Here is exactly how it gets confirmed, and a short list of things that make delivery day easier.`
      )}

      <h2 style="margin:28px 0 16px;font-size:16px;font-weight:600;color:${BRAND.ink};">On the confirmation call</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${step(1, 'We confirm availability', `We check every item on your list is free for ${escapeHtml(formatRentalDate(customerInfo.rentalStartDate))}.`)}
        ${step(2, 'We agree the delivery charge', 'Based on your address and the time you need everything on site. No delivery cost was added at checkout.')}
        ${step(3, `We arrange the $${COMMITMENT_FEE} commitment fee`, 'This secures your date. Nothing was charged online.')}
      </table>

      <h2 style="margin:8px 0 16px;font-size:16px;font-weight:600;color:${BRAND.ink};">Before we arrive</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
        ${checklistItem('Clear a path to the setup area — gates, stairs, and somewhere to park the van.')}
        ${checklistItem('Have the space empty before we get there. Setup is much faster on a clear site.')}
        ${checklistItem('For tents, we need level ground and about two feet of clearance around the footprint. Tell us about sprinklers or buried lines before we stake anything.')}
        ${checklistItem('Someone over 18 needs to be on site to receive the delivery.')}
      </table>

      ${calloutBox(`
        <div style="font-size:14px;line-height:1.6;color:${BRAND.ink};">
          Something changed? Reply to this email or call
          <a href="tel:+18622306639" style="color:${BRAND.goldDeep};text-decoration:none;font-weight:500;">+1 (862) 230-6639</a>.
          Changes are easiest before the confirmation call.
        </div>
      `)}
    `,
  });
}

export function buildBusinessEmail(orderData: OrderData, orderId: string, whatsappUrl: string) {
  const { customerInfo, pricing } = orderData;
  const shortId = orderId.slice(0, 8).toUpperCase();

  return emailLayout({
    heading: `New booking — ${money(pricing.total)}`,
    preheader: `${customerInfo.firstName} ${customerInfo.lastName} booked #${shortId}.`,
    body: `
      ${detailRows([
        ['Booking', `#${shortId}`],
        ['Customer', escapeHtml(`${customerInfo.firstName} ${customerInfo.lastName}`)],
        ['Email', escapeHtml(customerInfo.email)],
        ['Phone', escapeHtml(customerInfo.phone)],
        ['Rental start', escapeHtml(formatRentalDate(customerInfo.rentalStartDate))],
        [
          'Address',
          escapeHtml(
            [customerInfo.address, customerInfo.city, customerInfo.state, customerInfo.zipCode]
              .filter(Boolean)
              .join(', ')
          ),
        ],
      ])}

      <div style="margin:0 0 24px;">
        <a href="${whatsappUrl}" style="display:inline-block;background:${BRAND.gold};color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;padding:12px 24px;border-radius:999px;">Message customer on WhatsApp</a>
      </div>

      <h2 style="margin:0 0 14px;font-size:16px;font-weight:600;color:${BRAND.ink};">Items to prepare</h2>
      ${renderOrderSummary(orderData)}

      ${calloutBox(`
        <div style="font-size:14px;color:${BRAND.ink};">
          Collect the <strong>$${COMMITMENT_FEE} commitment fee</strong> and agree the delivery
          charge on the confirmation call.
        </div>
      `)}

      ${
        customerInfo.specialInstructions
          ? `<h2 style="margin:0 0 8px;font-size:16px;font-weight:600;color:${BRAND.ink};">Special instructions</h2>
             ${paragraph(escapeHtml(customerInfo.specialInstructions))}`
          : ''
      }
    `,
  });
}

export function generateWhatsAppMessage(orderData: OrderData, orderId: string) {
  const { customerInfo, items, pricing } = orderData;

  let message = `🛍️ *NEW BOOKING* - #${orderId.slice(0, 8).toUpperCase()}\n\n`;
  message += `👤 *Customer Details:*\n`;
  message += `Name: ${customerInfo.firstName} ${customerInfo.lastName}\n`;
  message += `📧 Email: ${customerInfo.email}\n`;
  message += `📱 Phone: ${customerInfo.phone}\n`;
  message += `📍 Address: ${customerInfo.address}, ${customerInfo.city}\n`;

  if (customerInfo.state) message += `State: ${customerInfo.state}\n`;
  if (customerInfo.zipCode) message += `ZIP: ${customerInfo.zipCode}\n`;

  message += `📅 Rental Start: ${customerInfo.rentalStartDate}\n\n`;

  message += `🛒 *Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   • Qty: ${item.quantity} × ${item.duration} days\n`;
    message += `   • ${money(item.total)}\n\n`;
  });

  message += `💰 *Totals:*\n`;
  message += `Rental items: ${money(pricing.subtotal)}\n`;
  message += `Delivery: ${DELIVERY_NOTE}\n`;
  message += `*Total: ${money(pricing.total)}*\n`;
  message += `Commitment fee to collect: $${COMMITMENT_FEE}\n\n`;

  if (customerInfo.specialInstructions) {
    message += `📝 *Special Instructions:*\n${customerInfo.specialInstructions}\n\n`;
  }

  message += `🕒 ${new Date(orderData.orderDate).toLocaleString()}`;

  return encodeURIComponent(message);
}
