alter table public.users
  add column if not exists product_received boolean not null default false;
