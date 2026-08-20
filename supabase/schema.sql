-- Run this script in the Supabase SQL editor once per project.

create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null default 'loan',
  name text not null,
  photo_path text,
  loaned_at date not null,
  borrower_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint loans_kind_check check (kind in ('loan', 'borrow'))
);

create index if not exists loans_user_id_loaned_at_idx
  on public.loans (user_id, loaned_at desc, created_at desc);

-- Existing projects: CREATE TABLE IF NOT EXISTS does not add new columns.
alter table public.loans
  add column if not exists kind text not null default 'loan';

alter table public.loans
  drop constraint if exists loans_kind_check;

alter table public.loans
  add constraint loans_kind_check check (kind in ('loan', 'borrow'));

alter table public.loans enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists loans_set_updated_at on public.loans;
create trigger loans_set_updated_at
before update on public.loans
for each row
execute function public.set_updated_at();

drop policy if exists "Users can select own loans" on public.loans;
create policy "Users can select own loans"
on public.loans
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own loans" on public.loans;
create policy "Users can insert own loans"
on public.loans
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own loans" on public.loans;
create policy "Users can update own loans"
on public.loans
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own loans" on public.loans;
create policy "Users can delete own loans"
on public.loans
for delete
to authenticated
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('loan-photos', 'loan-photos', false)
on conflict (id) do nothing;

drop policy if exists "Users can read own loan photos" on storage.objects;
create policy "Users can read own loan photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'loan-photos'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Users can upload own loan photos" on storage.objects;
create policy "Users can upload own loan photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'loan-photos'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Users can update own loan photos" on storage.objects;
create policy "Users can update own loan photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'loan-photos'
  and split_part(name, '/', 1) = auth.uid()::text
)
with check (
  bucket_id = 'loan-photos'
  and split_part(name, '/', 1) = auth.uid()::text
);

drop policy if exists "Users can delete own loan photos" on storage.objects;
create policy "Users can delete own loan photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'loan-photos'
  and split_part(name, '/', 1) = auth.uid()::text
);
