import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";
import { PRIMARY_NAV } from "./navItems";

const itemBase =
  "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium transition-colors";

/** Bottom tab bar for mobile (hidden on lg+). */
export function BottomNav({ onMore }: { onMore: () => void }) {
  const { t } = useTranslation("common");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-border bg-surface/95 backdrop-blur lg:hidden">
      {PRIMARY_NAV.map(({ to, key, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn(itemBase, isActive ? "text-primary" : "text-muted")
          }
        >
          <Icon className="size-5" />
          {t(`nav.${key}`)}
        </NavLink>
      ))}
      <button onClick={onMore} className={cn(itemBase, "text-muted")}>
        <MoreHorizontal className="size-5" />
        {t("nav.more")}
      </button>
    </nav>
  );
}
