'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Minus, Package, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BookNowPopupProps {
  product: {
    id: string | number;
    images: string[];
    name: string;
    /** Effective price — already discounted where a sale is running. */
    price: number | string;
    /** Undiscounted price, passed only when the product is on sale. */
    listPrice?: number;
    desc: string;
    categories?: string[];
  };
  trigger?: React.ReactNode;
}

function Stepper({
  id,
  label,
  icon,
  value,
  onChange,
  suffix,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: number;
  onChange: (next: number) => void;
  suffix?: string;
}) {
  return (
    <div className="space-y-3">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-sm font-medium text-[color:var(--ink)]"
      >
        {icon}
        {label}
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => onChange(value - 1)}
          disabled={value <= 1}
          className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--hairline)] text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          id={id}
          type="number"
          min={1}
          value={value}
          onChange={(e) => onChange(Math.max(1, parseInt(e.target.value, 10) || 1))}
          className="h-9 w-20 rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] text-center text-sm text-[color:var(--ink)] focus:border-[color:var(--brand)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand)]/30"
        />
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => onChange(value + 1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--hairline)] text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
        >
          <Plus className="h-4 w-4" />
        </button>
        {suffix ? <span className="text-sm text-[color:var(--muted-ink)]">{suffix}</span> : null}
      </div>
    </div>
  );
}

export const BookNowPopup = ({ product, trigger }: BookNowPopupProps) => {
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(1);

  const unitPrice = Number(product.price) || 0;
  const onSale = typeof product.listPrice === 'number' && product.listPrice > unitPrice;
  const totalPrice = unitPrice * quantity * duration;
  const image = product.images?.[0];

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        images: image ? [image] : [],
        categories: product.categories ?? ['General'],
      },
      quantity,
      duration
    );

    setOpen(false);
    setQuantity(1);
    setDuration(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="rounded-full bg-[color:var(--brand)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
          >
            Book Now
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="rounded-2xl border-[color:var(--hairline)] bg-[color:var(--surface)] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Add to your booking</DialogTitle>
          <DialogDescription className="text-[color:var(--muted-ink)]">
            Choose quantity and rental duration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-xl border border-[color:var(--hairline)] bg-[color:var(--background)] p-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#f5f0e6]">
              {image ? (
                <Image src={image} alt={product.name} fill sizes="80px" className="object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-[color:var(--muted-ink)]">
                  <ShoppingBag size={20} aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-sans text-base font-semibold text-[color:var(--ink)]">
                {product.name}
              </h3>
              <p className="text-sm text-[color:var(--brand)]">
                ${unitPrice.toFixed(2)}
                {onSale ? (
                  <span className="ml-1.5 text-[color:var(--muted-ink)]">
                    <span className="sr-only">Was </span>
                    <s className="decoration-[color:var(--muted-ink)]/60">
                      ${product.listPrice!.toFixed(2)}
                    </s>
                  </span>
                ) : null}
                <span className="text-[color:var(--muted-ink)]"> per unit / day</span>
              </p>
              {product.desc ? (
                <p className="mt-1 line-clamp-2 text-sm text-[color:var(--muted-ink)]">
                  {product.desc}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Stepper
              id="quantity"
              label="Quantity"
              icon={<Package className="h-4 w-4 text-[color:var(--brand)]" />}
              value={quantity}
              onChange={(next) => setQuantity(Math.max(1, next))}
            />
            <Stepper
              id="duration"
              label="Duration"
              icon={<Calendar className="h-4 w-4 text-[color:var(--brand)]" />}
              value={duration}
              onChange={(next) => setDuration(Math.max(1, next))}
              suffix={duration === 1 ? 'day' : 'days'}
            />
          </div>

          <div className="rounded-xl border border-[color:var(--hairline)] bg-[color:var(--background)] p-4">
            <dl className="space-y-2 text-sm text-[color:var(--muted-ink)]">
              <div className="flex items-center justify-between">
                <dt>Price per unit / day</dt>
                <dd>${unitPrice.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Quantity</dt>
                <dd>{quantity}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Duration</dt>
                <dd>
                  {duration} {duration === 1 ? 'day' : 'days'}
                </dd>
              </div>
            </dl>

            <div className="mt-3 border-t border-[color:var(--hairline)] pt-3">
              <div className="flex items-baseline justify-between">
                <span className="text-base font-semibold text-[color:var(--ink)]">Total</span>
                <span className="font-serif text-xl font-semibold text-[color:var(--brand)]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-xs text-[color:var(--muted-ink)]">
                {quantity} × {duration} {duration === 1 ? 'day' : 'days'} × $
                {unitPrice.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-[color:var(--hairline)] px-4 py-2.5 text-sm font-medium text-[color:var(--ink)] transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[color:var(--brand)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)]"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Booking
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookNowPopup;
