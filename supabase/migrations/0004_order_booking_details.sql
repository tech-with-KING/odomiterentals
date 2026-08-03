-- How a booking is handed over, where it is going, and how long it runs for.
--
-- Until now an order carried one address and one date, and delivery was
-- assumed. Customers can now collect the items themselves, hold them over a
-- range of days, and hold the event somewhere other than where they live — so
-- the row has to record which of those they picked rather than leaving the
-- crew to infer it from the special instructions.
--
-- Every column is nullable with a default that reproduces the old behaviour,
-- so orders placed before this migration keep reading correctly:
-- delivery_method 'delivery', booking_date_mode 'single', and an event address
-- that resolves to the customer's own (see normalizeCustomerInfo in
-- src/lib/booking.ts).

alter table public.orders
  add column if not exists alternate_phone text,
  add column if not exists delivery_method text not null default 'delivery',
  add column if not exists event_address text,
  add column if not exists event_address_same_as_home boolean not null default true,
  add column if not exists booking_date_mode text not null default 'single',
  add column if not exists rental_end_date date;

alter table public.orders
  drop constraint if exists orders_delivery_method_check;

alter table public.orders
  add constraint orders_delivery_method_check
  check (delivery_method in ('delivery', 'pickup'));

alter table public.orders
  drop constraint if exists orders_booking_date_mode_check;

alter table public.orders
  add constraint orders_booking_date_mode_check
  check (booking_date_mode in ('single', 'range'));

-- A timeframe that ends before it starts is a data-entry error, not a booking.
alter table public.orders
  drop constraint if exists orders_rental_range_check;

alter table public.orders
  add constraint orders_rental_range_check
  check (
    booking_date_mode <> 'range'
    or rental_end_date is null
    or rental_end_date >= rental_start_date
  );

comment on column public.orders.delivery_method is
  '''delivery'' = we deliver and collect; ''pickup'' = the customer collects and returns.';
comment on column public.orders.event_address is
  'Resolved event location. Equals the customer address when event_address_same_as_home.';
comment on column public.orders.booking_date_mode is
  '''single'' uses rental_start_date alone; ''range'' also uses rental_end_date.';
comment on column public.orders.alternate_phone is
  'Optional backup number, used only when the primary cannot be reached.';
