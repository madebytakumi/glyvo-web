import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ invalid, className, rows = 3, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "w-full resize-y rounded-xl border bg-surface px-3 py-2.5 text-text outline-none transition-colors placeholder:text-muted",
          "focus:border-primary focus:ring-2 focus:ring-primary/30",
          invalid ? "border-danger" : "border-border",
          className,
        )}
        {...rest}
      />
    );
  },
);
