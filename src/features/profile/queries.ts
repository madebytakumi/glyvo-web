import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { DEFAULT_THRESHOLDS, type GlucoseThresholds } from "@/features/glucose/zones";
import { profileRepository } from "./repository";

const KEY = "profileGlucoseThresholds";

function useUserId(): string | null {
  return useAuthStore((s) => s.user?.id ?? null);
}

/** Current user's glucose thresholds (falls back to app defaults). */
export function useGlucoseThresholds(): GlucoseThresholds {
  const userId = useUserId();
  const { data } = useQuery({
    queryKey: userId ? [KEY, userId] : [KEY, "disabled"],
    queryFn: () => profileRepository.getThresholds(userId as string),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });
  return data ?? DEFAULT_THRESHOLDS;
}

export function useUpdateGlucoseThresholds() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (thresholds: GlucoseThresholds) =>
      profileRepository.saveThresholds(userId as string, thresholds),
    onSuccess: () => qc.invalidateQueries({ queryKey: [KEY] }),
  });
}
