-- Glyvo Web schema (online-first, no local sync).
-- ---------------------------------------------------------------------------
-- Canonical schema for the PWA. Mirrors the tables the app reads/writes, minus
-- the reminders module (dropped). Every table carries audit + soft-delete
-- columns; `updated_at` is set by the client. Row Level Security isolates each
-- user to their own rows via auth.uid().
-- ---------------------------------------------------------------------------

-- PROFILES -------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  display_name text,
  units text not null default 'mg/dL',
  disclaimer_accepted_at timestamptz
);

-- GLUCOSE READINGS -----------------------------------------------------------
create table if not exists public.glucose_readings (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  value integer not null,
  type text not null,            -- ayuno | antes_comer | despues_comer | antes_dormir | aleatoria
  measured_at timestamptz not null,
  notes text
);

-- MEALS ----------------------------------------------------------------------
create table if not exists public.meals (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  type text not null,            -- desayuno | comida | cena | snack
  description text,
  meal_at timestamptz not null,
  notes text
);

-- INSULIN LOGS ---------------------------------------------------------------
create table if not exists public.insulin_logs (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  name text not null,
  units numeric(6, 2) not null,
  administered_at timestamptz not null,
  notes text
);

-- MEDICATIONS (catalog) ------------------------------------------------------
create table if not exists public.medications (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  name text not null,
  dosage text,
  instructions text,
  active boolean not null default true,
  start_date date,
  end_date date
);

-- MEDICATION SCHEDULES -------------------------------------------------------
create table if not exists public.medication_schedules (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  medication_id uuid not null,
  time text not null,            -- HH:MM (local)
  frequency text not null,       -- daily | specific_days
  days_of_week text,             -- CSV of 0-6 when frequency = specific_days
  active boolean not null default true
);

-- MEDICATION INTAKE LOGS -----------------------------------------------------
create table if not exists public.medication_intake_logs (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  medication_id uuid not null,
  scheduled_time timestamptz not null,
  actual_intake_time timestamptz,
  status text not null default 'pending'  -- pending | taken | skipped | missed
);

-- HEALTH NOTES ---------------------------------------------------------------
create table if not exists public.health_notes (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted_at timestamptz,
  title text,
  content text not null,
  note_at timestamptz not null,
  tags text
);

-- INDEXES --------------------------------------------------------------------
create index if not exists idx_profiles_user on public.profiles (user_id);

create index if not exists idx_glucose_user on public.glucose_readings (user_id);
create index if not exists idx_glucose_measured on public.glucose_readings (user_id, measured_at);

create index if not exists idx_meals_user on public.meals (user_id);
create index if not exists idx_meals_at on public.meals (user_id, meal_at);

create index if not exists idx_insulin_user on public.insulin_logs (user_id);
create index if not exists idx_insulin_at on public.insulin_logs (user_id, administered_at);

create index if not exists idx_medications_user on public.medications (user_id);

create index if not exists idx_med_schedules_user on public.medication_schedules (user_id);

create index if not exists idx_med_intake_user on public.medication_intake_logs (user_id);
create index if not exists idx_med_intake_sched on public.medication_intake_logs (user_id, scheduled_time);

create index if not exists idx_notes_user on public.health_notes (user_id);
create index if not exists idx_notes_at on public.health_notes (user_id, note_at);

-- ROW LEVEL SECURITY ---------------------------------------------------------
do $$
declare
  tbl text;
  tables text[] := array[
    'profiles', 'glucose_readings', 'meals', 'insulin_logs', 'medications',
    'medication_schedules', 'medication_intake_logs', 'health_notes'
  ];
begin
  foreach tbl in array tables loop
    execute format('alter table public.%I enable row level security;', tbl);

    execute format(
      'create policy %I on public.%I for select using (auth.uid() = user_id);',
      tbl || '_select', tbl
    );
    execute format(
      'create policy %I on public.%I for insert with check (auth.uid() = user_id);',
      tbl || '_insert', tbl
    );
    execute format(
      'create policy %I on public.%I for update using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      tbl || '_update', tbl
    );
    execute format(
      'create policy %I on public.%I for delete using (auth.uid() = user_id);',
      tbl || '_delete', tbl
    );
  end loop;
end $$;
