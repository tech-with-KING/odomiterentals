'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/ui/user-menu';
import NotificationSetup from '@/components/admin/NotificationSetup';
import { activeNavItem } from '@/components/admin/nav';
import { useAuth } from '@/context/auth';
import { useAdminCheck } from '@/context/admin';

/**
 * Who is signed in, what they can do, and how to get out — visible on every
 * admin screen so the session is never ambiguous.
 */
export function AdminTopbar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const { adminDetails } = useAdminCheck();

  const section = activeNavItem(pathname);
  const name = adminDetails?.name || profile?.name || 'Admin';
  const privilege = adminDetails?.privilege === 'dev' ? 'Developer' : 'Admin';

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--hairline)] bg-[color:var(--surface)]/90 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--surface)]/75">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="font-serif text-lg lg:hidden">Odomite</span>
          <span className="hidden text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted-ink)] lg:inline">
            Admin
          </span>
          {section ? (
            <>
              <span className="hidden text-[color:var(--hairline)] lg:inline" aria-hidden="true">
                /
              </span>
              <span className="hidden truncate text-sm font-medium lg:inline">{section.name}</span>
            </>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <NotificationSetup userEmail={profile?.email} />

          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-full border border-[color:var(--hairline)] px-3 py-1.5 text-xs font-medium text-[color:var(--muted-ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)] sm:inline-flex"
          >
            Live site
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-1 transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 sm:pr-3"
                aria-label={`Account menu for ${name}`}
              >
                <UserAvatar className="h-8 w-8" />
                <span className="hidden text-left sm:block">
                  <span className="block max-w-[140px] truncate text-xs font-medium leading-tight">
                    {name}
                  </span>
                  <span className="block text-[10px] uppercase tracking-[0.12em] text-[color:var(--brand-deep)]">
                    {privilege}
                  </span>
                </span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 p-0">
              <div className="px-3 py-3">
                <p className="truncate text-sm font-medium">{name}</p>
                <p className="truncate text-xs text-[color:var(--muted-ink)]">{profile?.email}</p>
              </div>
              <DropdownMenuSeparator className="my-0" />
              <div className="p-1">
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <ArrowUpRight />
                    View live site
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
