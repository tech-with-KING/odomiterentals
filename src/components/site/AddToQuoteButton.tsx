'use client';

import { ShoppingBag } from 'lucide-react';
import { BookNowPopup } from '@/components/ui/BookNowPopUp';

interface AddToQuoteButtonProps {
  id: string;
  name: string;
  price: number;
  /** Undiscounted price, so the quote dialog can show what was saved. */
  listPrice?: number;
  images: string[];
  desc: string;
  category: string;
  label?: string;
}

export function AddToQuoteButton({
  id,
  name,
  price,
  listPrice,
  images,
  desc,
  category,
  label = 'Add to Booking',
}: AddToQuoteButtonProps) {
  return (
    <BookNowPopup
      product={{ id, name, price, listPrice, images, desc, categories: [category] }}
      trigger={
        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[color:var(--brand)] px-8 text-sm font-medium text-white transition-colors hover:bg-[color:var(--brand-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand)] focus-visible:ring-offset-2 sm:w-auto"
        >
          <ShoppingBag size={16} />
          {label}
        </button>
      }
    />
  );
}

export default AddToQuoteButton;
