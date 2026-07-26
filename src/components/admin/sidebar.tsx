'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ADMIN_NAV, activeNavItem } from '@/components/admin/nav';

/**
 * Back-of-house navigation.
 *
 * The public site is warm paper; the admin inverts it — a dark ink rail so it
 * is never mistaken for a customer-facing page. Desktop gets a fixed rail,
 * mobile gets a bottom tab bar (four destinations fit, so there is no drawer
 * to open and nothing hidden behind a hamburger).
 */
export function AdminSidebar() {
  const pathname = usePathname();
  const active = activeNavItem(pathname);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[color:var(--ink)] lg:flex">
        <div className="px-6 py-7">
          <Link href="/admin" className="block">
            <span className="font-serif text-xl text-white">Odomite</span>
            <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-[color:var(--brand)]">
              Back of house
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const isActive = active?.href === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                      isActive
                        ? 'bg-white/[0.07] font-medium text-white'
                        : 'text-white/55 hover:bg-white/[0.04] hover:text-white/90'
                    )}
                  >
                    {isActive ? (
                      <span
                        className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-[color:var(--brand)]"
                        aria-hidden="true"
                      />
                    ) : null}
                    <item.icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/admin/inventory/add_product"
            className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-[color:var(--brand)] px-3 py-2.5 text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--brand-soft)]"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </nav>

        <div className="px-3 pb-5">
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-white/45 transition-colors hover:text-white/80"
          >
            View live site
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* Mobile tab bar. pb-safe keeps it clear of the iOS home indicator. */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[color:var(--ink)] pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className="grid grid-cols-4">
          {ADMIN_NAV.map((item) => {
            const isActive = active?.href === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                    isActive ? 'text-[color:var(--brand)]' : 'text-white/50'
                  )}
                >
                  <item.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  {item.short}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
