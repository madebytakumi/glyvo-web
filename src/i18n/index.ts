import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {
  resources,
  defaultNS,
  supportedLanguages,
  type AppLanguage,
} from "@/locales";

const STORAGE_KEY = "glyvo.lang";

/** Resolve the language: stored preference → browser → Spanish (default). */
export function resolveInitialLanguage(): AppLanguage {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (supportedLanguages as readonly string[]).includes(stored)) {
    return stored as AppLanguage;
  }
  const browser = navigator.language.split("-")[0];
  return (supportedLanguages as readonly string[]).includes(browser)
    ? (browser as AppLanguage)
    : "es";
}

/** Persist and apply a language change. */
export function setLanguage(lang: AppLanguage): void {
  localStorage.setItem(STORAGE_KEY, lang);
  void i18n.changeLanguage(lang);
}

i18n.use(initReactI18next).init({
  resources,
  defaultNS,
  ns: Object.keys(resources.es),
  lng: resolveInitialLanguage(),
  fallbackLng: "es",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
