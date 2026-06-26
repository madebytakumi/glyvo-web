import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ListItemProps {
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

/** A tappable row inside a list; renders as a button when `onClick` is given. */
export function ListItem({ onClick, className, children }: ListItemProps) {
  const base = cn(
    "flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left",
    onClick && "transition-colors hover:border-primary",
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={base}>
        {children}
      </button>
    );
  }
  return <div className={base}>{children}</div>;
}
