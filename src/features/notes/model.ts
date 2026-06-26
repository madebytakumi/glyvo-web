import type { BaseEntity } from "@/shared/types/entity";

/** A health note (domain model). Tags are stored comma-separated. */
export interface Note extends BaseEntity {
  title: string | null;
  content: string;
  noteAt: string;
  tags: string | null;
}

/** Fields the user provides when creating/editing a note. */
export interface NoteInput {
  title?: string | null;
  content: string;
  noteAt: string;
  tags?: string | null;
}

export const NOTE_CONTENT_MAX = 4000;

/** Parse the comma-separated tags string into a trimmed, de-duped list. */
export function parseTags(tags: string | null | undefined): string[] {
  if (!tags) return [];
  const seen = new Set<string>();
  for (const raw of tags.split(",")) {
    const tag = raw.trim();
    if (tag) seen.add(tag);
  }
  return [...seen];
}

/** Normalize a free-text tags input back into a clean comma-separated string. */
export function normalizeTags(tags: string | null | undefined): string | null {
  const list = parseTags(tags);
  return list.length > 0 ? list.join(", ") : null;
}
