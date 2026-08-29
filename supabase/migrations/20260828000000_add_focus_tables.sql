-- Migration: Add focus_policies and focus_sessions tables for Ultimate Focus feature

-- 1. Focus Policies Table
CREATE TABLE IF NOT EXISTS public.focus_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    categories TEXT[] NOT NULL DEFAULT ARRAY['Adult', 'Gambling', 'Explicit / Nude', 'Live Adult', 'Harmful'],
    blocked_domains TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT focus_policies_user_id_key UNIQUE (user_id)
);

-- 2. Focus Sessions Table
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    policy_id UUID REFERENCES public.focus_policies(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('inactive', 'active', 'ended', 'expired')) DEFAULT 'active',
    duration_minutes INTEGER NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.focus_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;

-- Focus Policies RLS
CREATE POLICY "Users can view their own focus policy"
    ON public.focus_policies FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own focus policy"
    ON public.focus_policies FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own focus policy"
    ON public.focus_policies FOR UPDATE
    USING (auth.uid() = user_id);

-- Focus Sessions RLS
CREATE POLICY "Users can view their own focus sessions"
    ON public.focus_sessions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own focus sessions"
    ON public.focus_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own focus sessions"
    ON public.focus_sessions FOR UPDATE
    USING (auth.uid() = user_id);

-- Index for quick active session lookup
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_status ON public.focus_sessions(user_id, status);
