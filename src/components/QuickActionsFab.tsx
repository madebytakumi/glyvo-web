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

const STAGGER_MS = 30;

/**
 * Android/Material-style floating action button (bottom-right) that expands into
 * a speed-dial of quick record actions with a staggered enter/exit animation.
 * Items stay mounted (hidden via classes) so both opening and closing animate.
 */
export function QuickActionsFab() {
  const { t } = useTranslation("dashboard");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  const count = ACTIONS.length;

  return (
    <>
      {/* Scrim: fades both ways, only intercepts clicks while open. */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/10 transition-opacity duration-200 motion-reduce:transition-none",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        role="presentation"
      />

      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
        <ul className="flex flex-col items-end gap-3">
          {ACTIONS.map(({ key, to, icon: Icon }, index) => {
            // Items nearest the FAB lead on open and trail on close.
            const delay = (open ? count - 1 - index : index) * STAGGER_MS;
            return (
              <li
                key={to}
                className={cn(
                  "flex origin-bottom-right items-center gap-2 transition-all duration-200 ease-out motion-reduce:transition-none",
                  open
                    ? "translate-y-0 scale-100 opacity-100"
                    : "pointer-events-none translate-y-2 scale-90 opacity-0",
                )}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <span className="rounded-lg border border-border bg-card px-2.5 py-1 text-sm font-medium shadow-sm">
                  {t(key)}
                </span>
                <button
                  tabIndex={open ? 0 : -1}
                  onClick={() => go(to)}
                  className="flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-md transition-colors hover:bg-primary-soft"
                >
                  <Icon className="size-5" />
                </button>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={t("quickActions")}
          aria-expanded={open}
          className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg transition-transform duration-200 ease-out active:scale-95 motion-reduce:transition-none"
        >
          <Plus
            className={cn(
              "size-7 transition-transform duration-300 ease-out motion-reduce:transition-none",
              open && "rotate-[135deg]",
            )}
          />
        </button>
      </div>
    </>
  );
}
