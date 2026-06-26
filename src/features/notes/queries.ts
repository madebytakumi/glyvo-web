import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { notesRepository } from "./repository";
import type { NoteInput } from "./model";

export const noteKeys = {
  all: ["notes"] as const,
  search: (userId: string, q: string) => ["notes", "search", userId, q] as const,
  detail: (id: string) => ["notes", "detail", id] as const,
};

function useUserId(): string | null {
  return useAuthStore((s) => s.user?.id ?? null);
}

export function useNoteList(search = "") {
  const userId = useUserId();
  return useQuery({
    queryKey: userId ? noteKeys.search(userId, search) : ["notes", "disabled"],
    queryFn: () => notesRepository.search(userId as string, search),
    enabled: !!userId,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => notesRepository.getById(id),
  });
}

export function useCreateNote() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: NoteInput) =>
      notesRepository.insert(userId as string, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: NoteInput }) =>
      notesRepository.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  });
}

export function useDeleteNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notesRepository.softDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.all }),
  });
}
