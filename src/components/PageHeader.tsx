import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /** Optional leading accent (e.g. a module icon). */
  icon?: ReactNode;
  /** Optional right-aligned action (e.g. an "Add" button). */
  action?: ReactNode;
}

export function PageHeader({ title, icon, action }: PageHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h1 className="flex items-center gap-2 text-2xl font-semibold text-text">
        {icon && <span className="text-primary">{icon}</span>}
        {title}
      </h1>
      {action}
    </div>
  );
}
