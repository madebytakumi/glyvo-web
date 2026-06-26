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

const STAGGER_MS = 35;
const RADIUS = 120; // distance from the FAB center to each item

/**
 * Android/Material-style floating action button (bottom-right) that fans its
 * quick actions out in a quarter-circle arc (toward the upper-left) with a
 * staggered enter/exit animation. Items stay mounted so both directions animate.
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

      <div className="fixed bottom-20 right-4 z-40 size-14 lg:bottom-6 lg:right-6">
        {ACTIONS.map(({ key, to, icon: Icon }, index) => {
          // Spread items from straight up (90°) to straight left (180°).
          const angle = ((90 + (index * 90) / (count - 1)) * Math.PI) / 180;
          const x = open ? Math.cos(angle) * RADIUS : 0;
          const y = open ? -Math.sin(angle) * RADIUS : 0;
          const delay = (open ? index : count - 1 - index) * STAGGER_MS;
          const label = t(key);

          return (
            <button
              key={to}
              title={label}
              aria-label={label}
              tabIndex={open ? 0 : -1}
              onClick={() => go(to)}
              style={{
                transform: `translate(${x}px, ${y}px) scale(${open ? 1 : 0.3})`,
                transitionDelay: `${delay}ms`,
              }}
              className={cn(
                "absolute bottom-1.5 right-1.5 flex size-11 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-md",
                "transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
                "hover:bg-primary-soft",
                open ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Icon className="size-5" />
            </button>
          );
        })}

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={t("quickActions")}
          aria-expanded={open}
          className="relative flex size-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lg transition-transform duration-200 ease-out active:scale-95 motion-reduce:transition-none"
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
