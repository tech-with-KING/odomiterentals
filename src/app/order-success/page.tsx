'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, FileText, Home, Mail, MessageCircle, ShoppingBag } from 'lucide-react';
import {
  RENTAL_POLICY_PATH,
  SECURITY_DEPOSIT,
  SECURITY_DEPOSIT_LABEL,
  SECURITY_DEPOSIT_NOTE,
} from '@/lib/pricing';
import {
  DELIVERY_METHOD_LABEL,
  bookingDateLabel,
  formatBookingDates,
  formatEventAddress,
  formatHomeAddress,
  normalizeCustomerInfo,
  type CustomerInfo,
} from '@/lib/booking';

interface LastOrder {
  orderId: string | null;
  emailSent: boolean;
  /** Absent for a booking placed before the confirmation page echoed details. */
  customerInfo?: Partial<CustomerInfo>;
}

export default function OrderSuccessPage() {
  const [revealed, setRevealed] = useState(false);
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 200);

    try {
      const stored = sessionStorage.getItem('odomite:last-order');
      if (stored) setOrder(JSON.parse(stored) as LastOrder);
    } catch {
      // A missing or malformed record just means we show the generic copy.
    }

    return () => window.clearTimeout(timer);
  }, []);

  const booking = order?.customerInfo ? normalizeCustomerInfo(order.customerInfo) : null;
  const isDelivery = booking?.deliveryMethod !== 'pickup';

  const steps = [
    {
      title: 'We confirm availability',
      body: "We'll contact you to check everything on your list is free for your date.",
    },
    isDelivery
      ? {
          title: 'We agree delivery',
          body: 'Delivery is quoted on that call, based on where and when you need it.',
        }
      : {
          title: 'We confirm your pickup time',
          body: 'Pickups begin after 5:00 PM the day before your event, subject to inventory.',
        },
    {
      title: `A $${SECURITY_DEPOSIT} ${SECURITY_DEPOSIT_LABEL.toLowerCase()} secures it`,
      body: 'Arranged when we speak. Nothing was charged online.',
    },
  ];

  // Only shown when we actually have the booking to echo back.
  const details: Array<[string, string]> = (booking
    ? ([
        ['Delivery method', DELIVERY_METHOD_LABEL[booking.deliveryMethod]],
        [bookingDateLabel(booking), formatBookingDates(booking)],
        ['Your address', formatHomeAddress(booking)],
        ...(isDelivery
          ? ([['Event address', formatEventAddress(booking)]] as Array<[string, string]>)
          : []),
        ['Phone', booking.phone],
        ...(booking.alternatePhone
          ? ([['Alternate phone', booking.alternatePhone]] as Array<[string, string]>)
          : []),
      ] as Array<[string, string]>)
    : []
  ).filter(([, value]) => Boolean(value));

  return (
    <div className="bg-[color:var(--background)] py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6">
        <div className="text-center">
          <div
            className="mx-auto grid h-20 w-20 place-items-center rounded-full transition-all duration-700"
            style={{
              backgroundColor: 'var(--brand-soft)',
              transform: revealed ? 'scale(1)' : 'scale(0.6)',
              opacity: revealed ? 1 : 0,
            }}
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--sage)]">
              <Check className="h-6 w-6 text-white" strokeWidth={3} />
            </span>
          </div>

          <div className="eyebrow mt-6">Order received</div>
          <h1 className="mt-3 font-serif text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
            Thank you — your request is in.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--muted-ink)]">
            We typically respond within 1–2 hours during business hours.
          </p>

          {order?.orderId ? (
            <div className="mt-6 inline-flex flex-col items-center rounded-xl border border-[color:var(--hairline)] bg-[color:var(--surface)] px-6 py-4">
              <span className="text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted-ink)]">
                Your reference
              </span>
              <span className="spec mt-1 text-lg font-semibold tabular-nums">
                #{order.orderId.slice(0, 8).toUpperCase()}
              </span>
            </div>
          ) : null}
        </div>

        {details.length > 0 ? (
          <div className="mt-10 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8">
            <h2 className="font-serif text-xl">Your booking</h2>
            <dl className="mt-5 divide-y divide-[color:var(--hairline)] text-sm">
              {details.map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                  <dt className="shrink-0 text-[color:var(--muted-ink)] sm:w-44">{label}</dt>
                  <dd className="text-[color:var(--ink)]">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-xl border border-[color:var(--brand)]/30 bg-[color:var(--brand-soft)] p-5">
              <p className="text-sm font-semibold text-[color:var(--ink)]">
                ${SECURITY_DEPOSIT} {SECURITY_DEPOSIT_LABEL}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-ink)]">
                {SECURITY_DEPOSIT_NOTE}
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-10 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8">
          <h2 className="font-serif text-xl">What happens next?</h2>

          <ol className="mt-6 space-y-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[color:var(--brand)] font-serif text-sm text-[color:var(--brand)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-serif text-base text-[color:var(--ink)]">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted-ink)]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid grid-cols-1 gap-4 rounded-xl bg-[color:var(--background)] p-5 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 shrink-0 text-[color:var(--brand)]" />
              <div>
                <p className="text-sm font-medium text-[color:var(--ink)]">We&apos;ll contact you</p>
                <p className="text-sm text-[color:var(--muted-ink)]">Usually within a couple of hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-[color:var(--brand)]" />
              <div>
                <p className="text-sm font-medium text-[color:var(--ink)]">
                  {order?.emailSent ? 'Confirmation sent' : 'Keep your reference'}
                </p>
                <p className="text-sm text-[color:var(--muted-ink)]">
                  {order?.emailSent ? 'Check your inbox' : 'Quote it when we speak'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[color:var(--hairline)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          <Link
            href={RENTAL_POLICY_PATH}
            className="mt-5 inline-flex items-center gap-2 text-sm text-[color:var(--brand-deep)] hover:underline"
          >
            <FileText className="h-4 w-4" />
            Read the Rental Policy
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-[color:var(--muted-ink)]">
          Questions in the meantime? Call{' '}
          <a href="tel:+18622306639" className="text-[color:var(--brand)] hover:underline">
            +1 (862) 230-6639
          </a>
          .
        </p>
      </div>
    </div>
  );
}
