import { useId } from "react";
import * as Switch from "@radix-ui/react-switch";

interface SwitchFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

/** Material-style toggle (Radix Switch) with a leading label. */
export function SwitchField({ label, checked, onChange, disabled }: SwitchFieldProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-3">
      <label htmlFor={id} className="text-text">
        {label}
      </label>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="relative h-6 w-11 shrink-0 rounded-full bg-border outline-none transition-colors data-[state=checked]:bg-primary disabled:opacity-60"
      >
        <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[1.375rem]" />
      </Switch.Root>
    </div>
  );
}
