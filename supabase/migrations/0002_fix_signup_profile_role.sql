-- Unblocks signup.
--
-- The `on_auth_user_created` trigger runs `handle_new_user()`, which inserts
-- `role = 'user'` into public.profiles. The profiles_role_check constraint only
-- allowed 'admin', 'pm' and 'developer', so every insert into auth.users was
-- rolled back — email/password signup and Google OAuth both failed, and
-- auth.users stayed empty.
--
-- `profiles` is not used by this app (admin access is granted through the
-- `admins` table). Widening the constraint to accept the value the trigger
-- already writes is the smallest change that unblocks authentication, and it
-- leaves the trigger in place for anything else sharing this database.

alter table public.profiles drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('user', 'admin', 'pm', 'developer'));
