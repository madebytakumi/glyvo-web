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
const RADIUS = 92; // distance from the FAB center to each item
// Arc sweep (degrees): from near-straight-up to near-straight-left. Slightly
// wider than a quarter so the items keep their spacing at this shorter radius.
const ARC_START = 78;
const ARC_END = 192;

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
          // Spread items along the arc from near-up to near-left.
          const deg = ARC_START + (index * (ARC_END - ARC_START)) / (count - 1);
          const angle = (deg * Math.PI) / 180;
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
                "absolute bottom-2 right-2 flex size-10 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-md",
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
