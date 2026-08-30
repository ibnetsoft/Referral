create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username varchar(50) not null unique,
  password_hash text not null,
  referral_code varchar(32) not null unique,
  recommender_id uuid null references public.users(id),
  role varchar(20) not null default 'USER',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint users_username_format check (username ~ '^[A-Za-z0-9_]{4,20}$'),
  constraint users_role_check check (role in ('USER', 'ADMIN')),
  constraint users_referral_code_format check (referral_code ~ '^[A-Z0-9]{6,12}$')
);

create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  ip_address inet null,
  user_agent text null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  username varchar(50) null,
  ip_address inet null,
  created_at timestamptz not null default now()
);

create index if not exists idx_users_recommender_id on public.users (recommender_id);
create index if not exists idx_users_created_at on public.users (created_at desc);
create index if not exists idx_user_sessions_user_id on public.user_sessions (user_id);
create index if not exists idx_user_sessions_expires_at on public.user_sessions (expires_at);
create index if not exists idx_login_attempts_username_created_at on public.login_attempts (username, created_at desc);
create index if not exists idx_login_attempts_ip_created_at on public.login_attempts (ip_address, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_set_updated_at on public.users;
create trigger trg_users_set_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.user_sessions enable row level security;
alter table public.login_attempts enable row level security;

revoke all on public.users from anon, authenticated;
revoke all on public.user_sessions from anon, authenticated;
revoke all on public.login_attempts from anon, authenticated;
