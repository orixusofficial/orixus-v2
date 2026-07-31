-- Add password_updated_at column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_updated_at timestamptz;
