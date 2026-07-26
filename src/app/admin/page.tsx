'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowRight, CalendarDays, Package, Plus } from 'lucide-react';
import { OrderService, type Order } from '@/lib/orderService';
import { fetchProducts, type CatalogueProduct } from '@/lib/catalogue';
import { useAdminCheck } from '@/context/admin';
import { useAuth } from '@/context/auth';
import {
  AdminSpinner,
  EmptyState,
  ErrorNote,
  PageHeader,
  Panel,
  StatBlock,
  StatusPill,
  formatMoney,
} from '@/components/admin/ui';
import { ORDER_STATUS_TONE } from '@/lib/order-status';

const DAY = 24 * 60 * 60 * 1000;
const LOW_STOCK_THRESHOLD = 10;

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

interface CategoryLedgerRow {
  name: string;
  units: number;
  products: number;
  outOfStock: number;
  lowStock: number;
}

export default function AdminDashboard() {
  const { adminDetails } = useAdminCheck();
  const { profile } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([OrderService.getInstance().getAllOrders(), fetchProducts()])
      .then(([orderData, productData]) => {
        if (!active) return;
        setOrders(orderData);
        setProducts(productData);
      })
      .catch((err) => {
        console.error('Error loading dashboard:', err);
        if (active) setError('Could not load your dashboard data. Refresh to try again.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const needsAction = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length;
    const revenue = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.pricing.total, 0);
    const units = products.reduce((sum, p) => sum + (p.unitsleft ?? 0), 0);
    return { needsAction, revenue, units };
  }, [orders, products]);

  const ledger = useMemo<CategoryLedgerRow[]>(() => {
    const rows = new Map<string, CategoryLedgerRow>();

    for (const product of products) {
      const key = product.categoryName || 'Uncategorised';
      const row = rows.get(key) ?? { name: key, units: 0, products: 0, outOfStock: 0, lowStock: 0 };
      const units = product.unitsleft ?? 0;

      row.units += units;
      row.products += 1;
      if (!product.instock || units === 0) row.outOfStock += 1;
      else if (units <= LOW_STOCK_THRESHOLD) row.lowStock += 1;

      rows.set(key, row);
    }

    return [...rows.values()].sort((a, b) => b.units - a.units);
  }, [products]);

  const restock = useMemo(
    () =>
      products
        .filter((p) => !p.instock || (p.unitsleft ?? 0) <= LOW_STOCK_THRESHOLD)
        .sort((a, b) => (a.unitsleft ?? 0) - (b.unitsleft ?? 0))
        .slice(0, 6),
    [products]
  );

  const upcoming = useMemo(() => {
    const now = Date.now();
    return orders
      .filter((order) => {
        if (order.status === 'cancelled' || order.status === 'completed') return false;
        const start = new Date(order.customerInfo.rentalStartDate).getTime();
        return Number.isFinite(start) && start >= now - DAY && start <= now + 7 * DAY;
      })
      .sort(
        (a, b) =>
          new Date(a.customerInfo.rentalStartDate).getTime() -
          new Date(b.customerInfo.rentalStartDate).getTime()
      )
      .slice(0, 5);
  }, [orders]);

  const recent = orders.slice(0, 6);
  const maxUnits = Math.max(1, ...ledger.map((row) => row.units));
  const firstName = (adminDetails?.name || profile?.name || '').split(' ')[0];

  if (loading) return <AdminSpinner label="Loading your dashboard…" />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={greeting()}
        title={firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
        description="Everything the shop is doing today — orders waiting on you, and what is left on the shelf."
        actions={
          <Link
            href="/admin/inventory/add_product"
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-5 py-2.5 text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--brand-deep)] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        }
      />

      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatBlock
          label="Orders to action"
          value={String(stats.needsAction)}
          hint={stats.needsAction === 0 ? 'Nothing waiting on you' : 'Pending or confirmed'}
          tone={stats.needsAction > 0 ? 'attention' : 'neutral'}
        />
        <StatBlock
          label="Revenue collected"
          value={formatMoney(stats.revenue)}
          hint="Orders marked paid"
          tone="good"
        />
        <StatBlock
          label="Units on the shelf"
          value={stats.units.toLocaleString('en-US')}
          hint={`${products.length} products across ${ledger.length} categories`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* The stock ledger: what a rental business actually runs on. */}
        <Panel
          className="lg:col-span-2"
          title="Stock ledger"
          description="Units available by category"
          actions={
            <Link
              href="/admin/inventory"
              className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--brand-deep)] hover:underline"
            >
              Manage inventory
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
          bodyClassName="p-0"
        >
          {ledger.length === 0 ? (
            <EmptyState
              icon={<Package className="h-5 w-5" />}
              title="No products yet"
              description="Add your first rental item and it will show up here and on the live site."
            />
          ) : (
            <ul className="divide-y divide-[color:var(--hairline)]">
              {ledger.map((row) => (
                <li key={row.name} className="px-5 py-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="truncate text-sm font-medium">{row.name}</span>
                    <span className="spec shrink-0 text-sm tabular-nums text-[color:var(--muted-ink)]">
                      {row.units.toLocaleString('en-US')}
                      <span className="ml-1 text-[10px] uppercase tracking-wider">units</span>
                    </span>
                  </div>

                  <div
                    className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[color:var(--muted)]"
                    role="presentation"
                  >
                    <div
                      className="h-full rounded-full bg-[color:var(--brand)] transition-[width] duration-500"
                      style={{ width: `${Math.max(2, (row.units / maxUnits) * 100)}%` }}
                    />
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--muted-ink)]">
                    <span className="spec tabular-nums">
                      {row.products} {row.products === 1 ? 'product' : 'products'}
                    </span>
                    {row.lowStock > 0 ? (
                      <StatusPill tone="warn">{row.lowStock} running low</StatusPill>
                    ) : null}
                    {row.outOfStock > 0 ? (
                      <StatusPill tone="bad">{row.outOfStock} out of stock</StatusPill>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel title="Going out this week" description="Next 7 days" bodyClassName="p-0">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={<CalendarDays className="h-5 w-5" />}
                title="Nothing scheduled"
                description="No active rentals start in the next week."
              />
            ) : (
              <ul className="divide-y divide-[color:var(--hairline)]">
                {upcoming.map((order) => (
                  <li key={order.id} className="px-5 py-3.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-sm font-medium">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </span>
                      <span className="spec shrink-0 text-xs tabular-nums text-[color:var(--muted-ink)]">
                        {new Date(order.customerInfo.rentalStartDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <StatusPill tone={ORDER_STATUS_TONE[order.status]}>
                        {order.status.replace('-', ' ')}
                      </StatusPill>
                      <span className="spec text-[11px] tabular-nums text-[color:var(--muted-ink)]">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Needs restocking" bodyClassName="p-0">
            {restock.length === 0 ? (
              <EmptyState
                icon={<AlertTriangle className="h-5 w-5" />}
                title="Stock looks healthy"
                description={`Nothing is at or below ${LOW_STOCK_THRESHOLD} units.`}
              />
            ) : (
              <ul className="divide-y divide-[color:var(--hairline)]">
                {restock.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`/admin/inventory/edit_product/${product.id}`}
                      className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-[color:var(--muted)]"
                    >
                      <span className="truncate text-sm">{product.name}</span>
                      <span
                        className={`spec shrink-0 text-xs font-semibold tabular-nums ${
                          (product.unitsleft ?? 0) === 0 || !product.instock
                            ? 'text-[color:var(--destructive)]'
                            : 'text-[color:var(--brand-deep)]'
                        }`}
                      >
                        {product.unitsleft ?? 0}
                        <span className="ml-1 font-normal text-[10px] uppercase tracking-wider text-[color:var(--muted-ink)]">
                          left
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      <Panel
        title="Recent orders"
        actions={
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-xs font-medium text-[color:var(--brand-deep)] hover:underline"
          >
            All orders
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
        bodyClassName="p-0"
      >
        {recent.length === 0 ? (
          <EmptyState
            icon={<Package className="h-5 w-5" />}
            title="No orders yet"
            description="New bookings from the site will land here."
          />
        ) : (
          <ul className="divide-y divide-[color:var(--hairline)]">
            {recent.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                  <p className="spec truncate text-[11px] tabular-nums text-[color:var(--muted-ink)]">
                    #{order.id?.slice(-6)} · {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill tone={ORDER_STATUS_TONE[order.status]}>
                    {order.status.replace('-', ' ')}
                  </StatusPill>
                  <span className="spec text-sm font-semibold tabular-nums">
                    {formatMoney(order.pricing.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
