import { supabase } from '@/lib/supabase';

export interface CatalogueProduct {
  id: string;
  name: string;
  /**
   * What the customer actually pays — the sale price when a discount is
   * running, otherwise the list price. Carts, quotes and orders all read this,
   * so a discount applies everywhere without them knowing about discounts.
   */
  price: number;
  /** The undiscounted price. Equal to `price` when nothing is on sale. */
  listPrice: number;
  isDiscounted: boolean;
  /** Whole percent off, for the "−20%" chip. 0 when not discounted. */
  discountPercent: number;
  image: string;
  images: string[];
  categoryName: string;
  categorySlug: string;
  /** Short technical line under the name — dimensions where we have them. */
  spec: string;
  desc: string;
  instock: boolean;
  unitsleft: number | null;
}

export interface CatalogueCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  count: number;
}

export interface SiteService {
  key: string;
  title: string;
  description: string;
  image: string;
}

/** Maps a category name onto its `site_assets` key, e.g. "Kids Rentals" -> category_kids_rentals */
export function categoryAssetKey(name: string) {
  return `category_${name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')}`;
}

/** Exported so every product query selects the same shape — see the category page. */
export const PRODUCT_COLUMNS =
  'id, name, short_description, description, price, sale_price, images, dimensions, material, subcategory, instock, unitsleft, created_at, categories(name, slug)';

type ProductRow = {
  id: string;
  name: string;
  short_description: string | null;
  description: string | null;
  price: number | string | null;
  sale_price: number | string | null;
  images: string[] | null;
  dimensions: string | null;
  subcategory: string | null;
  instock: boolean | null;
  unitsleft: number | null;
  categories: { name: string; slug: string } | { name: string; slug: string }[] | null;
};

/**
 * Collapses `price` + `sale_price` into the one number the rest of the app
 * charges, keeping the original around only so the UI can strike it through.
 * A sale price is ignored unless it is a real discount, so bad data can never
 * make something more expensive than its list price.
 */
function resolvePricing(row: ProductRow) {
  const listPrice = Number(row.price ?? 0);
  const salePrice = row.sale_price === null || row.sale_price === undefined ? null : Number(row.sale_price);
  const isDiscounted = salePrice !== null && Number.isFinite(salePrice) && salePrice >= 0 && salePrice < listPrice;

  return {
    price: isDiscounted ? salePrice! : listPrice,
    listPrice,
    isDiscounted,
    discountPercent: isDiscounted ? Math.round(((listPrice - salePrice!) / listPrice) * 100) : 0,
  };
}

export function mapProduct(row: ProductRow): CatalogueProduct {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  const images = row.images ?? [];

  return {
    id: row.id,
    name: row.name,
    ...resolvePricing(row),
    image: images[0] ?? '',
    images,
    categoryName: category?.name ?? 'Rentals',
    categorySlug: category?.slug ?? '',
    spec: row.dimensions || row.subcategory || row.short_description || '',
    desc: row.short_description || row.description || '',
    instock: row.instock !== false,
    unitsleft: row.unitsleft,
  };
}

/** Service copy the prototype ships. Images and titles come from `site_assets`. */
const SERVICE_COPY: Record<string, { title: string; description: string }> = {
  service_transportation: {
    title: 'Transportation',
    description: 'Reliable delivery and pickup, on your schedule.',
  },
  service_setup: {
    title: 'Setup',
    description: 'Professional setup for a perfect event layout.',
  },
  service_decoration: {
    title: 'Decoration',
    description: 'Stylish decor to make your event unforgettable.',
  },
  service_rentals_cleanup: {
    title: 'Cleanup',
    description: 'Post-event breakdown handled with care.',
  },
};

const SERVICE_ORDER = Object.keys(SERVICE_COPY);

export interface HomeData {
  products: CatalogueProduct[];
  categories: CatalogueCategory[];
  services: SiteService[];
  assets: Record<string, string>;
}

/**
 * One round trip for everything the homepage renders. Called from the server
 * component so the page ships with its content already in the markup.
 */
export async function getHomeData(): Promise<HomeData> {
  const [productsRes, categoriesRes, assetsRes] = await Promise.all([
    supabase.from('products').select(PRODUCT_COLUMNS).order('created_at', { ascending: false }),
    supabase.from('categories').select('id, name, slug, description').order('name'),
    supabase.from('site_assets').select('key, label, url'),
  ]);

  const products = ((productsRes.data as ProductRow[] | null) ?? []).map(mapProduct);
  const assets = Object.fromEntries(((assetsRes.data as { key: string; url: string }[] | null) ?? []).map((a) => [a.key, a.url]));

  const countBySlug = products.reduce<Record<string, number>>((acc, product) => {
    acc[product.categorySlug] = (acc[product.categorySlug] ?? 0) + 1;
    return acc;
  }, {});

  const categories: CatalogueCategory[] = (
    (categoriesRes.data as { id: string; name: string; slug: string; description: string | null }[] | null) ?? []
  ).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    image: assets[categoryAssetKey(category.name)] ?? '',
    count: countBySlug[category.slug] ?? 0,
  }));

  const services: SiteService[] = SERVICE_ORDER.filter((key) => assets[key]).map((key) => ({
    key,
    title: SERVICE_COPY[key].title,
    description: SERVICE_COPY[key].description,
    image: assets[key],
  }));

  return { products, categories, services, assets };
}

export interface ProductDetail extends CatalogueProduct {
  shortDescription: string;
  description: string;
  dimensions: string;
  material: string;
  features: string;
  subcategory: string;
  rating: number | null;
}

/** Full record for the product detail page. Returns null when the id is unknown. */
export async function getProductById(id: string): Promise<ProductDetail | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`${PRODUCT_COLUMNS}, features, rating`)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error loading product:', error);
    return null;
  }
  if (!data) return null;

  const row = data as ProductRow & {
    material: string | null;
    features: string | null;
    rating: number | null;
  };

  return {
    ...mapProduct(row),
    shortDescription: row.short_description ?? '',
    description: row.description ?? row.short_description ?? '',
    dimensions: row.dimensions ?? '',
    material: row.material ?? '',
    features: row.features ?? '',
    subcategory: row.subcategory ?? '',
    rating: row.rating,
  };
}

/** Other items in the same category, for the "you might also need" row. */
export async function getRelatedProducts(
  categorySlug: string,
  excludeId: string,
  limit = 4
): Promise<CatalogueProduct[]> {
  if (!categorySlug) return [];

  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .neq('id', excludeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading related products:', error);
    return [];
  }

  return ((data as ProductRow[] | null) ?? [])
    .map(mapProduct)
    .filter((product) => product.categorySlug === categorySlug)
    .slice(0, limit);
}

/** Every product id, so the detail pages can be pre-rendered. */
export async function getAllProductIds(): Promise<string[]> {
  const { data, error } = await supabase.from('products').select('id');
  if (error) {
    console.error('Error loading product ids:', error);
    return [];
  }
  return ((data as { id: string }[] | null) ?? []).map((row) => row.id);
}

/** Client-side fetch used by /shop and the category pages. */
export async function fetchProducts(): Promise<CatalogueProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data as ProductRow[] | null) ?? []).map(mapProduct);
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('id, name, slug, description').order('name');
  if (error) throw error;
  return (data as { id: string; name: string; slug: string; description: string | null }[] | null) ?? [];
}
