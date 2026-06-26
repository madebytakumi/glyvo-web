/**
 * Audit + soft-delete fields shared by every domain entity. Dates are ISO 8601
 * strings. The web app talks to Supabase directly, so the local-only sync
 * bookkeeping columns from glyvo-app (syncStatus/lastSyncedAt) are dropped.
 */
export interface BaseEntity {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
