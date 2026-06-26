import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { insulinRepository } from "./repository";
import type { InsulinInput } from "./model";

export const insulinKeys = {
  all: ["insulin"] as const,
  search: (userId: string, q: string) => ["insulin", "search", userId, q] as const,
  detail: (id: string) => ["insulin", "detail", id] as const,
};

function useUserId(): string | null {
  return useAuthStore((s) => s.user?.id ?? null);
}

export function useInsulinList(search = "") {
  const userId = useUserId();
  return useQuery({
    queryKey: userId ? insulinKeys.search(userId, search) : ["insulin", "disabled"],
    queryFn: () => insulinRepository.search(userId as string, search),
    enabled: !!userId,
  });
}

export function useInsulinLog(id: string) {
  return useQuery({
    queryKey: insulinKeys.detail(id),
    queryFn: () => insulinRepository.getById(id),
  });
}

export function useCreateInsulin() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: InsulinInput) =>
      insulinRepository.insert(userId as string, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: insulinKeys.all }),
  });
}

export function useUpdateInsulin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: InsulinInput }) =>
      insulinRepository.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: insulinKeys.all }),
  });
}

export function useDeleteInsulin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => insulinRepository.softDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: insulinKeys.all }),
  });
}
