-- Rail verse signalling works ERP: secure multi-device records
-- Run this once in Supabase Dashboard > SQL Editor > New query.
create table if not exists public.rv_records (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  table_name text not null check (table_name in ('projects','staff','attendance','materials','expenses','payroll','cashbook')),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create index if not exists rv_records_owner_table_updated_idx
  on public.rv_records (owner_id, table_name, updated_at desc);
alter table public.rv_records enable row level security;
drop policy if exists "Users read their own Railverse records" on public.rv_records;
create policy "Users read their own Railverse records"
  on public.rv_records for select to authenticated
  using (owner_id = auth.uid());
drop policy if exists "Users insert their own Railverse records" on public.rv_records;
create policy "Users insert their own Railverse records"
  on public.rv_records for insert to authenticated
  with check (owner_id = auth.uid());
drop policy if exists "Users update their own Railverse records" on public.rv_records;
create policy "Users update their own Railverse records"
  on public.rv_records for update to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());
drop policy if exists "Users delete their own Railverse records" on public.rv_records;
create policy "Users delete their own Railverse records"
  on public.rv_records for delete to authenticated
  using (owner_id = auth.uid());
grant select, insert, update, delete on public.rv_records to authenticated;
