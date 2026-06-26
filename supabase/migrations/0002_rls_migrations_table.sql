-- Enable RLS on the migrations control table.
-- ---------------------------------------------------------------------------
-- `glyvo_schema_migrations` is the bookkeeping table created by the migration
-- runner (glyvo-app/scripts/apply-migrations.mjs) to record which .sql files
-- have been applied. It is not application data, but as a public table without
-- RLS it is reachable via the REST API with the anon key (Supabase Security
-- Advisor flags it). Enabling RLS with NO policies denies anon/authenticated;
-- the migration runner connects as the table owner and bypasses RLS, so this
-- does not affect migrations.
-- Guarded with to_regclass so it is a no-op if the table doesn't exist yet.
-- ---------------------------------------------------------------------------

do $$
begin
  if to_regclass('public.glyvo_schema_migrations') is not null then
    execute 'alter table public.glyvo_schema_migrations enable row level security';
  end if;
end $$;
