'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import { RENTAL_POLICY_PATH } from '@/lib/pricing';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Rentals', href: '/shop' },
  { label: 'Contact', href: '/contact' },
  { label: 'Rental Policy', href: RENTAL_POLICY_PATH },
];

const SERVICE_AREAS = [
  'Newark, NJ',
  'Elizabeth, NJ',
  'Jersey City, NJ',
  'Paterson, NJ',
  'Greater New Jersey',
];

export default function Footer() {
  const pathname = usePathname();

  // Admin runs its own chrome.
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer id="contact" className="bg-[color:var(--ink)] text-white/80">
      {/* Two columns on phones: Quick Links beside Service Areas, so the
          footer is one screen rather than a long scroll. The brand blurb and
          contact details keep the full width. */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-x-6 gap-y-10 px-6 py-16 md:grid-cols-4 md:gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="font-serif text-2xl text-white">Odomite Rentals</div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            Your trusted event rental for all your party needs. Family-owned, New Jersey based.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
            >
              <Instagram size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/50">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="transition-colors hover:text-[color:var(--brand)]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/50">
            Service Areas
          </h4>
          <ul className="space-y-2 text-sm">
            {SERVICE_AREAS.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-white/50">
            Contact Information
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="mailto:odomitegroupsllc@gmail.com"
                className="inline-flex items-center gap-2 transition-colors hover:text-[color:var(--brand)]"
              >
                <Mail size={15} />
                odomitegroupsllc@gmail.com
              </a>
            </li>
            <li>
              <a
                href="tel:+18622306639"
                className="inline-flex items-center gap-2 transition-colors hover:text-[color:var(--brand)]"
              >
                <Phone size={15} />
                +1 (862) 230-6639
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-white/50 sm:flex-row">
          <span>© {new Date().getFullYear()} OdomiteRentals.com. All rights reserved.</span>
          <span>Handcrafted for events across New Jersey.</span>
        </div>
      </div>
    </footer>
  );
}
