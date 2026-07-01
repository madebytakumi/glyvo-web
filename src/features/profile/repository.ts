import { supabase } from "@/lib/supabase";
import { newId } from "@/lib/id";
import { nowIso } from "@/lib/datetime";
import type { GlucoseThresholds } from "@/features/glucose/zones";

/**
 * Profile-backed settings. Currently just the per-user glucose thresholds,
 * stored on public.profiles (one row per user, guarded by RLS). NULL columns
 * mean "use the app defaults".
 */
export const profileRepository = {
  async getThresholds(userId: string): Promise<GlucoseThresholds | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("glucose_low, glucose_high, glucose_critical")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (
      data &&
      data.glucose_low != null &&
      data.glucose_high != null &&
      data.glucose_critical != null
    ) {
      return {
        low: data.glucose_low,
        high: data.glucose_high,
        critical: data.glucose_critical,
      };
    }
    return null;
  },

  async saveThresholds(userId: string, t: GlucoseThresholds): Promise<void> {
    const cols = {
      glucose_low: t.low,
      glucose_high: t.high,
      glucose_critical: t.critical,
    };
    // get-then-write so we don't clobber created_at / other profile fields.
    const { data: existing, error: getErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (getErr) throw getErr;

    if (existing) {
      const { error } = await supabase
        .from("profiles")
        .update({ ...cols, updated_at: nowIso() })
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const ts = nowIso();
      const { error } = await supabase.from("profiles").insert({
        id: newId(),
        user_id: userId,
        created_at: ts,
        updated_at: ts,
        ...cols,
      });
      if (error) throw error;
    }
  },
};
