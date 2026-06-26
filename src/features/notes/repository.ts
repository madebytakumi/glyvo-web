import {
  createSupabaseRepository,
  type RowMapper,
} from "@/shared/data/supabaseRepository";
import { normalizeTags, type Note, type NoteInput } from "./model";

const noteMapper: RowMapper<Note, NoteInput> = {
  table: "health_notes",
  orderColumn: "note_at",
  rangeColumn: "note_at",
  searchColumns: ["title", "content", "tags"],
  toRow: (input) => ({
    title: input.title?.trim() ? input.title.trim() : null,
    content: input.content,
    note_at: input.noteAt,
    tags: normalizeTags(input.tags),
  }),
  fromRow: (row) => ({
    title: row.title ?? null,
    content: row.content,
    noteAt: row.note_at,
    tags: row.tags ?? null,
  }),
};

export const notesRepository = createSupabaseRepository(noteMapper);
