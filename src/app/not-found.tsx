'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';

const LINKS = [
  { label: 'Catalogue', href: '/shop' },
  { label: 'Get a Quote', href: '/quote' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function NotFoundPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(20);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [router]);

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push('/shop');
  };

  return (
    <div className="bg-[color:var(--background)] py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <div className="eyebrow">Error 404</div>
        <h1 className="mt-3 font-serif text-[clamp(2rem,5vw,3rem)] leading-tight">
          We couldn&apos;t find that page.
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--muted-ink)]">
          The link may be out of date, or the item may no longer be in our catalogue. Taking you
          home in <span className="font-medium text-[color:var(--ink)]">{countdown}</span> seconds.
        </p>

        <form onSubmit={handleSearch} className="mx-auto mt-9 flex max-w-md gap-2">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-ink)]"
            />
            <label htmlFor="notfound-search" className="sr-only">
              Search the catalogue
            </label>
            <input
              id="notfound-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chairs, tents…"
              className="w-full rounded-full border border-[color:var(--hairline)] bg-[color:var(--surface)] py-3 pl-11 pr-4 text-sm text-[color:var(--ink)] placeholder:text-[color:var(--muted-ink)] focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
          >
            Browse
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-full bg-[color:var(--brand)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
          >
            Return home
          </Link>
        </div>

        <nav className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 border-t border-[color:var(--hairline)] pt-8 text-sm text-[color:var(--muted-ink)]">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[color:var(--brand)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
