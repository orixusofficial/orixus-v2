// ─────────────────────────────────────────────────────────────────────────────
//  Orixus — Admin Configuration
//
//  ADMIN_USER_ID: The user ID of the single authorized admin account.
//  Set this to the user ID from your Supabase auth.users table.
//
//  After changing this, also update the SQL migration:
//  supabase/migrations/20260731000000_admin_rls_policies.sql
//  and re-run it in Supabase Dashboard → SQL Editor.
// ─────────────────────────────────────────────────────────────────────────────

/** The user ID of the sole account permitted to access /admin. */
export const ADMIN_USER_ID = '99786e31-0e01-4d81-b0ed-1ca74bf3c91a';
