import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { glucoseService } from "./instance";
import type { GlucoseInput } from "./model";

export const glucoseKeys = {
  all: ["glucose"] as const,
  search: (userId: string, q: string) => ["glucose", "search", userId, q] as const,
  detail: (id: string) => ["glucose", "detail", id] as const,
  dailyStats: (userId: string) => ["glucose", "dailyStats", userId] as const,
};

function useUserId(): string | null {
  return useAuthStore((s) => s.user?.id ?? null);
}

export function useGlucoseList(search = "") {
  const userId = useUserId();
  return useQuery({
    queryKey: userId ? glucoseKeys.search(userId, search) : ["glucose", "disabled"],
    queryFn: () => glucoseService.search(userId as string, search),
    enabled: !!userId,
  });
}

export function useGlucoseReading(id: string) {
  return useQuery({
    queryKey: glucoseKeys.detail(id),
    queryFn: () => glucoseService.get(id),
  });
}

export function useGlucoseTrend(days = 7) {
  const userId = useUserId();
  return useQuery({
    queryKey: userId
      ? (["glucose", "trend", userId, days] as const)
      : ["glucose", "disabled"],
    queryFn: () => glucoseService.trend(userId as string, days),
    enabled: !!userId,
  });
}

export function useGlucoseDailyStats() {
  const userId = useUserId();
  return useQuery({
    queryKey: userId ? glucoseKeys.dailyStats(userId) : ["glucose", "disabled"],
    queryFn: () => glucoseService.dailyStats(userId as string),
    enabled: !!userId,
  });
}

export function useCreateGlucose() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: GlucoseInput) =>
      glucoseService.create(userId as string, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: glucoseKeys.all }),
  });
}

export function useUpdateGlucose() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: GlucoseInput }) =>
      glucoseService.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: glucoseKeys.all }),
  });
}

export function useDeleteGlucose() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => glucoseService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: glucoseKeys.all }),
  });
}
