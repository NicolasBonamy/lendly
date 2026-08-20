-- Run this script in the Supabase SQL editor on existing projects.
-- New projects already get `kind` from schema.sql.

alter table public.loans
  add column if not exists kind text not null default 'loan';

alter table public.loans
  drop constraint if exists loans_kind_check;

alter table public.loans
  add constraint loans_kind_check check (kind in ('loan', 'borrow'));
