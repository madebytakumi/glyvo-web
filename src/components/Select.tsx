import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  invalid?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, invalid, className, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-xl border bg-surface px-3 py-2.5 text-text outline-none transition-colors",
        "focus:border-primary focus:ring-2 focus:ring-primary/30",
        invalid ? "border-danger" : "border-border",
        className,
      )}
      {...rest}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});
