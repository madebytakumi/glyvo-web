import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  /** Optional right-aligned action (e.g. an "Add" button). */
  action?: ReactNode;
}

export function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-semibold text-text">{title}</h1>
      {action}
    </div>
  );
}
