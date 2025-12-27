
-- Ensure worker column exists
alter table public.enquiries add column if not exists worker text;

-- Ensure date column exists
alter table public.enquiries add column if not exists date timestamp with time zone;

-- Ensure RLS is enabled
alter table public.enquiries enable row level security;

-- Re-apply insert policy to be safe (drop first to avoid conflict if name matches, though 'create policy if not exists' is not standard sql)
drop policy if exists "Enable insert for all users" on public.enquiries;
create policy "Enable insert for all users" on public.enquiries
  for insert with check (true);

-- Ensure select policy (for admin)
drop policy if exists "Enable read access for all users" on public.enquiries;
create policy "Enable read access for all users" on public.enquiries
  for select using (true);
