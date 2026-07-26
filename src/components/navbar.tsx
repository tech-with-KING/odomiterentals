'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LogOut, MenuIcon, Search, Shield, ShoppingBag } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { AuthDialog } from '@/components/ui/auth-dialog';
import { UserAvatar, UserMenu } from '@/components/ui/user-menu';
import { useAuth } from '@/context/auth';
import { useAdminCheck } from '@/context/admin';
import { useCart } from '@/context/cart';
import { fetchCategories } from '@/lib/catalogue';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Catalogue', href: '/shop' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

type Category = { id: string; name: string; slug: string };

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories()
      .then((rows) => setCategories(rows.map(({ id, name, slug }) => ({ id, name, slug }))))
      .catch((error) => console.error('Error loading categories:', error));
  }, []);

  return categories;
}

function MobileNav({ onWhite }: { onWhite: boolean }) {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { profile, isSignedIn, isLoaded, signOut } = useAuth();
  const { isAdmin, adminDetails } = useAdminCheck();
  const categories = useCategories();

  const close = () => {
    setOpen(false);
    setCategoriesOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className={`grid h-10 w-10 place-items-center rounded-full transition-colors md:hidden ${
            onWhite ? 'text-[color:var(--ink)] hover:bg-[color:var(--muted)]' : 'text-white hover:bg-white/10'
          }`}
        >
          <MenuIcon size={20} />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="flex w-[320px] flex-col bg-[color:var(--surface)]">
        <SheetHeader className="text-left">
          <SheetTitle className="font-serif text-xl">Menu</SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-1 flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={close}
              className="rounded-lg px-3 py-3 text-base font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--brand-soft)]"
            >
              {link.name}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setCategoriesOpen((v) => !v)}
            aria-expanded={categoriesOpen}
            className="flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--brand-soft)]"
          >
            Categories
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-90' : ''}`}
            />
          </button>

          {categoriesOpen ? (
            <div className="ml-3 space-y-1 border-l-2 border-[color:var(--hairline)] pl-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop/cartegory/${category.slug}`}
                  onClick={close}
                  className="block rounded-md px-3 py-2 text-sm text-[color:var(--muted-ink)] transition-colors hover:text-[color:var(--brand)]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          ) : null}

          <Link
            href="/quote"
            onClick={close}
            className="mt-6 rounded-full bg-[color:var(--brand)] px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
          >
            Get a Quote
          </Link>
        </nav>

        <div className="mt-auto border-t border-[color:var(--hairline)] pt-4">
          {!isLoaded ? (
            <div className="h-[76px] animate-pulse rounded-lg bg-[color:var(--muted)]" />
          ) : isSignedIn ? (
            <div className="space-y-3">
              {isAdmin ? (
                <Link
                  href="/admin"
                  onClick={close}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-[color:var(--brand)] transition-colors hover:bg-[color:var(--brand-soft)]"
                >
                  <Shield size={16} />
                  Admin Dashboard
                </Link>
              ) : null}
              <div className="flex items-center gap-3 rounded-lg bg-[color:var(--muted)] p-3">
                <UserAvatar className="h-10 w-10" textClassName="text-sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{adminDetails?.name || profile?.name}</p>
                  <p className="truncate text-xs text-[color:var(--muted-ink)]">{profile?.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  close();
                  signOut();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-[color:var(--destructive)] transition-colors hover:bg-[color:var(--muted)]"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-3 px-1">
              <p className="text-sm text-[color:var(--muted-ink)]">
                Sign in to track your orders.
              </p>
              <AuthDialog
                trigger={
                  <button
                    type="button"
                    className="w-full rounded-full border border-[color:var(--brand)] px-4 py-2.5 text-sm font-medium text-[color:var(--brand)] transition-colors hover:bg-[color:var(--brand)] hover:text-white"
                  >
                    Sign In
                  </button>
                }
              />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdmin } = useAdminCheck();

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Admin runs its own chrome.
  if (pathname?.startsWith('/admin')) return null;

  // Transparent white-on-image only where there is a hero behind it.
  const overHero = isHome && !scrolled;
  const onWhite = !overHero;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          overHero
            ? 'bg-transparent'
            : 'border-b border-[color:var(--hairline)] bg-[color:var(--surface)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--surface)]/85'
        }`}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span
              className={`font-serif text-2xl font-semibold tracking-tight ${
                onWhite ? 'text-[color:var(--ink)]' : 'text-white'
              }`}
            >
              Odomite
            </span>
            <span
              className={`hidden text-xs uppercase tracking-[0.2em] sm:inline ${
                onWhite ? 'text-[color:var(--muted-ink)]' : 'text-white/70'
              }`}
            >
              Rentals
            </span>
          </Link>

          <nav
            className={`hidden items-center gap-8 text-sm md:flex ${
              onWhite ? 'text-[color:var(--ink)]' : 'text-white/90'
            }`}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition-colors hover:text-[color:var(--brand)]"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              aria-label="Search the catalogue"
              className={`hidden h-10 w-10 place-items-center rounded-full transition-colors sm:grid ${
                onWhite
                  ? 'text-[color:var(--ink)] hover:bg-[color:var(--muted)]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Search size={18} />
            </Link>

            <Link
              href="/cart"
              aria-label={`Open cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
              className={`relative grid h-10 w-10 place-items-center rounded-full transition-colors ${
                onWhite
                  ? 'text-[color:var(--ink)] hover:bg-[color:var(--muted)]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag size={18} />
              {cartCount > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-[color:var(--brand)] text-[11px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {isSignedIn && isAdmin ? (
              <Link
                href="/admin"
                aria-label="Admin dashboard"
                className={`hidden h-10 w-10 place-items-center rounded-full transition-colors md:grid ${
                  onWhite
                    ? 'text-[color:var(--brand)] hover:bg-[color:var(--muted)]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Shield size={18} />
              </Link>
            ) : null}

            {/* Held at a fixed width so resolving the session doesn't shift the row. */}
            <div className="hidden min-w-[86px] justify-end md:flex">
              {!isLoaded ? (
                <span
                  className={`h-9 w-9 animate-pulse rounded-full ${
                    onWhite ? 'bg-[color:var(--muted)]' : 'bg-white/20'
                  }`}
                  aria-hidden="true"
                />
              ) : isSignedIn ? (
                <UserMenu avatarClassName="h-9 w-9" />
              ) : (
                <AuthDialog
                  trigger={
                    <button
                      type="button"
                      className={`rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                        onWhite
                          ? 'text-[color:var(--ink)] hover:text-[color:var(--brand)]'
                          : 'text-white/90 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                  }
                />
              )}
            </div>

            <Link
              href="/quote"
              className="hidden rounded-full bg-[color:var(--brand)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)] md:inline-block"
            >
              Get a Quote
            </Link>

            <MobileNav onWhite={onWhite} />
          </div>
        </div>
      </header>

      {/* Inner pages have no hero to sit under, so reserve the header's height. */}
      {isHome ? null : <div className="h-[72px]" aria-hidden="true" />}
    </>
  );
}
