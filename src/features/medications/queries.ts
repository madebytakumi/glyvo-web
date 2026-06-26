import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { medicationsService } from "./instance";
import type {
  DoseOccurrence,
  MedicationInput,
  ScheduleInput,
} from "./model";

export const medKeys = {
  all: ["medications"] as const,
  list: (userId: string) => ["medications", "list", userId] as const,
  detail: (id: string) => ["medications", "detail", id] as const,
  schedules: (medicationId: string) =>
    ["medications", "schedules", medicationId] as const,
  today: (userId: string) => ["medications", "today", userId] as const,
};

function useUserId(): string | null {
  return useAuthStore((s) => s.user?.id ?? null);
}

export function useMedications() {
  const userId = useUserId();
  return useQuery({
    queryKey: userId ? medKeys.list(userId) : ["medications", "disabled"],
    queryFn: () => medicationsService.listMedications(userId as string),
    enabled: !!userId,
  });
}

export function useMedication(id: string) {
  return useQuery({
    queryKey: medKeys.detail(id),
    queryFn: () => medicationsService.getMedication(id),
    enabled: !!id,
  });
}

export function useSchedules(medicationId: string) {
  return useQuery({
    queryKey: medKeys.schedules(medicationId),
    queryFn: () => medicationsService.listSchedules(medicationId),
    enabled: !!medicationId,
  });
}

export function useTodayDoses() {
  const userId = useUserId();
  return useQuery({
    queryKey: userId ? medKeys.today(userId) : ["medications", "disabled"],
    queryFn: () => medicationsService.todayDoses(userId as string),
    enabled: !!userId,
  });
}

/** Adherence over the trailing `days` window (including today). */
export function useAdherence(days = 7) {
  const userId = useUserId();
  return useQuery({
    queryKey: userId
      ? (["medications", "adherence", userId, days] as const)
      : ["medications", "disabled"],
    queryFn: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - (days - 1));
      return medicationsService.adherence(userId as string, start, end);
    },
    enabled: !!userId,
  });
}

export function useCreateMedication() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MedicationInput) =>
      medicationsService.createMedication(userId as string, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: medKeys.all }),
  });
}

export function useUpdateMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MedicationInput }) =>
      medicationsService.updateMedication(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: medKeys.all }),
  });
}

export function useDeleteMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicationsService.removeMedication(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: medKeys.all }),
  });
}

export function useCreateSchedule() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ScheduleInput) =>
      medicationsService.createSchedule(userId as string, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: medKeys.all }),
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: string;
      input: Omit<ScheduleInput, "medicationId">;
    }) => medicationsService.updateSchedule(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: medKeys.all }),
  });
}

export function useDeleteSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => medicationsService.removeSchedule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: medKeys.all }),
  });
}

export function useMarkDose() {
  const userId = useUserId();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      occurrence,
      status,
    }: {
      occurrence: DoseOccurrence;
      status: "taken" | "skipped";
    }) =>
      status === "taken"
        ? medicationsService.markTaken(userId as string, occurrence)
        : medicationsService.markSkipped(userId as string, occurrence),
    onSuccess: () => qc.invalidateQueries({ queryKey: medKeys.all }),
  });
}

export function useClearDose() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (occurrence: DoseOccurrence) =>
      medicationsService.clearIntake(occurrence),
    onSuccess: () => qc.invalidateQueries({ queryKey: medKeys.all }),
  });
}
