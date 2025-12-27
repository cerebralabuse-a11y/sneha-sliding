
-- Add images column to gallery table
alter table public.gallery add column if not exists images text[];

-- Optional: Migrate existing data to populate images array from imageUrl if needed
-- update public.gallery set images = ARRAY["imageUrl"] where images is null;
