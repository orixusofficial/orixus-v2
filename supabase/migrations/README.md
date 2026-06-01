# Orixus database migrations

## `20260601180000_orixus_auth_schema.sql`

**What it does**

| Object | Purpose |
|--------|---------|
| `profiles` | One row per user (`id` = `auth.users.id`), empty `display_name` on signup |
| `habits` | User-owned habit labels |
| `habit_completions` | One checkmark per habit per day (`unique (habit_id, completed_on)`) |
| `journal_entries` | Journal posts with mood enum |
| `handle_new_user()` + trigger | Inserts empty `profiles` row when someone signs up |
| RLS policies | `auth.uid()` must match row owner on all CRUD |

**What it does not do**

- Does not change Supabase Auth settings (disable email confirmation in Dashboard → Authentication → Providers → Email).
- Does not seed demo habits.

**How to apply**

1. Open your existing Supabase project → **SQL Editor** → **New query**.
2. Paste the full contents of `20260601180000_orixus_auth_schema.sql`.
3. Run. Confirm no errors.
4. In **Authentication → Providers → Email**, turn off **Confirm email** if you want immediate login after signup.

**Rollback (destructive)** — only if you need to undo before production data exists:

```sql
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.journal_entries cascade;
drop table if exists public.habit_completions cascade;
drop table if exists public.habits cascade;
drop table if exists public.profiles cascade;
```
