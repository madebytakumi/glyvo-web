import { lazy, Suspense, useId, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { CalendarDays } from "lucide-react";
import { format, parse } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/Spinner";
import { FieldShell } from "./FieldShell";

const Calendar = lazy(() => import("./Calendar"));

interface DateFieldProps {
  label: string;
  /** Value as "yyyy-MM-dd". */
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  containerClassName?: string;
}

const toDate = (value: string): Date | undefined =>
  value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;

/** Outlined date field with a themed calendar popover (defaults to today). */
export function DateField({
  label,
  value,
  onChange,
  error,
  placeholder,
  disabled,
  containerClassName,
}: DateFieldProps) {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.language;
  const id = useId();
  const [open, setOpen] = useState(false);
  const selected = toDate(value);
  const display = selected
    ? format(selected, "PP", { locale: lang === "en" ? enUS : es })
    : (placeholder ?? "—");

  const pick = (date: Date) => {
    onChange(format(date, "yyyy-MM-dd"));
    setOpen(false);
  };

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
          <span className={selected ? "text-text" : "text-muted/70"}>{display}</span>
          <CalendarDays className="size-5 text-muted" />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="radix-pop z-50 rounded-xl border border-border bg-card p-2 shadow-lg"
          >
            <Suspense
              fallback={
                <div className="flex h-72 w-72 items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <Calendar
                lang={lang}
                selected={selected}
                onSelect={(d) => d && pick(d)}
              />
            </Suspense>
            <div className="mt-1 flex justify-end border-t border-border pt-1">
              <button
                type="button"
                onClick={() => pick(new Date())}
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary-soft"
              >
                {t("today")}
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </FieldShell>
  );
}
