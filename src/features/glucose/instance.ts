import { glucoseRepository } from "./repository";
import { createGlucoseService } from "./service";

/** App-wired glucose service singleton (real Supabase repository). */
export const glucoseService = createGlucoseService(glucoseRepository);
