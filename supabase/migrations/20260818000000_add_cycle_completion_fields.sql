-- Add cycle rank fields - current_rank for active cycles, final_rank for completed cycles
ALTER TABLE public.cycles ADD COLUMN IF NOT EXISTS current_rank TEXT DEFAULT 'Initiate';
ALTER TABLE public.cycles ADD COLUMN IF NOT EXISTS final_rank TEXT;

-- Add completion percentage and result fields to cycles table
ALTER TABLE public.cycles ADD COLUMN IF NOT EXISTS completion_percentage NUMERIC;

-- Add completion result field
ALTER TABLE public.cycles ADD COLUMN IF NOT EXISTS completion_result TEXT;

-- Add ended_at column to track when cycle was ended (whether completed or deleted)
ALTER TABLE public.cycles ADD COLUMN IF NOT EXISTS ended_at TIMESTAMPTZ;

-- Migrate existing rank column to current_rank for active cycles
UPDATE public.cycles SET current_rank = rank WHERE current_rank IS NULL AND rank IS NOT NULL AND status = 'active';

-- Migrate existing rank column to final_rank for completed cycles
UPDATE public.cycles SET final_rank = rank WHERE final_rank IS NULL AND rank IS NOT NULL AND status = 'completed';
