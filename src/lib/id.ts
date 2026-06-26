/** Generate a UUID for new rows (Supabase `id` columns are `uuid`). */
export function newId(): string {
  return crypto.randomUUID();
}
