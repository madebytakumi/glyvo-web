import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { FieldShell } from "./FieldShell";

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

/** Outlined textarea with a floating label. */
export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField(
    { label, error, hint, containerClassName, id, className, rows = 3, disabled, ...rest },
    ref,
  ) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
      <FieldShell
        label={label}
        htmlFor={fieldId}
        error={error}
        hint={hint}
        disabled={disabled}
        className={containerClassName}
      >
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          disabled={disabled}
          className={cn(
            "w-full resize-y bg-transparent px-3 py-2.5 text-text outline-none placeholder:text-muted/70",
            className,
          )}
          {...rest}
        />
      </FieldShell>
    );
  },
);
