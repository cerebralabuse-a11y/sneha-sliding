
-- Create Testimonials Table
create table if not exists public.testimonials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text not null,
  category text not null check (category in ('aluminium', 'painting')),
  date timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on testimonials
alter table public.testimonials enable row level security;

-- Create policies for testimonials
create policy "Enable read access for all users" on public.testimonials
  for select using (true);

create policy "Enable insert for authenticated and anon users" on public.testimonials
  for insert with check (true);

create policy "Enable delete for authenticated and anon users" on public.testimonials
  for delete using (true);
