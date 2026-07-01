-- Per-user glucose zone thresholds, stored on the profile.
-- ---------------------------------------------------------------------------
-- Adds nullable columns to public.profiles so each user can set their own
-- baja/normal/alta boundaries (crítica is derived: > glucose_critical). NULL
-- means "use the app defaults". A unique index on user_id enforces one profile
-- per user. RLS (owner-only) already exists from 0001_init.
-- ---------------------------------------------------------------------------

alter table public.profiles
  add column if not exists glucose_low integer,
  add column if not exists glucose_high integer,
  add column if not exists glucose_critical integer;

create unique index if not exists profiles_user_id_key
  on public.profiles (user_id);
