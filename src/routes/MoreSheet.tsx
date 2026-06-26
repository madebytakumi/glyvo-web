import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { MORE_NAV } from "./navItems";

interface MoreSheetProps {
  open: boolean;
  onClose: () => void;
}

/** Bottom sheet with the secondary destinations (mobile "Más"). */
export function MoreSheet({ open, onClose }: MoreSheetProps) {
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-end bg-black/40 lg:hidden"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full rounded-t-2xl border-t border-border bg-card p-3"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <nav className="grid grid-cols-2 gap-2 pb-2">
          {MORE_NAV.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-fg"
                    : "bg-primary-soft/40 text-text hover:bg-primary-soft",
                )
              }
            >
              <Icon className="size-5 shrink-0" />
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
