import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldShellProps {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Background of the field + label chip; match the surface it sits on. */
  surfaceClass?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Outlined Material-style field wrapper: rounded border with a persistent
 * floating label that "notches" the top border, plus error/hint text. Shared by
 * every form control (text, select, date/time) for a consistent look.
 *
 * Fields live inside Cards, so the label chip defaults to `bg-card` to blend
 * with the surrounding surface.
 */
export function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  invalid,
  disabled,
  surfaceClass = "bg-card",
  className,
  children,
}: FieldShellProps) {
  const isInvalid = invalid || !!error;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        className={cn(
          "group relative rounded-xl border transition-colors",
          surfaceClass,
          isInvalid
            ? "border-danger focus-within:ring-2 focus-within:ring-danger/25"
            : "border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25",
          disabled && "opacity-60",
        )}
      >
        <label
          htmlFor={htmlFor}
          className={cn(
            "pointer-events-none absolute -top-2 left-3 px-1 text-xs font-medium",
            surfaceClass,
            isInvalid
              ? "text-danger"
              : "text-muted group-focus-within:text-primary",
          )}
        >
          {label}
        </label>
        {children}
      </div>
      {(error || hint) && (
        <span className={cn("px-1 text-xs", error ? "text-danger" : "text-muted")}>
          {error ?? hint}
        </span>
      )}
    </div>
  );
}
