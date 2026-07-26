/**
 * How an Odomite order is priced.
 *
 * Rentals are not charged online. The customer sees what the items come to,
 * and everything else — delivery, and the commitment fee that secures the
 * booking — is settled on the confirmation call. Nothing is estimated on the
 * customer's behalf, because a wrong estimate is worse than no number at all.
 *
 * One place defines this so the checkout page, the confirmation emails, the
 * WhatsApp message and the admin all tell the customer the same story.
 */

/** Refundable-style deposit taken when the booking is confirmed, not at checkout. */
export const COMMITMENT_FEE = 50;

/** Shown wherever a delivery charge would normally go. */
export const DELIVERY_NOTE = 'Quoted on confirmation';

export function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

export interface OrderPricing {
  subtotal: number;
  /** Always 0 at checkout — the real charge is agreed on the call. */
  shipping: number;
  /** Always 0 — Odomite does not add tax at checkout. */
  taxes: number;
  total: number;
}

/** The rental items are the whole of the checkout total. */
export function buildPricing(subtotal: number): OrderPricing {
  return { subtotal, shipping: 0, taxes: 0, total: subtotal };
}
