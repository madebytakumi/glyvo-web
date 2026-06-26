import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface DateTimeFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  invalid?: boolean;
  /** "datetime-local" (default), "date" or "time". */
  mode?: "datetime-local" | "date" | "time";
}

/**
 * Native date/time picker. Works with react-hook-form by passing the value as a
 * "YYYY-MM-DDTHH:MM" string; convert to/from ISO with the datetime helpers.
 */
export const DateTimeField = forwardRef<HTMLInputElement, DateTimeFieldProps>(
  function DateTimeField({ invalid, className, mode = "datetime-local", ...rest }, ref) {
    return (
      <input
        ref={ref}
        type={mode}
        className={cn(
          "w-full rounded-xl border bg-surface px-3 py-2.5 text-text outline-none transition-colors",
          "focus:border-primary focus:ring-2 focus:ring-primary/30",
          invalid ? "border-danger" : "border-border",
          className,
        )}
        {...rest}
      />
    );
  },
);
