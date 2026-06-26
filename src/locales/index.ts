import esCommon from "./es/common.json";
import esAuth from "./es/auth.json";
import esDashboard from "./es/dashboard.json";
import esGlucose from "./es/glucose.json";
import esMeals from "./es/meals.json";
import esInsulin from "./es/insulin.json";
import esNotes from "./es/notes.json";
import esMedications from "./es/medications.json";
import esReports from "./es/reports.json";
import esSettings from "./es/settings.json";
import esSync from "./es/sync.json";
import esOnboarding from "./es/onboarding.json";

import enCommon from "./en/common.json";
import enAuth from "./en/auth.json";
import enDashboard from "./en/dashboard.json";
import enGlucose from "./en/glucose.json";
import enMeals from "./en/meals.json";
import enInsulin from "./en/insulin.json";
import enNotes from "./en/notes.json";
import enMedications from "./en/medications.json";
import enReports from "./en/reports.json";
import enSettings from "./en/settings.json";
import enSync from "./en/sync.json";
import enOnboarding from "./en/onboarding.json";

export const resources = {
  es: {
    common: esCommon,
    auth: esAuth,
    dashboard: esDashboard,
    glucose: esGlucose,
    meals: esMeals,
    insulin: esInsulin,
    notes: esNotes,
    medications: esMedications,
    reports: esReports,
    settings: esSettings,
    sync: esSync,
    onboarding: esOnboarding,
  },
  en: {
    common: enCommon,
    auth: enAuth,
    dashboard: enDashboard,
    glucose: enGlucose,
    meals: enMeals,
    insulin: enInsulin,
    notes: enNotes,
    medications: enMedications,
    reports: enReports,
    settings: enSettings,
    sync: enSync,
    onboarding: enOnboarding,
  },
} as const;

export const defaultNS = "common";
export const supportedLanguages = ["es", "en"] as const;
export type AppLanguage = (typeof supportedLanguages)[number];
