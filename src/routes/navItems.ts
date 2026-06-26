import {
  LayoutDashboard,
  Droplet,
  Utensils,
  Syringe,
  Pill,
  StickyNote,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  /** i18n key under the `common.nav` namespace. */
  key: string;
  icon: LucideIcon;
  end?: boolean;
  /** Shown in the mobile bottom bar (the rest live in the "Más" sheet). */
  primary?: boolean;
}

/** Single source of truth for navigation (sidebar + bottom bar + more sheet). */
export const NAV_ITEMS: NavItem[] = [
  { to: "/", key: "dashboard", icon: LayoutDashboard, end: true, primary: true },
  { to: "/glucose", key: "glucose", icon: Droplet, primary: true },
  { to: "/meals", key: "meals", icon: Utensils, primary: true },
  { to: "/medications", key: "medications", icon: Pill, primary: true },
  { to: "/insulin", key: "insulin", icon: Syringe },
  { to: "/notes", key: "notes", icon: StickyNote },
  { to: "/reports", key: "reports", icon: BarChart3 },
  { to: "/settings", key: "settings", icon: Settings },
];

export const PRIMARY_NAV = NAV_ITEMS.filter((i) => i.primary);
export const SECONDARY_NAV = NAV_ITEMS.filter((i) => !i.primary);
