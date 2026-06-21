-- Add duration column to habits table for onboarding modal
alter table public.habits add column if not exists duration integer default 30;
