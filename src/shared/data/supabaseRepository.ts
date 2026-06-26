import { supabase } from "@/lib/supabase";
import { newId } from "@/lib/id";
import { nowIso } from "@/lib/datetime";
import type { BaseEntity } from "@/shared/types/entity";

/** A raw row as returned by supabase-js (snake_case columns). */
export type DbRow = Record<string, any>;

/**
 * Per-domain mapping contract. Each feature supplies only its own column
 * translation and query hints; the base audit columns (id/user_id/timestamps/
 * deleted_at) are handled once here so the snake_case↔camelCase boundary lives
 * in a single place (consistency + DRY).
 */
export interface RowMapper<TDomain extends BaseEntity, TInput> {
  /** Remote table name. */
  table: string;
  /** Column used for default ordering. */
  orderColumn: string;
  /** Order direction (default: descending). */
  orderAscending?: boolean;
  /** Optional column for date-range queries (e.g. measured_at). */
  rangeColumn?: string;
  /** Text columns searched with ILIKE (omit numeric columns). */
  searchColumns?: string[];
  /** Domain input → domain-specific row columns (snake_case). */
  toRow(input: TInput): DbRow;
  /** Row → domain-specific fields (base fields are added automatically). */
  fromRow(row: DbRow): Omit<TDomain, keyof BaseEntity>;
}

function mapBase(row: DbRow): BaseEntity {
  return {
    id: row.id,
    userId: row.user_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}

/**
 * Builds an online-first repository backed by Supabase. The shape mirrors the
 * SQLite repositories in glyvo-app (insert/update/softDelete/getById/list…) but
 * every method is async and talks directly to Postgres (RLS scopes rows by
 * user). This is the single place that performs IO for a domain (SRP).
 */
export function createSupabaseRepository<TDomain extends BaseEntity, TInput>(
  mapper: RowMapper<TDomain, TInput>,
) {
  const {
    table,
    orderColumn,
    orderAscending = false,
    rangeColumn,
    searchColumns = [],
  } = mapper;

  const order = { ascending: orderAscending } as const;
  const fromRow = (row: DbRow): TDomain =>
    ({ ...mapBase(row), ...mapper.fromRow(row) }) as TDomain;

  async function listByUser(userId: string): Promise<TDomain[]> {
    const { data, error } = await supabase
      .from(table)
      .select()
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order(orderColumn, order);
    if (error) throw error;
    return (data ?? []).map(fromRow);
  }

  return {
    async insert(userId: string, input: TInput): Promise<TDomain> {
      const ts = nowIso();
      const row: DbRow = {
        id: newId(),
        user_id: userId,
        created_at: ts,
        updated_at: ts,
        deleted_at: null,
        ...mapper.toRow(input),
      };
      const { data, error } = await supabase
        .from(table)
        .insert(row)
        .select()
        .single();
      if (error) throw error;
      return fromRow(data);
    },

    async update(id: string, input: TInput): Promise<TDomain> {
      const row: DbRow = { ...mapper.toRow(input), updated_at: nowIso() };
      const { data, error } = await supabase
        .from(table)
        .update(row)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return fromRow(data);
    },

    async softDelete(id: string): Promise<void> {
      const ts = nowIso();
      const { error } = await supabase
        .from(table)
        .update({ deleted_at: ts, updated_at: ts })
        .eq("id", id);
      if (error) throw error;
    },

    async getById(id: string): Promise<TDomain | null> {
      const { data, error } = await supabase
        .from(table)
        .select()
        .eq("id", id)
        .is("deleted_at", null)
        .maybeSingle();
      if (error) throw error;
      return data ? fromRow(data) : null;
    },

    listByUser,

    async listForRange(
      userId: string,
      startIso: string,
      endIso: string,
    ): Promise<TDomain[]> {
      if (!rangeColumn) return listByUser(userId);
      const { data, error } = await supabase
        .from(table)
        .select()
        .eq("user_id", userId)
        .is("deleted_at", null)
        .gte(rangeColumn, startIso)
        .lte(rangeColumn, endIso)
        .order(orderColumn, order);
      if (error) throw error;
      return (data ?? []).map(fromRow);
    },

    async search(userId: string, query: string): Promise<TDomain[]> {
      const trimmed = query.trim();
      if (trimmed.length === 0 || searchColumns.length === 0) {
        return listByUser(userId);
      }
      const orFilter = searchColumns
        .map((c) => `${c}.ilike.%${trimmed}%`)
        .join(",");
      const { data, error } = await supabase
        .from(table)
        .select()
        .eq("user_id", userId)
        .is("deleted_at", null)
        .or(orFilter)
        .order(orderColumn, order);
      if (error) throw error;
      return (data ?? []).map(fromRow);
    },
  };
}

export type SupabaseRepository<
  TDomain extends BaseEntity,
  TInput,
> = ReturnType<typeof createSupabaseRepository<TDomain, TInput>>;
