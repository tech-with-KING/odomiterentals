'use client';

import Link from 'next/link';
import { LayoutDashboard, LogOut, ShoppingBag, User as UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth';
import { useAdminCheck } from '@/context/admin';

export function UserAvatar({
  className = 'h-9 w-9',
  textClassName = 'text-xs',
}: {
  className?: string;
  textClassName?: string;
}) {
  const { profile } = useAuth();

  if (profile?.avatarUrl) {
    return (
      // Supabase avatars come from arbitrary OAuth CDNs, so this stays a plain
      // <img> rather than next/image with a remote-pattern allowlist.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatarUrl}
        alt=""
        referrerPolicy="no-referrer"
        className={`${className} shrink-0 rounded-full object-cover ring-1 ring-[color:var(--hairline)]`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${className} ${textClassName} grid shrink-0 place-items-center rounded-full bg-[color:var(--brand)] font-semibold tracking-wide text-white`}
    >
      {profile?.initials || <UserIcon size={15} />}
    </span>
  );
}

export function UserMenu({ avatarClassName = 'h-9 w-9' }: { avatarClassName?: string }) {
  const { profile, signOut } = useAuth();
  const { isAdmin, adminDetails } = useAdminCheck();

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2"
          aria-label={`Account menu for ${profile.name}`}
        >
          <UserAvatar className={avatarClassName} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-0">
        <div className="flex items-start gap-3 px-3 py-3">
          <UserAvatar className="h-10 w-10" textClassName="text-sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[color:var(--ink)]">
              {adminDetails?.name || profile.name}
            </p>
            <p className="truncate text-xs text-[color:var(--muted-ink)]">{profile.email}</p>
            {isAdmin ? (
              <span className="mt-1.5 inline-flex items-center rounded-full bg-[color:var(--brand-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[color:var(--brand-deep)]">
                {adminDetails?.privilege === 'dev' ? 'Developer' : 'Admin'}
              </span>
            ) : null}
          </div>
        </div>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1">
          {isAdmin ? (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <LayoutDashboard />
                Admin dashboard
              </Link>
            </DropdownMenuItem>
          ) : null}

          <DropdownMenuItem asChild>
            <Link href="/shop">
              <ShoppingBag />
              Browse catalogue
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1">
          <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
