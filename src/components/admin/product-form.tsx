'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { GripVertical, Loader2, Star, Trash2, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ErrorNote, Panel } from '@/components/admin/ui';

export interface ProductFormValues {
  name: string;
  category_id: string;
  subcategory: string;
  price: string;
  /** Blank means no discount. Kept as a string so the input can be cleared. */
  sale_price: string;
  unitsleft: string;
  instock: boolean;
  short_description: string;
  description: string;
  dimensions: string;
  material: string;
  features: string;
  images: string[];
}

export const EMPTY_PRODUCT: ProductFormValues = {
  name: '',
  category_id: '',
  subcategory: '',
  price: '',
  sale_price: '',
  unitsleft: '0',
  instock: true,
  short_description: '',
  description: '',
  dimensions: '',
  material: '',
  features: '',
  images: [],
};

export interface CategoryOption {
  id: string;
  name: string;
}

const fieldClass =
  'w-full rounded-lg border border-[color:var(--hairline)] bg-[color:var(--surface)] px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-[color:var(--muted-ink)]/60 focus:border-[color:var(--brand)] focus:ring-2 focus:ring-[color:var(--brand)]/20';

function Field({
  label,
  hint,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium text-[color:var(--ink)]">
        {label}
      </label>
      {children}
      {hint ? <p className="text-[11px] text-[color:var(--muted-ink)]">{hint}</p> : null}
    </div>
  );
}

/**
 * Says exactly what a shopper will see, so nobody has to save and go look.
 * Also catches the two ways a sale price goes wrong — not actually cheaper,
 * or free by accident.
 */
function DiscountPreview({ price, salePrice }: { price: string; salePrice: string }) {
  if (salePrice.trim() === '') return null;

  const list = Number(price);
  const sale = Number(salePrice);

  if (!Number.isFinite(list) || !Number.isFinite(sale) || list <= 0) return null;

  if (sale >= list) {
    return (
      <p className="rounded-lg border border-[color:var(--destructive)]/25 bg-[#fdf3f2] px-4 py-3 text-sm text-[color:var(--destructive)]">
        The sale price has to be lower than the ${list.toFixed(2)} regular price.
      </p>
    );
  }

  const percent = Math.round(((list - sale) / list) * 100);

  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-[color:var(--brand-soft)] px-4 py-3 text-sm text-[color:var(--brand-deep)]">
      <span className="font-semibold">{percent}% off.</span>
      <span className="text-[color:var(--ink)]">
        Customers pay{' '}
        <span className="spec font-semibold tabular-nums">${sale.toFixed(2)}</span>
        <span className="spec tabular-nums"> </span>
        <s className="spec tabular-nums opacity-60">${list.toFixed(2)}</s> per day.
      </span>
    </p>
  );
}

export function ProductForm({
  values,
  onChange,
  categories,
  submitting,
  error,
  submitLabel,
  onSubmit,
  onCancel,
  onDelete,
}: {
  values: ProductFormValues;
  onChange: (next: ProductFormValues) => void;
  categories: CategoryOption[];
  submitting: boolean;
  error: string | null;
  submitLabel: string;
  onSubmit: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState('');

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    onChange({ ...values, [key]: value });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) throw new Error('Your session has expired. Sign in again.');

      const body = new FormData();
      Array.from(files).forEach((file) => body.append('files', file));

      // FormData sets its own multipart boundary, so no Content-Type here.
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || 'Upload failed.');

      onChange({ ...values, images: [...values.images, ...(payload.urls as string[])] });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setUploadError('That does not look like a valid image URL.');
      return;
    }
    if (values.images.includes(url)) {
      setUploadError('That image is already on this product.');
      return;
    }
    setUploadError(null);
    set('images', [...values.images, url]);
    setUrlDraft('');
  };

  const removeImage = (index: number) =>
    set(
      'images',
      values.images.filter((_, i) => i !== index)
    );

  const makePrimary = (index: number) => {
    if (index === 0) return;
    const next = [...values.images];
    const [moved] = next.splice(index, 1);
    set('images', [moved, ...next]);
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {error ? <ErrorNote>{error}</ErrorNote> : null}

      <Panel title="Basics" description="What customers see first">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field label="Product name" htmlFor="product-name">
              <input
                id="product-name"
                className={fieldClass}
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="White Chiavari Chair"
                required
              />
            </Field>
          </div>

          <Field label="Category" htmlFor="product-category">
            <select
              id="product-category"
              className={fieldClass}
              value={values.category_id}
              onChange={(e) => set('category_id', e.target.value)}
              required
            >
              <option value="">Choose a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Subcategory" htmlFor="product-subcategory" hint="Optional">
            <input
              id="product-subcategory"
              className={fieldClass}
              value={values.subcategory}
              onChange={(e) => set('subcategory', e.target.value)}
              placeholder="Folding chairs"
            />
          </Field>

          <Field label="Price per day" htmlFor="product-price">
            <div className="relative">
              <span className="spec pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--muted-ink)]">
                $
              </span>
              <input
                id="product-price"
                type="number"
                min="0"
                step="0.01"
                className={`${fieldClass} spec pl-7 tabular-nums`}
                value={values.price}
                onChange={(e) => set('price', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </Field>

          <Field
            label="Sale price"
            htmlFor="product-sale-price"
            hint="Leave blank for no discount"
          >
            <div className="relative">
              <span className="spec pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--muted-ink)]">
                $
              </span>
              <input
                id="product-sale-price"
                type="number"
                min="0"
                step="0.01"
                className={`${fieldClass} spec pl-7 tabular-nums`}
                value={values.sale_price}
                onChange={(e) => set('sale_price', e.target.value)}
                placeholder="—"
              />
            </div>
          </Field>

          <div className="sm:col-span-2">
            <DiscountPreview price={values.price} salePrice={values.sale_price} />
          </div>

          <Field label="Units available" htmlFor="product-units">
            <input
              id="product-units"
              type="number"
              min="0"
              step="1"
              className={`${fieldClass} spec tabular-nums`}
              value={values.unitsleft}
              onChange={(e) => set('unitsleft', e.target.value)}
              required
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Short description" htmlFor="product-short" hint="One line, shown on catalogue cards">
              <input
                id="product-short"
                className={fieldClass}
                value={values.short_description}
                onChange={(e) => set('short_description', e.target.value)}
                placeholder="Gold-finish resin chair with ivory cushion"
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Full description" htmlFor="product-description">
              <textarea
                id="product-description"
                rows={4}
                className={fieldClass}
                value={values.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="What it is, what it suits, anything a customer should know before booking."
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-3 rounded-lg border border-[color:var(--hairline)] px-4 py-3">
              <input
                type="checkbox"
                checked={values.instock}
                onChange={(e) => set('instock', e.target.checked)}
                className="h-4 w-4 accent-[color:var(--brand)]"
              />
              <span className="text-sm">
                Available to book
                <span className="ml-2 text-xs text-[color:var(--muted-ink)]">
                  Turn off to hide it from customers without deleting it
                </span>
              </span>
            </label>
          </div>
        </div>
      </Panel>

      <Panel
        title="Images"
        description="The first image is the one customers see on the catalogue"
      >
        {uploadError ? (
          <div className="mb-4">
            <ErrorNote>{uploadError}</ErrorNote>
          </div>
        ) : null}

        {values.images.length > 0 ? (
          <ul className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {values.images.map((image, index) => (
              <li
                key={`${image}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[color:var(--hairline)] bg-[color:var(--muted)]"
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 200px"
                  className="object-cover"
                  unoptimized
                />

                {index === 0 ? (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-[color:var(--ink)]/85 px-2 py-0.5 text-[10px] font-semibold text-white">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    Main
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makePrimary(index)}
                    className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-[color:var(--surface)]/90 px-2 py-0.5 text-[10px] font-medium opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    <GripVertical className="h-2.5 w-2.5" />
                    Make main
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-[color:var(--surface)]/90 text-[color:var(--destructive)] transition-colors hover:bg-[color:var(--destructive)] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-5 rounded-lg border border-dashed border-[color:var(--hairline)] px-4 py-8 text-center text-sm text-[color:var(--muted-ink)]">
            No images yet. Add at least one before saving.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[color:var(--hairline)] px-4 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)] disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Uploading…' : 'Upload images'}
          </button>

          <div className="flex flex-1 gap-2">
            <input
              className={fieldClass}
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addUrl();
                }
              }}
              placeholder="…or paste an image URL"
            />
            <button
              type="button"
              onClick={addUrl}
              className="shrink-0 rounded-lg border border-[color:var(--hairline)] px-4 text-sm font-medium transition-colors hover:border-[color:var(--brand)] hover:text-[color:var(--brand-deep)]"
            >
              Add
            </button>
          </div>
        </div>
      </Panel>

      <Panel title="Specifications" description="Shown on the product page">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Dimensions" htmlFor="product-dimensions">
            <input
              id="product-dimensions"
              className={fieldClass}
              value={values.dimensions}
              onChange={(e) => set('dimensions', e.target.value)}
              placeholder={'18" W × 20" D × 36" H'}
            />
          </Field>

          <Field label="Material" htmlFor="product-material">
            <input
              id="product-material"
              className={fieldClass}
              value={values.material}
              onChange={(e) => set('material', e.target.value)}
              placeholder="Resin, powder-coated steel"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Features" htmlFor="product-features" hint="One per line, or comma separated">
              <textarea
                id="product-features"
                rows={3}
                className={fieldClass}
                value={values.features}
                onChange={(e) => set('features', e.target.value)}
                placeholder="Stackable, indoor and outdoor rated, cushion included"
              />
            </Field>
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-[color:var(--destructive)] transition-colors hover:bg-[#f7e4e3] disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete product
          </button>
        ) : (
          <span />
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-full border border-[color:var(--hairline)] px-5 py-2.5 text-sm font-medium transition-colors hover:border-[color:var(--ink)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-6 py-2.5 text-sm font-medium text-[color:var(--ink)] transition-colors hover:bg-[color:var(--brand-deep)] hover:text-white disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {submitting ? 'Saving…' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
