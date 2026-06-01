-- Orixus: user-owned habits, completions, journal, and profiles
-- Apply in Supabase Dashboard → SQL Editor (or via Supabase CLI: supabase db push)

-- ---------------------------------------------------------------------------
-- 1. profiles — one row per auth user (created automatically on signup)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. habits — per-user habit definitions
-- ---------------------------------------------------------------------------
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text not null,
  created_at timestamptz not null default now()
);

create index if not exists habits_user_id_idx on public.habits (user_id);

-- ---------------------------------------------------------------------------
-- 3. habit_completions — one row per habit per calendar day
-- ---------------------------------------------------------------------------
create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid not null references public.habits (id) on delete cascade,
  completed_on date not null,
  unique (habit_id, completed_on)
);

create index if not exists habit_completions_user_id_idx on public.habit_completions (user_id);
create index if not exists habit_completions_habit_id_idx on public.habit_completions (habit_id);

-- ---------------------------------------------------------------------------
-- 4. journal_entries — per-user journal logs
-- ---------------------------------------------------------------------------
create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  content text not null,
  mood text not null check (mood in ('EXCELLENT', 'GOOD', 'NEUTRAL', 'FAILED')),
  created_at timestamptz not null default now()
);

create index if not exists journal_entries_user_id_idx on public.journal_entries (user_id);

-- ---------------------------------------------------------------------------
-- 5. Auto-create empty profile when a user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, '')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 6. Row Level Security — users only access their own data
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;
alter table public.journal_entries enable row level security;

-- profiles
create policy "profiles_select_own"
  on public.profiles for select
  using (id = auth.uid());

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- habits
create policy "habits_select_own"
  on public.habits for select
  using (user_id = auth.uid());

create policy "habits_insert_own"
  on public.habits for insert
  with check (user_id = auth.uid());

create policy "habits_update_own"
  on public.habits for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "habits_delete_own"
  on public.habits for delete
  using (user_id = auth.uid());

-- habit_completions (SELECT required for UPDATE/DELETE in Postgres RLS)
create policy "completions_select_own"
  on public.habit_completions for select
  using (user_id = auth.uid());

create policy "completions_insert_own"
  on public.habit_completions for insert
  with check (user_id = auth.uid());

create policy "completions_delete_own"
  on public.habit_completions for delete
  using (user_id = auth.uid());

-- journal_entries
create policy "journal_select_own"
  on public.journal_entries for select
  using (user_id = auth.uid());

create policy "journal_insert_own"
  on public.journal_entries for insert
  with check (user_id = auth.uid());

create policy "journal_update_own"
  on public.journal_entries for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "journal_delete_own"
  on public.journal_entries for delete
  using (user_id = auth.uid());
