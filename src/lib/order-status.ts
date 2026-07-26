import type { Order } from '@/lib/orderService';
import type { PillTone } from '@/components/admin/ui';

/** One mapping so a status is the same colour everywhere it appears. */
export const ORDER_STATUS_TONE: Record<Order['status'], PillTone> = {
  pending: 'warn',
  confirmed: 'info',
  'in-progress': 'info',
  delivered: 'good',
  completed: 'good',
  cancelled: 'bad',
};

export const PAYMENT_STATUS_TONE: Record<Order['paymentStatus'], PillTone> = {
  pending: 'warn',
  paid: 'good',
  refunded: 'bad',
};

export const ORDER_STATUSES: Order['status'][] = [
  'pending',
  'confirmed',
  'in-progress',
  'delivered',
  'completed',
  'cancelled',
];

export const PAYMENT_STATUSES: Order['paymentStatus'][] = ['pending', 'paid', 'refunded'];

export function labelStatus(status: string) {
  return status.replace('-', ' ');
}
