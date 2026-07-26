-- Discounts.
--
-- `price` stays the list price — the number a product normally rents for.
-- `sale_price` is the promotional price when one is running, and NULL otherwise,
-- so ending a sale is just clearing the field rather than remembering what the
-- original price was.
--
-- The application layer (mapProduct in src/lib/catalogue.ts) resolves these into
-- one effective price, which is what the cart, quotes and orders charge.

alter table public.products
  add column if not exists sale_price numeric;

alter table public.products
  drop constraint if exists products_sale_price_check;

-- A sale price only makes sense if it is a genuine discount.
alter table public.products
  add constraint products_sale_price_check
  check (sale_price is null or (sale_price >= 0 and sale_price < price));

comment on column public.products.sale_price is
  'Promotional price. NULL means no active discount; must be below price.';
