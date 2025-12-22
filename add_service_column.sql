-- Add 'service' column to gallery table
alter table public.gallery add column if not exists service text;
