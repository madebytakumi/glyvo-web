import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border bg-surface px-3 py-2.5 text-text outline-none transition-colors placeholder:text-muted",
        "focus:border-primary focus:ring-2 focus:ring-primary/30",
        invalid ? "border-danger" : "border-border",
        className,
      )}
      {...rest}
    />
  );
});
