import { useId, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/cn";
import { FieldShell } from "./FieldShell";

interface TimeFieldProps {
  label: string;
  /** Value as "HH:MM". */
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  containerClassName?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

/** Outlined time field with an hour/minute popover (with an "Ahora" shortcut). */
export function TimeField({
  label,
  value,
  onChange,
  error,
  placeholder,
  disabled,
  containerClassName,
}: TimeFieldProps) {
  const { t } = useTranslation("common");
  const id = useId();
  const [open, setOpen] = useState(false);

  const [hh, mm] = value ? value.split(":").map(Number) : [undefined, undefined];

  const setHour = (h: number) => onChange(`${pad(h)}:${pad(mm ?? 0)}`);
  const setMinute = (m: number) => onChange(`${pad(hh ?? 0)}:${pad(m)}`);
  const setNow = () => {
    const now = new Date();
    onChange(`${pad(now.getHours())}:${pad(Math.round(now.getMinutes() / 5) * 5 % 60)}`);
    setOpen(false);
  };

  const Column = ({
    items,
    selected,
    onPick,
  }: {
    items: number[];
    selected?: number;
    onPick: (n: number) => void;
  }) => (
    <ul className="max-h-52 w-16 overflow-y-auto">
      {items.map((n) => (
        <li key={n}>
          <button
            type="button"
            onClick={() => onPick(n)}
            className={cn(
              "w-full rounded-lg px-2 py-1.5 text-center text-sm",
              selected === n
                ? "bg-primary font-medium text-primary-fg"
                : "text-text hover:bg-primary-soft",
            )}
          >
            {pad(n)}
          </button>
        </li>
      ))}
    </ul>
  );

  return (
    <FieldShell
      label={label}
      htmlFor={id}
      error={error}
      disabled={disabled}
      className={containerClassName}
    >
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          id={id}
          disabled={disabled}
          className="flex w-full items-center justify-between gap-2 bg-transparent px-3 py-2.5 text-left outline-none"
        >
          <span className={value ? "text-text" : "text-muted/70"}>
            {value || placeholder || "--:--"}
          </span>
          <Clock className="size-5 text-muted" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="radix-pop z-50 rounded-xl border border-border bg-card p-2 shadow-lg"
          >
            <div className="flex gap-1">
              <Column items={HOURS} selected={hh} onPick={setHour} />
              <Column items={MINUTES} selected={mm} onPick={setMinute} />
            </div>
            <div className="mt-1 flex justify-end border-t border-border pt-1">
              <button
                type="button"
                onClick={setNow}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-soft"
              >
                {t("now")}
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </FieldShell>
  );
}
