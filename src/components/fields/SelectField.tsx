import { useId } from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { FieldShell } from "./FieldShell";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  containerClassName?: string;
}

/** Outlined dropdown built on Radix Select (themed, keyboard-accessible). */
export function SelectField({
  label,
  value,
  onChange,
  options,
  error,
  placeholder,
  disabled,
  containerClassName,
}: SelectFieldProps) {
  const id = useId();

  return (
    <FieldShell
      label={label}
      htmlFor={id}
      error={error}
      disabled={disabled}
      className={containerClassName}
    >
      <Select.Root value={value || undefined} onValueChange={onChange} disabled={disabled}>
        <Select.Trigger
          id={id}
          className="flex w-full items-center justify-between gap-2 bg-transparent px-3 py-2.5 text-left text-text outline-none data-[placeholder]:text-muted/70"
        >
          <Select.Value placeholder={placeholder ?? "—"} />
          <Select.Icon>
            <ChevronDown className="size-5 text-muted" />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            position="popper"
            sideOffset={6}
            className="radix-pop z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-card shadow-lg"
          >
            <Select.Viewport className="p-1">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-text outline-none",
                    "data-[highlighted]:bg-primary-soft data-[state=checked]:font-medium",
                  )}
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check className="size-4 text-primary" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </FieldShell>
  );
}
