-- Orixus: Achievements system
-- Tracks user achievement unlocks with unique constraint to prevent duplicates

-- ---------------------------------------------------------------------------
-- achievements table — stores unlocked achievements per user
-- ---------------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null, -- matches the id from ACHIEVEMENTS_CONFIG
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id) -- Prevent duplicate unlocks
);

create index if not exists achievements_user_id_idx on public.achievements (user_id);
create index if not exists achievements_achievement_id_idx on public.achievements (achievement_id);

-- ---------------------------------------------------------------------------
-- Row Level Security for achievements
-- ---------------------------------------------------------------------------
alter table public.achievements enable row level security;

-- Users can only see their own achievements
create policy "achievements_select_own"
  on public.achievements for select
  using (user_id = auth.uid());

-- Users can only insert their own achievements
create policy "achievements_insert_own"
  on public.achievements for insert
  with check (user_id = auth.uid());

-- Users cannot delete achievements (permanent record)
create policy "achievements_no_delete"
  on public.achievements for delete
  using (false);
