import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Droplet,
  Utensils,
  Syringe,
  Pill,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

interface QuickAction {
  key: string;
  to: string;
  icon: LucideIcon;
}

const ACTIONS: QuickAction[] = [
  { key: "registerGlucose", to: "/glucose/new", icon: Droplet },
  { key: "registerMeal", to: "/meals/new", icon: Utensils },
  { key: "registerInsulin", to: "/insulin/new", icon: Syringe },
  { key: "markMedicationTaken", to: "/medications", icon: Pill },
  { key: "addNote", to: "/notes/new", icon: StickyNote },
];

/**
 * Android-style floating action button (bottom-right) that expands into a
 * speed-dial of quick record actions. Sits above the mobile bottom bar.
 */
export function QuickActionsFab() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setOpen(false)}
          role="presentation"
        />
      )}

      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
        {open && (
          <ul className="flex flex-col items-end gap-3">
            {ACTIONS.map(({ key, to, icon: Icon }) => (
              <li key={to} className="flex items-center gap-2">
                <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-sm font-medium shadow-sm">
                  {t(key)}
                </span>
                <button
                  onClick={() => go(to)}
                  className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-md transition-colors hover:bg-primary-soft"
                >
                  <Icon className="size-5" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={t("quickActions")}
          aria-expanded={open}
          className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg transition-transform active:scale-95"
        >
          <Plus className={cn("size-7 transition-transform", open && "rotate-45")} />
        </button>
      </div>
    </>
  );
}
