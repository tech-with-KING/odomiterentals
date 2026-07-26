import { LayoutGrid, Package, Receipt, Mail, type LucideIcon } from 'lucide-react';

export interface AdminNavItem {
  name: string;
  /** Short label for the mobile tab bar, where horizontal room is tight. */
  short: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { name: 'Dashboard', short: 'Home', href: '/admin', icon: LayoutGrid },
  { name: 'Inventory', short: 'Stock', href: '/admin/inventory', icon: Package },
  { name: 'Orders', short: 'Orders', href: '/admin/orders', icon: Receipt },
  { name: 'Subscribers', short: 'Emails', href: '/admin/subscriber', icon: Mail },
];

/** Longest matching nav href wins, so /admin never claims /admin/inventory. */
export function activeNavItem(pathname: string | null) {
  if (!pathname) return undefined;
  return [...ADMIN_NAV]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
}
