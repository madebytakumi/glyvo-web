import { QueryClient } from "@tanstack/react-query";

/**
 * App-wide TanStack Query client. Data lives in Supabase (online-first), so we
 * keep results fresh briefly and let mutations invalidate the relevant keys.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
