import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { FieldShell } from "./FieldShell";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Class for the outer wrapper (e.g. grid spans). */
  containerClassName?: string;
}

/** Outlined text input with a floating label. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, error, hint, containerClassName, id, className, disabled, ...rest },
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
        <input
          ref={ref}
          id={fieldId}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent px-3 py-2.5 text-text outline-none placeholder:text-muted/70",
            className,
          )}
          {...rest}
        />
      </FieldShell>
    );
  },
);
