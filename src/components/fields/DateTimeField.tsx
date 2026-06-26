import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { DateField } from "./DateField";
import { TimeField } from "./TimeField";

interface DateTimeFieldProps {
  /** Value as "yyyy-MM-dd'T'HH:mm" (what the form stores). */
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

/** Combined date + time, kept in sync as a single "yyyy-MM-ddTHH:mm" value. */
export function DateTimeField({
  value,
  onChange,
  error,
  disabled,
}: DateTimeFieldProps) {
  const { t } = useTranslation("common");
  const [datePart = "", timePart = ""] = value ? value.split("T") : [];

  const today = () => format(new Date(), "yyyy-MM-dd");
  const setDate = (d: string) => onChange(`${d}T${timePart || "00:00"}`);
  const setTime = (tm: string) => onChange(`${datePart || today()}T${tm}`);

  return (
    <div className="flex flex-col gap-1">
      <div className="grid grid-cols-2 gap-3">
        <DateField label={t("date")} value={datePart} onChange={setDate} disabled={disabled} />
        <TimeField label={t("time")} value={timePart} onChange={setTime} disabled={disabled} />
      </div>
      {error && <span className="px-1 text-xs text-danger">{error}</span>}
    </div>
  );
}
