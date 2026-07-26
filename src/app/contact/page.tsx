'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { SectionHeading } from '@/components/site/SectionHeading';
import MapIntegration from '@/components/map-intergration';
import NewsletterSection from '@/components/newsletter';

const HOURS = [
  { days: 'Mon, Tue, Wed, Sat', time: '6:00 AM – 8:30 PM ET' },
  { days: 'Thursday', time: '6:00 AM – 8:00 PM ET' },
  { days: 'Friday', time: '8:00 AM – 9:00 PM ET' },
  { days: 'Sunday', time: '9:00 AM – 8:00 PM ET' },
];

const FAQS = [
  {
    question: 'How soon can I get my rental items delivered?',
    answer:
      'Most orders can be delivered within 24–48 hours, depending on availability and location. We also accommodate same-day or next-day rentals for urgent events.',
  },
  {
    question: 'What items do you rent out?',
    answer:
      'Chairs, tables, tents, canopies, table covers, kids rentals and event equipment. If you need something specific, ask — we are always expanding our inventory.',
  },
  {
    question: 'Do you handle setup and takedown?',
    answer:
      'Yes. Our team offers full setup and takedown for tents, chairs and tables, so you can focus on your event while we handle the logistics.',
  },
  {
    question: 'What if something gets damaged or I need to cancel?',
    answer:
      'Plans change. Cancellations made 48 hours in advance are fully refundable. Minor damages are covered under our rental protection plan.',
  },
];

const RENTAL_TYPES = ['Chairs', 'Tables', 'Tents', 'Table Covers', 'Equipment', 'Kids Rentals', 'Full event setup'];

const inputClass =
  'w-full rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--muted-ink)] focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30';

const labelClass = 'mb-2 block text-sm font-medium text-[color:var(--ink)]';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rentalType: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? 'Something went wrong. Please try again or call us.');
        setStatus('idle');
        return;
      }

      setStatus('done');
      setFormData({ name: '', email: '', phone: '', rentalType: '', subject: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again or call us.');
      setStatus('idle');
    }
  };

  return (
    <div className="bg-[color:var(--background)]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-20">
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch."
          intro="Planning an event? Whether you need chairs, tents or a full setup, we're here to help. Reach out for a quote, to check availability, or just to talk through your day."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="tel:+18622306639"
            className="group rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 transition-all duration-300 hover:border-[color:var(--brand)]/40 hover:shadow-brand"
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-[color:var(--brand-deep)]"
              style={{ backgroundColor: 'var(--brand-soft)' }}
            >
              <Phone className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-serif text-lg">Call us</h3>
            <p className="mt-1 text-sm text-[color:var(--muted-ink)]">
              Fastest way to check availability.
            </p>
            <p className="mt-3 text-sm font-medium text-[color:var(--brand)]">
              +1 (862) 230-6639
            </p>
          </a>

          <a
            href="mailto:odomitegroupsllc@gmail.com"
            className="group rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 transition-all duration-300 hover:border-[color:var(--brand)]/40 hover:shadow-brand"
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-[color:var(--brand-deep)]"
              style={{ backgroundColor: 'var(--brand-soft)' }}
            >
              <Mail className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-serif text-lg">Email us</h3>
            <p className="mt-1 text-sm text-[color:var(--muted-ink)]">
              We typically reply within the hour.
            </p>
            <p className="mt-3 break-all text-sm font-medium text-[color:var(--brand)]">
              odomitegroupsllc@gmail.com
            </p>
          </a>

          <div className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6 sm:col-span-2 lg:col-span-1">
            <span
              className="grid h-11 w-11 place-items-center rounded-full text-[color:var(--brand-deep)]"
              style={{ backgroundColor: 'var(--brand-soft)' }}
            >
              <MapPin className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-serif text-lg">Visit the warehouse</h3>
            <p className="mt-1 text-sm text-[color:var(--muted-ink)]">
              331 Seymour Ave
              <br />
              Newark, NJ 07112
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-serif text-2xl">Send us a message</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Jane Doe"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane@example.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(862) 000-0000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="rentalType" className={labelClass}>
                    What do you need?
                  </label>
                  <select
                    id="rentalType"
                    name="rentalType"
                    value={formData.rentalType}
                    onChange={handleInputChange}
                    className={inputClass}
                  >
                    <option value="">Select an option</option>
                    {RENTAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={labelClass}>
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Backyard graduation party, June 14"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="message" className={labelClass}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us the date, guest count and anything else we should know."
                  className={`${inputClass} resize-y`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex w-full items-center justify-center rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)] disabled:opacity-60 sm:w-auto"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              {status === 'done' ? (
                <p
                  className="rounded-lg px-4 py-3 text-sm font-medium text-[color:var(--brand-deep)]"
                  style={{ backgroundColor: 'var(--brand-soft)' }}
                >
                  Thanks — your message is on its way. We usually reply within the hour during
                  business hours.
                </p>
              ) : null}

              {error ? (
                <p className="text-sm text-[color:var(--destructive)]">{error}</p>
              ) : null}

              <p className="text-xs text-[color:var(--muted-ink)]">
                Prefer to price it up yourself?{' '}
                <Link href="/quote" className="text-[color:var(--brand)] hover:underline">
                  Build a quote online
                </Link>
                .
              </p>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-[color:var(--brand)]" />
                <h3 className="font-serif text-lg">Opening hours</h3>
              </div>
              <dl className="mt-4 space-y-3">
                {HOURS.map((entry) => (
                  <div
                    key={entry.days}
                    className="flex flex-wrap justify-between gap-2 border-b border-[color:var(--hairline)] pb-3 text-sm last:border-0 last:pb-0"
                  >
                    <dt className="text-[color:var(--ink)]">{entry.days}</dt>
                    <dd className="text-[color:var(--muted-ink)]">{entry.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className="rounded-2xl border border-[color:var(--hairline)] p-6"
              style={{ backgroundColor: 'var(--brand-soft)' }}
            >
              <h3 className="font-serif text-lg">Service areas</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">
                We deliver across Newark, Elizabeth, Jersey City, Paterson and greater New Jersey.
                Outside that radius? Ask us — we often make it work.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl border border-[color:var(--hairline)]">
          <MapIntegration />
        </div>

        <section className="mt-16">
          <h2 className="text-center font-serif text-2xl">Frequently asked questions</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-[color:var(--hairline)] bg-[color:var(--surface)] p-6"
              >
                <h3 className="font-serif text-base text-[color:var(--ink)]">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <NewsletterSection />
    </div>
  );
}
