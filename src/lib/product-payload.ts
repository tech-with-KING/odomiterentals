/**
 * Shared shaping/validation for the admin product write routes. Keeps the
 * create and update handlers honest about column names — the table is
 * snake_case, the forms are not — and stops empty strings reaching NOT NULL
 * columns that have defaults.
 */

type ProductPayload = Record<string, unknown>;

const TEXT_FIELDS = [
  'name',
  'short_description',
  'description',
  'subcategory',
  'dimensions',
  'material',
  'features',
] as const;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function buildProductPayload(
  body: unknown,
  { partial }: { partial: boolean }
): { payload: ProductPayload; error?: never } | { payload?: never; error: string } {
  if (!body || typeof body !== 'object') return { error: 'Invalid request body.' };

  const input = body as Record<string, unknown>;
  const payload: ProductPayload = {};

  for (const field of TEXT_FIELDS) {
    if (field in input) payload[field] = asString(input[field]);
  }

  if ('category_id' in input) {
    const categoryId = asString(input.category_id);
    if (!UUID_PATTERN.test(categoryId)) return { error: 'Choose a category.' };
    payload.category_id = categoryId;
  }

  if ('price' in input) {
    const price = Number(input.price);
    if (!Number.isFinite(price) || price < 0) return { error: 'Price must be a positive number.' };
    payload.price = price;
  }

  // An empty sale price means "no discount", not zero.
  if ('sale_price' in input) {
    const raw = input.sale_price;
    if (raw === null || raw === undefined || raw === '') {
      payload.sale_price = null;
    } else {
      const salePrice = Number(raw);
      if (!Number.isFinite(salePrice) || salePrice < 0) {
        return { error: 'Sale price must be a positive number, or blank for no discount.' };
      }
      payload.sale_price = salePrice;
    }
  }

  // Only checkable when both arrive together; the products_sale_price_check
  // constraint is the backstop for anything else.
  if (
    typeof payload.sale_price === 'number' &&
    typeof payload.price === 'number' &&
    payload.sale_price >= payload.price
  ) {
    return { error: 'The sale price has to be lower than the regular price.' };
  }

  if ('unitsleft' in input) {
    const units = Number(input.unitsleft);
    if (!Number.isInteger(units) || units < 0) {
      return { error: 'Units available must be a whole number of 0 or more.' };
    }
    payload.unitsleft = units;
  }

  if ('instock' in input) payload.instock = Boolean(input.instock);

  if ('rating' in input) {
    const rating = input.rating;
    payload.rating = rating === null || rating === '' ? null : Number(rating);
  }

  if ('images' in input) {
    const images = Array.isArray(input.images) ? input.images.map(asString).filter(Boolean) : [];
    if (!partial && images.length === 0) return { error: 'Add at least one product image.' };
    payload.images = images;
  }

  if (!partial) {
    if (!payload.name) return { error: 'Product name is required.' };
    if (!payload.category_id) return { error: 'Choose a category.' };
    if (payload.price === undefined) return { error: 'Price is required.' };
    if (payload.images === undefined) return { error: 'Add at least one product image.' };
  }

  if (Object.keys(payload).length === 0) return { error: 'Nothing to update.' };

  if (partial) payload.updated_at = new Date().toISOString();

  return { payload };
}
