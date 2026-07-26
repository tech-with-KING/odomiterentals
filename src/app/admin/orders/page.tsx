'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Mail, MessageCircle, Receipt, X } from 'lucide-react';
import { OrderService, type Order } from '@/lib/orderService';
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
import {
  ORDER_STATUSES,
  ORDER_STATUS_TONE,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_TONE,
  labelStatus,
} from '@/lib/order-status';
import { COMMITMENT_FEE, DELIVERY_NOTE } from '@/lib/pricing';

const selectClass =
  'rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] px-2.5 py-1.5 text-xs capitalize outline-none transition-colors focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20';

function whatsAppLink(order: Order) {
  const message = `Hi ${order.customerInfo.firstName}, this is Odomite Rentals about order #${order.id?.slice(-6)}.`;
  const phone = order.customerInfo.phone.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | Order['status']>('all');

  const orderService = OrderService.getInstance();

  const loadOrders = async () => {
    try {
      setOrders(await orderService.getAllOrders());
      setError(null);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Could not load orders. Refresh to try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o) => o.status === 'pending').length;
    const active = orders.filter((o) =>
      ['confirmed', 'in-progress', 'delivered'].includes(o.status)
    ).length;
    const revenue = orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.pricing.total, 0);
    return { total, pending, active, revenue };
  }, [orders]);

  const visible = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const updateStatus = async (orderId: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await orderService.updateOrderStatus(orderId, status);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('That status change did not save. Refresh and try again.');
      loadOrders();
    }
  };

  const updatePayment = async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o)));
    try {
      await orderService.updatePaymentStatus(orderId, paymentStatus);
    } catch (err) {
      console.error('Error updating payment status:', err);
      setError('That payment change did not save. Refresh and try again.');
      loadOrders();
    }
  };

  if (loading) return <AdminSpinner label="Loading orders…" />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orders"
        title="Bookings and deliveries"
        description="Every order from the site. Change a status here and the customer record updates immediately."
      />

      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBlock label="All orders" value={String(stats.total)} />
        <StatBlock
          label="Awaiting confirmation"
          value={String(stats.pending)}
          tone={stats.pending > 0 ? 'attention' : 'neutral'}
        />
        <StatBlock label="In flight" value={String(stats.active)} hint="Confirmed through delivered" />
        <StatBlock label="Revenue collected" value={formatMoney(stats.revenue)} tone="good" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(['all', ...ORDER_STATUSES] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
              filter === value
                ? 'bg-[color:var(--ink)] text-white'
                : 'border border-[color:var(--hairline)] text-[color:var(--muted-ink)] hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]'
            }`}
          >
            {value === 'all' ? 'All' : labelStatus(value)}
          </button>
        ))}
      </div>

      <Panel title={`${visible.length} orders`} bodyClassName="p-0">
        {visible.length === 0 ? (
          <EmptyState
            icon={<Receipt className="h-5 w-5" />}
            title={orders.length === 0 ? 'No orders yet' : 'Nothing with that status'}
            description={
              orders.length === 0
                ? 'When someone books through the site, their order lands here.'
                : 'Pick a different status to see more.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-[color:var(--hairline)] text-left text-[11px] uppercase tracking-[0.12em] text-[color:var(--muted-ink)]">
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Starts</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Payment</th>
                  <th className="px-5 py-3 text-right font-medium">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--hairline)]">
                {visible.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[color:var(--muted)]">
                    <td className="px-5 py-3">
                      <button
                        type="button"
                        onClick={() => setSelected(order)}
                        className="spec text-xs tabular-nums text-[color:var(--brand-deep)] hover:underline"
                      >
                        #{order.id?.slice(-6)}
                      </button>
                      <div className="spec mt-0.5 text-[11px] tabular-nums text-[color:var(--muted-ink)]">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      <div className="font-medium">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </div>
                      <div className="truncate text-xs text-[color:var(--muted-ink)]">
                        {order.customerInfo.email}
                      </div>
                    </td>

                    <td className="spec px-5 py-3 text-xs tabular-nums text-[color:var(--muted-ink)]">
                      {new Date(order.customerInfo.rentalStartDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      <div className="mt-0.5">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </div>
                    </td>

                    <td className="spec px-5 py-3 text-right font-semibold tabular-nums">
                      {formatMoney(order.pricing.total)}
                    </td>

                    <td className="px-5 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id!, e.target.value as Order['status'])}
                        aria-label={`Order status for #${order.id?.slice(-6)}`}
                        className={selectClass}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {labelStatus(status)}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-3">
                      <select
                        value={order.paymentStatus}
                        onChange={(e) =>
                          updatePayment(order.id!, e.target.value as Order['paymentStatus'])
                        }
                        aria-label={`Payment status for #${order.id?.slice(-6)}`}
                        className={selectClass}
                      >
                        {PAYMENT_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={whatsAppLink(order)}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Message on WhatsApp"
                          className="grid h-8 w-8 place-items-center rounded-full text-[color:var(--muted-ink)] transition-colors hover:bg-[color:var(--surface)] hover:text-[color:var(--sage)]"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </a>
                        <a
                          href={`mailto:${order.customerInfo.email}`}
                          aria-label="Send an email"
                          className="grid h-8 w-8 place-items-center rounded-full text-[color:var(--muted-ink)] transition-colors hover:bg-[color:var(--surface)] hover:text-[color:var(--brand-deep)]"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {selected ? <OrderDetail order={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  );
}

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const { customerInfo: customer, pricing } = order;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[color:var(--ink)]/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${order.id?.slice(-6)}`}
        className="relative max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-[color:var(--surface)] sm:max-w-3xl sm:rounded-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between gap-4 border-b border-[color:var(--hairline)] bg-[color:var(--surface)] px-6 py-4">
          <div>
            <div className="eyebrow">Order</div>
            <h2 className="spec mt-0.5 font-serif text-xl tabular-nums">#{order.id?.slice(-6)}</h2>
          </div>
          <div className="flex items-center gap-2">
            <StatusPill tone={ORDER_STATUS_TONE[order.status]}>{labelStatus(order.status)}</StatusPill>
            <StatusPill tone={PAYMENT_STATUS_TONE[order.paymentStatus]}>
              {order.paymentStatus}
            </StatusPill>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close order details"
              className="grid h-8 w-8 place-items-center rounded-full text-[color:var(--muted-ink)] transition-colors hover:bg-[color:var(--muted)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-ink)]">
                Customer
              </h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div>
                  {customer.firstName} {customer.lastName}
                </div>
                <div className="text-[color:var(--muted-ink)]">{customer.email}</div>
                <div className="spec tabular-nums text-[color:var(--muted-ink)]">{customer.phone}</div>
              </dl>
            </div>

            <div>
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-ink)]">
                Delivery
              </h3>
              <div className="mt-3 space-y-1.5 text-sm text-[color:var(--muted-ink)]">
                <div>{customer.address}</div>
                <div>
                  {customer.city}
                  {customer.state ? `, ${customer.state}` : ''} {customer.zipCode}
                </div>
                <div className="spec tabular-nums text-[color:var(--ink)]">
                  Starts {new Date(customer.rentalStartDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {customer.specialInstructions ? (
            <div>
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-ink)]">
                Special instructions
              </h3>
              <p className="mt-2 rounded-lg bg-[color:var(--muted)] px-4 py-3 text-sm">
                {customer.specialInstructions}
              </p>
            </div>
          ) : null}

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.14em] text-[color:var(--muted-ink)]">
              Items
            </h3>
            <ul className="mt-3 divide-y divide-[color:var(--hairline)] rounded-lg border border-[color:var(--hairline)]">
              {order.items.map((item, index) => (
                <li key={`${item.id}-${index}`} className="flex items-center gap-3 p-3">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-[color:var(--muted)]">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="48px" className="object-cover" unoptimized />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.name}</span>
                    <span className="spec block text-xs tabular-nums text-[color:var(--muted-ink)]">
                      {item.quantity} × {item.duration} {item.duration === 1 ? 'day' : 'days'} @{' '}
                      {formatMoney(item.unitPrice)}
                    </span>
                  </span>
                  <span className="spec shrink-0 text-sm font-semibold tabular-nums">
                    {formatMoney(item.total)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <dl className="ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--muted-ink)]">Rental items</dt>
              <dd className="spec tabular-nums">{formatMoney(pricing.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[color:var(--muted-ink)]">Delivery</dt>
              <dd className="text-right text-xs text-[color:var(--muted-ink)]">
                {pricing.shipping > 0 ? formatMoney(pricing.shipping) : DELIVERY_NOTE}
              </dd>
            </div>
            {/* Legacy orders placed before tax was dropped still carry a value. */}
            {pricing.taxes > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-[color:var(--muted-ink)]">Taxes and fees</dt>
                <dd className="spec tabular-nums">{formatMoney(pricing.taxes)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4 border-t border-[color:var(--hairline)] pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd className="spec tabular-nums">{formatMoney(pricing.total)}</dd>
            </div>
            <div className="flex justify-between gap-4 pt-1 text-xs text-[color:var(--brand-deep)]">
              <dt>Commitment fee to collect</dt>
              <dd className="spec tabular-nums">{formatMoney(COMMITMENT_FEE)}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2 border-t border-[color:var(--hairline)] pt-5">
            <a
              href={whatsAppLink(order)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-4 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--sage)] hover:text-[color:var(--sage)]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={`mailto:${customer.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--hairline)] px-4 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
