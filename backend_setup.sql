-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Create Gallery Table
create table if not exists public.gallery (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  category text not null check (category in ('aluminium', 'painting')),
  author text not null,
  date timestamp with time zone default timezone('utc'::text, now()),
  type text not null check (type in ('image', 'video')),
  "imageUrl" text not null, -- quoted because camelCase is used in code
  description text
);

-- Enable RLS on gallery
alter table public.gallery enable row level security;

-- Create policies for gallery
create policy "Enable read access for all users" on public.gallery
  for select using (true);

create policy "Enable insert for authenticated and anon users" on public.gallery
  for insert with check (true);

create policy "Enable delete for authenticated and anon users" on public.gallery
  for delete using (true);

-- Create Enquiries Table
create table if not exists public.enquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text not null,
  message text,
  worker text,
  date timestamp with time zone
);

-- Enable RLS on enquiries
alter table public.enquiries enable row level security;

-- Create policies for enquiries
create policy "Enable insert for all users" on public.enquiries
  for insert with check (true);

create policy "Enable read access for all users" on public.enquiries
  for select using (true);

-- Create Storage Bucket
insert into storage.buckets (id, name, public) 
values ('gallery-images', 'gallery-images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Give public access to gallery-images" on storage.objects
  for select using (bucket_id = 'gallery-images');

create policy "Enable upload for all users" on storage.objects
  for insert with check (bucket_id = 'gallery-images');

create policy "Enable delete for all users" on storage.objects
  for delete using (bucket_id = 'gallery-images');
