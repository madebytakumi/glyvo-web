import {
  intakeRepository,
  medicationsRepository,
  schedulesRepository,
} from "./repository";
import { createMedicationsService } from "./service";

/** App-wired medications service singleton (real Supabase repos). */
export const medicationsService = createMedicationsService(
  medicationsRepository,
  schedulesRepository,
  intakeRepository,
);
