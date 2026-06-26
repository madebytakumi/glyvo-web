import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { BOTTOM_NAV, type NavItem } from "./navItems";

const tabBase =
  "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors";

function Tab({ item }: { item: NavItem }) {
  const { t } = useTranslation("common");
  const { to, key, icon: Icon, end, highlight } = item;

  if (highlight) {
    // Elevated, prominent center tab (the primary action).
    return (
      <NavLink to={to} end={end} className="flex flex-1 flex-col items-center">
        {({ isActive }) => (
          <>
            <span
              className={cn(
                "-mt-7 flex size-14 items-center justify-center rounded-full text-primary-fg shadow-lg ring-4 ring-bg transition-transform",
                "bg-primary",
                isActive && "scale-105",
              )}
            >
              <Icon className="size-6" />
            </span>
            <span className="mt-1 text-xs font-semibold text-primary">
              {t(`nav.${key}`)}
            </span>
          </>
        )}
      </NavLink>
    );
  }

  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(tabBase, isActive ? "text-primary" : "text-muted")
      }
    >
      <Icon className="size-5" />
      {t(`nav.${key}`)}
    </NavLink>
  );
}

/** Bottom tab bar for mobile (hidden on lg+). */
export function BottomNav({ onMore }: { onMore: () => void }) {
  const { t } = useTranslation("common");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex items-end border-t border-border bg-surface/95 px-1 pb-[min(1.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      {BOTTOM_NAV.map((item) => (
        <Tab key={item.to} item={item} />
      ))}
      <button onClick={onMore} className={cn(tabBase, "text-muted")}>
        <MoreHorizontal className="size-5" />
        {t("nav.more")}
      </button>
    </nav>
  );
}
