-- Orixus: Cycle System Migration

-- 1. Create the cycles table
CREATE TABLE IF NOT EXISTS public.cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  duration INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS cycles_user_id_idx ON public.cycles (user_id);

-- 2. Add cycle_id to habits table (nullable, defaulting to NULL)
ALTER TABLE public.habits ADD COLUMN IF NOT EXISTS cycle_id UUID REFERENCES public.cycles(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS habits_cycle_id_idx ON public.habits (cycle_id);

-- 3. Row Level Security for cycles table
ALTER TABLE public.cycles ENABLE ROW LEVEL SECURITY;

-- Select policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cycles' AND policyname = 'cycles_select_own'
  ) THEN
    CREATE POLICY "cycles_select_own"
      ON public.cycles FOR SELECT
      USING (user_id = auth.uid());
  END IF;
END
$$;

-- Insert policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cycles' AND policyname = 'cycles_insert_own'
  ) THEN
    CREATE POLICY "cycles_insert_own"
      ON public.cycles FOR INSERT
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

-- Update policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cycles' AND policyname = 'cycles_update_own'
  ) THEN
    CREATE POLICY "cycles_update_own"
      ON public.cycles FOR UPDATE
      USING (user_id = auth.uid())
      WITH CHECK (user_id = auth.uid());
  END IF;
END
$$;

-- Delete policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'cycles' AND policyname = 'cycles_delete_own'
  ) THEN
    CREATE POLICY "cycles_delete_own"
      ON public.cycles FOR DELETE
      USING (user_id = auth.uid());
  END IF;
END
$$;
