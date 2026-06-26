import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/cn";
import { authService } from "@/features/auth/service";
import { Brand } from "@/components/Brand";
import { NAV_ITEMS } from "./navItems";

/** Persistent left navigation for desktop (lg+). */
export function Sidebar() {
  const { t } = useTranslation("common");
  const { t: tAuth } = useTranslation("auth");

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="px-5 py-5">
        <Brand />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map(({ to, key, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-fg"
                  : "text-muted hover:bg-primary-soft hover:text-text",
              )
            }
          >
            <Icon className="size-5 shrink-0" />
            {t(`nav.${key}`)}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={() => authService.signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-primary-soft hover:text-text"
        >
          <LogOut className="size-5 shrink-0" />
          {tAuth("signOut")}
        </button>
      </div>
    </aside>
  );
}
