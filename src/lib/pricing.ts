/**
 * How an Odomite order is priced.
 *
 * Rentals are not charged online. The customer sees what the items come to,
 * and everything else — delivery, and the refundable security deposit that
 * secures the booking — is settled on the confirmation call. Nothing is
 * estimated on the customer's behalf, because a wrong estimate is worse than
 * no number at all.
 *
 * One place defines this so the checkout page, the confirmation emails, the
 * WhatsApp message and the admin all tell the customer the same story.
 */

/** Refundable deposit taken when the booking is confirmed, not at checkout. */
export const SECURITY_DEPOSIT = 50;

/** The one name this charge goes by, everywhere it is shown. */
export const SECURITY_DEPOSIT_LABEL = 'Refundable Security Deposit';

/**
 * Must accompany the deposit wherever it appears — checkout, invoices, booking
 * summaries, admin, emails and payment pages — so the customer is never asked
 * for it without being told how they get it back.
 */
export const SECURITY_DEPOSIT_NOTE =
  'This is a refundable security deposit. It will be refunded in full once all rental items are returned clean and undamaged, subject to the Rental Agreement.';

/** Where the full terms live. Linked anywhere the customer agrees to them. */
export const RENTAL_POLICY_PATH = '/rental-policy';

/** Shown wherever a delivery charge would normally go. */
export const DELIVERY_NOTE = 'Quoted on confirmation';

/** Shown instead of a delivery charge when the customer collects. */
export const CUSTOMER_PICKUP_NOTE = 'Customer pickup — no delivery fee';

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
