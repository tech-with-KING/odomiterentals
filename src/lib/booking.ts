/**
 * The shape of a booking, and the handful of decisions a customer makes about
 * how it runs: whether we deliver or they collect, where the event actually is,
 * and whether they need the items for a day or for a stretch of days.
 *
 * Checkout, the API route, the emails, the confirmation page and the admin all
 * read these types and formatters, so the customer is told the same story
 * everywhere and nothing has to be re-derived from loose strings.
 *
 * Orders placed before these fields existed come back from the database with
 * them null. `normalizeCustomerInfo` fills in the behaviour those bookings
 * already had — we delivered, and the date was a single day — so old orders
 * render correctly rather than showing blanks.
 */

/** We bring it to them, or they collect it from us. */
export type DeliveryMethod = 'delivery' | 'pickup';

/** One day, or a start-to-end window. */
export type BookingDateMode = 'single' | 'range';

export const DELIVERY_METHODS: DeliveryMethod[] = ['delivery', 'pickup'];

export const DELIVERY_METHOD_LABEL: Record<DeliveryMethod, string> = {
  delivery: 'Delivery & Pickup',
  pickup: 'Customer Pickup & Return',
};

export const DELIVERY_METHOD_HINT: Record<DeliveryMethod, string> = {
  delivery: 'We deliver to your event and collect afterwards. Delivery is quoted on confirmation.',
  pickup: 'You collect from us and bring everything back. No delivery charge.',
};

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Optional. Used only when the primary number cannot be reached. */
  alternatePhone: string;

  /** The customer's own address. */
  address: string;
  city: string;
  state: string;
  zipCode: string;

  deliveryMethod: DeliveryMethod;

  /** Where the event is. Empty when it is the same as the home address. */
  eventAddress: string;
  eventAddressSameAsHome: boolean;

  bookingDateMode: BookingDateMode;
  rentalStartDate: string;
  /** Only meaningful when `bookingDateMode` is 'range'. */
  rentalEndDate: string;

  specialInstructions: string;
}

/** A blank booking, used to seed the checkout form. */
export function emptyCustomerInfo(email = ''): CustomerInfo {
  return {
    firstName: '',
    lastName: '',
    email,
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryMethod: 'delivery',
    eventAddress: '',
    eventAddressSameAsHome: true,
    bookingDateMode: 'single',
    rentalStartDate: '',
    rentalEndDate: '',
    specialInstructions: '',
  };
}

/**
 * Fills in anything a stored or in-flight booking is missing, so every consumer
 * can read the fields directly instead of guarding each one.
 */
export function normalizeCustomerInfo(info: Partial<CustomerInfo> | null | undefined): CustomerInfo {
  const source = info ?? {};
  const deliveryMethod: DeliveryMethod =
    source.deliveryMethod === 'pickup' ? 'pickup' : 'delivery';
  const bookingDateMode: BookingDateMode =
    source.bookingDateMode === 'range' && source.rentalEndDate ? 'range' : 'single';

  return {
    firstName: source.firstName ?? '',
    lastName: source.lastName ?? '',
    email: source.email ?? '',
    phone: source.phone ?? '',
    alternatePhone: source.alternatePhone ?? '',
    address: source.address ?? '',
    city: source.city ?? '',
    state: source.state ?? '',
    zipCode: source.zipCode ?? '',
    deliveryMethod,
    eventAddress: source.eventAddress ?? '',
    // Legacy orders only ever had the one address, which is exactly what
    // "same as home" means.
    eventAddressSameAsHome: source.eventAddressSameAsHome ?? !source.eventAddress,
    bookingDateMode,
    rentalStartDate: source.rentalStartDate ?? '',
    rentalEndDate: bookingDateMode === 'range' ? (source.rentalEndDate ?? '') : '',
    specialInstructions: source.specialInstructions ?? '',
  };
}

/**
 * The `orders` columns for a booking. Both write paths — the guest checkout
 * route and the in-app OrderService — go through this, so a new field can
 * never reach one of them and not the other.
 */
export function customerInfoToOrderRow(info: Partial<CustomerInfo>) {
  const c = normalizeCustomerInfo(info);

  return {
    first_name: c.firstName,
    last_name: c.lastName,
    email: c.email,
    phone: c.phone,
    alternate_phone: c.alternatePhone || null,
    address: c.address,
    city: c.city,
    state: c.state,
    zip_code: c.zipCode,
    delivery_method: c.deliveryMethod,
    event_address: formatEventAddress(c),
    event_address_same_as_home: c.eventAddressSameAsHome,
    booking_date_mode: c.bookingDateMode,
    rental_start_date: c.rentalStartDate,
    rental_end_date: c.bookingDateMode === 'range' && c.rentalEndDate ? c.rentalEndDate : null,
    special_instructions: c.specialInstructions,
  };
}

/** "123 Grove St, Newark, NJ 07102" — omits whatever was left blank. */
export function formatHomeAddress(info: Partial<CustomerInfo>): string {
  const cityState = [info.city, info.state].filter(Boolean).join(', ');
  return [info.address, cityState, info.zipCode].filter(Boolean).join(', ');
}

/** Where the items are actually going. Falls back to the home address. */
export function formatEventAddress(info: Partial<CustomerInfo>): string {
  const normalized = normalizeCustomerInfo(info);
  if (normalized.eventAddressSameAsHome || !normalized.eventAddress) {
    return formatHomeAddress(normalized);
  }
  return normalized.eventAddress;
}

/**
 * "Friday, August 14, 2026" rather than "2026-08-14".
 * Parsed as UTC noon so a date-only string cannot slip a day either way.
 */
export function formatLongDate(value: string): string {
  if (!value) return '';
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

/** "Aug 14" — the compact form, for tables. */
export function formatShortDate(value: string): string {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** What to call the date row: one date, or a timeframe. */
export function bookingDateLabel(info: Partial<CustomerInfo>): string {
  return normalizeCustomerInfo(info).bookingDateMode === 'range'
    ? 'Rental timeframe'
    : 'Event date';
}

/** "Friday, August 14, 2026" or "August 14 – August 17, 2026". */
export function formatBookingDates(info: Partial<CustomerInfo>): string {
  const { bookingDateMode, rentalStartDate, rentalEndDate } = normalizeCustomerInfo(info);

  if (bookingDateMode === 'range' && rentalEndDate) {
    return `${formatLongDate(rentalStartDate)} – ${formatLongDate(rentalEndDate)}`;
  }

  return formatLongDate(rentalStartDate);
}
