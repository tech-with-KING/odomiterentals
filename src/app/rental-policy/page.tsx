import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { RENTAL_POLICY_PATH, SECURITY_DEPOSIT_LABEL, SECURITY_DEPOSIT_NOTE } from '@/lib/pricing';

/**
 * The full rental agreement.
 *
 * This is the document customers accept when they place a deposit, sign, or
 * submit an order, so it is written out in full rather than summarized — every
 * fee that can be charged appears here with the number attached. The page is
 * static: no client state, so it renders and indexes as plain HTML.
 *
 * The section list below is the content. Rendering is derived from it, which
 * keeps the numbering, the contents rail and the headings from ever
 * disagreeing with each other when a clause is added or reworded.
 */

export const metadata = {
  title: 'Rental Policy — Odomite Rentals',
  description:
    'The full Odomite Rentals rental agreement: payment terms, refundable security deposit, damage responsibility, linen care, pickup and return times, delivery requirements and cancellation.',
  alternates: { canonical: RENTAL_POLICY_PATH },
};

interface Fee {
  label: string;
  amount: string;
  detail?: string;
}

interface Section {
  id: string;
  title: string;
  intro?: string;
  paragraphs?: string[];
  bullets?: string[];
  bulletsTitle?: string;
  fees?: { title: string; items: Fee[] };
  note?: string;
}

const SECTIONS: Section[] = [
  {
    id: 'payment-terms',
    title: 'Payment Terms',
    intro: 'What has to be settled before anything leaves our inventory.',
    bullets: [
      'Full payment must be received before any rental items are released.',
      'Delivery services are available for an agreed delivery fee.',
      'Orders under $101 require full payment before confirmation.',
    ],
  },
  {
    id: 'security-deposit',
    title: SECURITY_DEPOSIT_LABEL,
    intro: 'A refundable security deposit is required to reserve inventory.',
    bulletsTitle: 'The deposit',
    bullets: [
      'Secures the reservation.',
      'Confirms acceptance of the rental agreement.',
      'Is refunded after all items have been inspected.',
    ],
    paragraphs: [
      'Refund eligibility requires that all items are returned, returned on time, returned clean, undamaged, and with nothing missing.',
      'Refunds are processed 2–5 business days after inspection.',
    ],
    note: 'Cancellation results in forfeiture of the security deposit.',
  },
  {
    id: 'damage-responsibility',
    title: 'Damage Responsibility',
    intro:
      'Customers are responsible for rented items from the moment of pickup or delivery until they are returned.',
    fees: {
      title: 'Replacement fees',
      items: [
        { label: 'Chair', amount: '$50' },
        { label: 'Table', amount: '$100' },
        { label: 'Tent', amount: '$700' },
      ],
    },
    paragraphs: [
      'Additional damage charges may apply depending on repair costs.',
      'Customers are encouraged to inspect all items upon receipt and report any issues immediately.',
    ],
  },
  {
    id: 'linen-care',
    title: 'Linen Care',
    intro: 'Linen items should be returned dry. Do not wash them.',
    fees: {
      title: 'Cleaning fees',
      items: [
        { label: 'Chair covers', amount: '$1 each', detail: 'Returned unwashed' },
        { label: 'Table covers', amount: '$5 each', detail: 'Returned unwashed' },
      ],
    },
    note: 'Stained or permanently damaged linens will incur replacement costs.',
  },
  {
    id: 'pickup-schedule',
    title: 'Pickup Schedule',
    intro: 'Customer pickups begin after 5:00 PM on the day before the event.',
    paragraphs: [
      'Early pickup is a courtesy only and depends on inventory availability.',
      'Pickup times are not guaranteed until confirmed.',
    ],
  },
  {
    id: 'late-returns',
    title: 'Late Returns',
    intro: 'Rental items must be returned on time.',
    fees: {
      title: 'Late fees',
      items: [
        {
          label: 'Returned after 10:00 AM the day after the event',
          amount: 'Half the rental cost',
        },
        { label: 'Each additional day', amount: 'One full rental charge per day' },
      ],
    },
  },
  {
    id: 'identification',
    title: 'Identification',
    intro: 'A valid government-issued photo ID is required before releasing rental items.',
    paragraphs: ['The name on the invoice may be required to match the presented identification.'],
  },
  {
    id: 'cancellation',
    title: 'Cancellation & Rescheduling',
    intro: 'Cancelling forfeits the security deposit.',
    bulletsTitle: 'Rescheduling',
    bullets: [
      'One reschedule is allowed.',
      'It must occur within one month.',
      'It is subject to inventory availability.',
    ],
  },
  {
    id: 'delivery-pickup',
    title: 'Delivery & Pickup Requirements',
    intro: 'Delivery is available outdoors only, due to insurance requirements.',
    bulletsTitle: 'Customers must provide',
    bullets: ['A clear access path at least 5 feet wide.', 'Ramp access when necessary.'],
    paragraphs: [
      'Arrival policy: drivers wait a maximum of 15 minutes. If no responsible person is available, the delivery team may leave and additional delivery fees may apply.',
      'Pickup policy: no pickups after 8:30 PM. After-hours pickups require prior approval and additional fees.',
    ],
  },
  {
    id: 'setup-services',
    title: 'Setup Services',
    intro: 'Setup is not included unless specifically added to the order.',
    paragraphs: ['Setup services may incur additional charges.'],
  },
  {
    id: 'tent-accessories',
    title: 'Tent Accessories',
    intro: 'Customers are responsible for power.',
    bulletsTitle: 'We do not provide',
    bullets: ['Extension cords', 'Electrical power', 'Tent lighting', 'Tent fans'],
  },
  {
    id: 'invoice-expiration',
    title: 'Invoice Expiration',
    intro:
      'Invoices requiring a refundable security deposit may be cancelled if the deposit is not received within 24 hours.',
    note: 'Inventory is not guaranteed until the deposit has been paid.',
  },
  {
    id: 'order-changes',
    title: 'Order Changes',
    intro: 'Item reductions are not accepted within 10 days of the scheduled event.',
    paragraphs: [
      'Additional items may be requested but remain subject to inventory availability.',
    ],
  },
  {
    id: 'card-processing-fee',
    title: 'Card Processing Fee',
    intro: 'A 3.3% processing fee applies to all non-cash payments.',
    paragraphs: ['Cash payments do not incur this fee.'],
  },
  {
    id: 'verification',
    title: 'Invoice & Identification Verification',
    intro: 'We reserve the right to verify customer identity.',
    bulletsTitle: 'The name on the invoice may be required to match',
    bullets: ['Government-issued ID', 'Payment method', 'Billing information'],
    note: 'Orders may be delayed or cancelled if verification cannot be completed.',
  },
];

export default function RentalPolicyPage() {
  return (
    <div className="bg-[color:var(--background)]">
      <header className="border-b border-[color:var(--hairline)] bg-[color:var(--surface)]">
        <div className="mx-auto max-w-[1280px] px-6 py-14 md:py-20">
          <div className="eyebrow">Rental Agreement</div>
          <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2rem,5vw,3rem)] leading-tight">
            Rental Policy
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[color:var(--muted-ink)]">
            By placing a refundable security deposit, signing a rental agreement, or submitting an
            order, the customer agrees to all terms below.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
            >
              Browse Catalogue
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-full border border-[color:var(--hairline)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
            >
              Ask us a question
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-14 md:py-20 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
        {/* Contents rail — a long agreement is only usable if you can jump. */}
        <nav aria-label="Contents" className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--muted-ink)]">
            Contents
          </h2>
          <ol className="mt-4 space-y-2 text-sm">
            {SECTIONS.map((section, index) => (
              <li key={section.id} className="flex gap-2">
                <span className="spec shrink-0 tabular-nums text-[color:var(--muted-ink)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <a
                  href={`#${section.id}`}
                  className="text-[color:var(--muted-ink)] transition-colors hover:text-[color:var(--brand-deep)]"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0">
          {/* The deposit is the clause customers ask about most, so it leads. */}
          <div className="rounded-2xl border border-[color:var(--brand)]/30 bg-[color:var(--brand-soft)] p-6">
            <h2 className="font-serif text-lg text-[color:var(--ink)]">{SECURITY_DEPOSIT_LABEL}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">
              {SECURITY_DEPOSIT_NOTE}
            </p>
          </div>

          <div className="mt-12 space-y-12">
            {SECTIONS.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-28">
                <div className="flex items-baseline gap-3">
                  <span className="spec shrink-0 text-sm tabular-nums text-[color:var(--brand)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-2xl leading-tight text-[color:var(--ink)]">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-[color:var(--muted-ink)] lg:pl-9">
                  {section.intro ? (
                    <p className="text-[color:var(--ink)]">{section.intro}</p>
                  ) : null}

                  {section.bullets ? (
                    <div>
                      {section.bulletsTitle ? (
                        <p className="mb-2 text-sm font-medium text-[color:var(--ink)]">
                          {section.bulletsTitle}
                        </p>
                      ) : null}
                      <ul className="space-y-2">
                        {section.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand)]"
                              aria-hidden="true"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {section.fees ? (
                    <div className="overflow-hidden rounded-xl border border-[color:var(--hairline)] bg-[color:var(--surface)]">
                      <div className="border-b border-[color:var(--hairline)] px-5 py-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--muted-ink)]">
                        {section.fees.title}
                      </div>
                      <ul className="divide-y divide-[color:var(--hairline)]">
                        {section.fees.items.map((fee) => (
                          <li
                            key={fee.label}
                            className="flex flex-wrap items-baseline justify-between gap-3 px-5 py-3.5"
                          >
                            <span className="text-sm text-[color:var(--ink)]">
                              {fee.label}
                              {fee.detail ? (
                                <span className="block text-xs text-[color:var(--muted-ink)]">
                                  {fee.detail}
                                </span>
                              ) : null}
                            </span>
                            <span className="spec text-sm font-semibold tabular-nums text-[color:var(--ink)]">
                              {fee.amount}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

                  {section.note ? (
                    <p className="flex gap-3 rounded-xl border border-[color:var(--hairline)] bg-[color:var(--surface)] px-5 py-4 text-sm text-[color:var(--ink)]">
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--brand-deep)]"
                        aria-hidden="true"
                      />
                      <span>{section.note}</span>
                    </p>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-8">
            <h2 className="font-serif text-xl">Questions about any of this?</h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">
              We would rather explain a clause before your event than argue about it afterwards.
              Call{' '}
              <a
                href="tel:+18622306639"
                className="text-[color:var(--brand-deep)] hover:underline"
              >
                +1 (862) 230-6639
              </a>{' '}
              or{' '}
              <Link href="/contact" className="text-[color:var(--brand-deep)] hover:underline">
                send us a message
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
