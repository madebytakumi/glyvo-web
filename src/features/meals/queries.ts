import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { mealsRepository } from "./repository";
import type { MealInput } from "./model";

export const mealKeys = {
  all: ["meals"] as const,
  search: (userId: string, q: string) => ["meals", "search", userId, q] as const,
  detail: (id: string) => ["meals", "detail", id] as const,
};

function useUserId(): string | null {
  return useAuthStore((s) => s.user?.id ?? null);
}

export function useMealList(search = "") {
  const userId = useUserId();
  return useQuery({
    queryKey: userId ? mealKeys.search(userId, search) : ["meals", "disabled"],
    queryFn: () => mealsRepository.search(userId as string, search),
    enabled: !!userId,
  });
}

export function useMeal(id: string) {
  return useQuery({
    queryKey: mealKeys.detail(id),
    queryFn: () => mealsRepository.getById(id),
  });
}

export function useCreateMeal() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MealInput) =>
      mealsRepository.insert(userId as string, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: mealKeys.all }),
  });
}

export function useUpdateMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MealInput }) =>
      mealsRepository.update(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: mealKeys.all }),
  });
}

export function useDeleteMeal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => mealsRepository.softDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: mealKeys.all }),
  });
}
