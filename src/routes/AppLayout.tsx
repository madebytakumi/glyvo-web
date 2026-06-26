import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { authService } from "@/features/auth/service";

interface NavItem {
  to: string;
  key: string;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: "/", key: "dashboard", end: true },
  { to: "/glucose", key: "glucose" },
  { to: "/meals", key: "meals" },
  { to: "/insulin", key: "insulin" },
  { to: "/medications", key: "medications" },
  { to: "/notes", key: "notes" },
  { to: "/reports", key: "reports" },
  { to: "/settings", key: "settings" },
];

export function AppLayout() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-lg font-bold text-primary">{t("appName")}</span>
          <button
            onClick={() => authService.signOut()}
            className="text-sm text-muted hover:text-text"
          >
            {t("nav.settings")}
          </button>
        </div>
        <nav className="mx-auto flex max-w-3xl gap-1 overflow-x-auto px-2 pb-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-fg"
                    : "text-muted hover:bg-primary-soft hover:text-text",
                )
              }
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
