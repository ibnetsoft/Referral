alter table public.users
  add column if not exists full_name varchar(50),
  add column if not exists phone_number varchar(20);

update public.users
set
  full_name = coalesce(nullif(full_name, ''), username),
  phone_number = coalesce(
    nullif(phone_number, ''),
    '000-' || right(replace(id::text, '-', ''), 4) || '-' || substring(replace(id::text, '-', '') from 1 for 4)
  )
where full_name is null or phone_number is null;

alter table public.users
  alter column full_name set not null,
  alter column phone_number set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_phone_number_unique'
  ) then
    alter table public.users
      add constraint users_phone_number_unique unique (phone_number);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_full_name_length'
  ) then
    alter table public.users
      add constraint users_full_name_length
      check (char_length(full_name) between 2 and 50);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_phone_number_format'
  ) then
    alter table public.users
      add constraint users_phone_number_format
      check (phone_number ~ '^[0-9]{2,4}-?[0-9]{3,4}-?[0-9]{4}$');
  end if;
end $$;
