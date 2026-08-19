-- Add rank column to cycles table for cycle-specific rank tracking
ALTER TABLE public.cycles ADD COLUMN IF NOT EXISTS rank TEXT DEFAULT 'Initiate';
