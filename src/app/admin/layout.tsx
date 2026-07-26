'use client';

import { useEffect } from 'react';
import type React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/auth';
import { useAdminCheck } from '@/context/admin';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';

function AdminGateScreen({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-[color:var(--background)] px-6">
      <div className="max-w-sm text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[color:var(--brand-soft)] text-[color:var(--brand-deep)]">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <h1 className="mt-5 font-serif text-2xl">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-ink)]">{description}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdminCheck();
  const router = useRouter();

  const resolving = !isLoaded || adminLoading;

  useEffect(() => {
    if (resolving) return;
    if (!isSignedIn) {
      router.replace('/');
      return;
    }
    if (!isAdmin) {
      router.replace('/unauthorized');
    }
  }, [resolving, isSignedIn, isAdmin, router]);

  if (resolving) {
    return (
      <div className="grid min-h-screen place-items-center bg-[color:var(--background)]">
        <div className="text-center">
          <span
            className="mx-auto block h-7 w-7 animate-spin rounded-full border-2 border-[color:var(--hairline)] border-t-[color:var(--brand)]"
            aria-hidden="true"
          />
          <p className="mt-4 text-sm text-[color:var(--muted-ink)]">Checking your access…</p>
        </div>
      </div>
    );
  }

  // The effect above is already redirecting; these render for the frame in
  // between so the screen is never blank.
  if (!isSignedIn) {
    return (
      <AdminGateScreen
        title="Sign in to continue"
        description="The admin panel is only available to signed-in staff. Taking you back to the site."
        action={
          <Link
            href="/"
            className="inline-flex rounded-full border border-[color:var(--hairline)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
          >
            Go to the site
          </Link>
        }
      />
    );
  }

  if (!isAdmin) {
    return (
      <AdminGateScreen
        title="Access denied"
        description="This account is not on the admin list. Ask an existing admin to add your email."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] lg:pl-64">
      <AdminSidebar />
      <AdminTopbar />
      <main className="mx-auto max-w-[1200px] px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-16">{children}</main>
    </div>
  );
}
