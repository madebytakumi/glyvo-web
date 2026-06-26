import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { reportsService } from "./service";
import type { ReportRangeKind } from "./model";

export function useReport(kind: ReportRangeKind) {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  return useQuery({
    queryKey: userId ? (["reports", userId, kind] as const) : ["reports", "disabled"],
    queryFn: () => reportsService.build(userId as string, kind),
    enabled: !!userId,
  });
}
