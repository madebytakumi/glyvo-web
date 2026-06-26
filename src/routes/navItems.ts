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
  /** Center, elevated tab in the mobile bottom bar (the primary action). */
  highlight?: boolean;
}

/** Full navigation (sidebar / desktop). */
export const NAV_ITEMS: NavItem[] = [
  { to: "/", key: "dashboard", icon: LayoutDashboard, end: true },
  { to: "/glucose", key: "glucose", icon: Droplet, highlight: true },
  { to: "/meals", key: "meals", icon: Utensils },
  { to: "/medications", key: "medications", icon: Pill },
  { to: "/insulin", key: "insulin", icon: Syringe },
  { to: "/notes", key: "notes", icon: StickyNote },
  { to: "/reports", key: "reports", icon: BarChart3 },
  { to: "/settings", key: "settings", icon: Settings },
];

const byKey = (k: string): NavItem => {
  const item = NAV_ITEMS.find((i) => i.key === k);
  if (!item) throw new Error(`Unknown nav key: ${k}`);
  return item;
};

/**
 * Mobile bottom bar, in display order. Glucosa sits in the middle and is
 * highlighted — it's the app's most important action. The trailing "Más" entry
 * is rendered by BottomNav itself.
 */
export const BOTTOM_NAV: NavItem[] = [
  byKey("dashboard"),
  byKey("medications"),
  byKey("glucose"),
  byKey("insulin"),
];

/** Remaining destinations, shown in the "Más" sheet. */
export const MORE_NAV: NavItem[] = [
  byKey("meals"),
  byKey("notes"),
  byKey("reports"),
  byKey("settings"),
];
