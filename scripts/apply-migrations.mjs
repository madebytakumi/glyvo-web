#!/usr/bin/env node
/**
 * Applies the SQL files in supabase/migrations/ to your Supabase Postgres
 * database, in filename order, each inside a transaction.
 *
 * Idempotent: a control table (glyvo_schema_migrations) records which files
 * have run, so re-running only applies new ones. Safe to run repeatedly.
 *
 * Requires SUPABASE_DB_URL in .env — the database connection string from
 * Supabase → Project Settings → Database → "Connection string" (URI). It holds
 * the DB password, so it must NOT be VITE_-prefixed and must never be committed
 * (.env is gitignored).
 *
 * Usage: npm run db:migrate
 */
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = resolve(__dirname, "../supabase/migrations");

const connectionString = process.env.SUPABASE_DB_URL;
if (!connectionString) {
  console.error(
    "\n✗ Missing SUPABASE_DB_URL in .env\n" +
      "  Get it from Supabase → Project Settings → Database → Connection string (URI),\n" +
      "  e.g. postgresql://postgres:[PASSWORD]@db.<ref>.supabase.co:5432/postgres\n",
  );
  process.exit(1);
}

const CONTROL_TABLE = "glyvo_schema_migrations";

async function main() {
  const client = new pg.Client({
    connectionString,
    // Supabase requires SSL; the managed cert isn't in Node's trust store.
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query(
      `create table if not exists public.${CONTROL_TABLE} (
         name text primary key,
         applied_at timestamptz not null default now()
       );`,
    );

    // Enable RLS on the control table so it isn't exposed via the REST API with
    // the anon key (Supabase Security Advisor flags public tables without RLS).
    // No policies are needed: this connection is the table owner and bypasses
    // RLS, while anon/authenticated get denied by default. Idempotent.
    await client.query(
      `alter table public.${CONTROL_TABLE} enable row level security;`,
    );

    const applied = new Set(
      (await client.query(`select name from public.${CONTROL_TABLE};`)).rows.map(
        (r) => r.name,
      ),
    );

    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const pending = files.filter((f) => !applied.has(f));
    if (pending.length === 0) {
      console.log("✓ Database is up to date — no pending migrations.");
      return;
    }

    for (const file of pending) {
      const sql = readFileSync(join(migrationsDir, file), "utf8");
      process.stdout.write(`→ Applying ${file} … `);
      try {
        await client.query("begin");
        await client.query(sql);
        await client.query(
          `insert into public.${CONTROL_TABLE} (name) values ($1);`,
          [file],
        );
        await client.query("commit");
        console.log("done");
      } catch (err) {
        await client.query("rollback");
        console.log("failed");
        throw err;
      }
    }

    console.log(`\n✓ Applied ${pending.length} migration(s).`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(`\n✗ Migration failed: ${err.message}`);
  process.exit(1);
});
