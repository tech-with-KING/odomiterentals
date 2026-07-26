import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="bg-[color:var(--background)] py-20 md:py-28">
      <div className="mx-auto max-w-md px-6 text-center">
        <div
          className="mx-auto grid h-14 w-14 place-items-center rounded-full text-[color:var(--brand-deep)]"
          style={{ backgroundColor: 'var(--brand-soft)' }}
        >
          <Shield className="h-6 w-6" />
        </div>

        <div className="eyebrow mt-6">Restricted</div>
        <h1 className="mt-3 font-serif text-2xl leading-tight">Access denied.</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--muted-ink)]">
          You need to be signed in as an admin to view this page.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-6 py-3 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}
