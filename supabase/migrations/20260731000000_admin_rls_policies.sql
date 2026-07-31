-- ============================================================================
-- Orixus Admin RLS Policies
-- File: supabase/migrations/20260731000000_admin_rls_policies.sql
--
-- Run this in: Supabase Dashboard → SQL Editor
--
-- BEFORE RUNNING:
--   Replace every occurrence of 'YOUR_ADMIN_USER_ID' below with the actual
--   user ID configured in src/admin/config.js.
--
-- These policies ADD admin read access on top of existing user-own policies.
-- No existing policies are modified (except the broken jwt-role check on
-- feedback which never worked and is replaced here).
-- ============================================================================

-- ─── profiles: admin can read all rows ──────────────────────────────────────
CREATE POLICY "admin_select_profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() = '99786e31-0e01-4d81-b0ed-1ca74bf3c91a');

-- ─── habits: admin can read all rows ────────────────────────────────────────
CREATE POLICY "admin_select_habits"
  ON public.habits FOR SELECT
  USING (auth.uid() = '99786e31-0e01-4d81-b0ed-1ca74bf3c91a');

-- ─── habit_completions: admin can read all rows ──────────────────────────────
CREATE POLICY "admin_select_completions"
  ON public.habit_completions FOR SELECT
  USING (auth.uid() = '99786e31-0e01-4d81-b0ed-1ca74bf3c91a');

-- ─── journal_entries: admin can read all rows ────────────────────────────────
CREATE POLICY "admin_select_journal"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = '99786e31-0e01-4d81-b0ed-1ca74bf3c91a');

-- ─── feedback: replace the broken jwt-role policy, add admin read + delete ───

-- Drop the old non-functional policy (uses jwt role claim that was never set)
DROP POLICY IF EXISTS "Admin can view all feedback" ON public.feedback;

-- Admin can read all feedback
CREATE POLICY "admin_select_feedback"
  ON public.feedback FOR SELECT
  USING (auth.uid() = '99786e31-0e01-4d81-b0ed-1ca74bf3c91a');

-- Admin can delete any feedback entry
CREATE POLICY "admin_delete_feedback"
  ON public.feedback FOR DELETE
  USING (auth.uid() = '99786e31-0e01-4d81-b0ed-1ca74bf3c91a');

-- ─── IMPORTANT: Apply these policies in Supabase Dashboard → SQL Editor ───
-- These policies work alongside the existing user-own policies.
-- Supabase RLS uses OR logic for multiple policies on the same operation,
-- so the admin user will have access to ALL rows while regular users
-- only see their own data.
