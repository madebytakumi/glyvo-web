import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { TextField } from "@/components/fields/TextField";
import { useGlucoseThresholds } from "@/features/glucose/thresholdsStore";
import { DEFAULT_THRESHOLDS } from "@/features/glucose/zones";
import { GLUCOSE_VALUE_MAX, GLUCOSE_VALUE_MIN } from "@/features/glucose/model";

/** Settings section to configure the glucose zone thresholds (per device). */
export function GlucoseRangesSection() {
  const { t } = useTranslation("settings");
  const thresholds = useGlucoseThresholds((s) => s.thresholds);
  const setThresholds = useGlucoseThresholds((s) => s.setThresholds);
  const reset = useGlucoseThresholds((s) => s.reset);

  const [low, setLow] = useState(String(thresholds.low));
  const [high, setHigh] = useState(String(thresholds.high));
  const [critical, setCritical] = useState(String(thresholds.critical));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = () => {
    setSaved(false);
    setError(null);
  };

  function save() {
    const l = Number(low);
    const h = Number(high);
    const c = Number(critical);
    const valid =
      [l, h, c].every((n) => Number.isInteger(n)) &&
      l >= GLUCOSE_VALUE_MIN &&
      c <= GLUCOSE_VALUE_MAX &&
      l < h &&
      h < c;
    if (!valid) {
      setError(t("glucoseRanges.invalid", { min: GLUCOSE_VALUE_MIN, max: GLUCOSE_VALUE_MAX }));
      setSaved(false);
      return;
    }
    setThresholds({ low: l, high: h, critical: c });
    setError(null);
    setSaved(true);
  }

  function restore() {
    reset();
    setLow(String(DEFAULT_THRESHOLDS.low));
    setHigh(String(DEFAULT_THRESHOLDS.high));
    setCritical(String(DEFAULT_THRESHOLDS.critical));
    setError(null);
    setSaved(false);
  }

  return (
    <Card className="mb-3">
      <h2 className="mb-1 text-sm font-medium text-muted">{t("glucoseRanges.title")}</h2>
      <p className="mb-4 text-sm text-muted">{t("glucoseRanges.description")}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <TextField
          label={t("glucoseRanges.low")}
          inputMode="numeric"
          value={low}
          onChange={(e) => {
            setLow(e.target.value);
            dirty();
          }}
        />
        <TextField
          label={t("glucoseRanges.high")}
          inputMode="numeric"
          value={high}
          onChange={(e) => {
            setHigh(e.target.value);
            dirty();
          }}
        />
        <TextField
          label={t("glucoseRanges.critical")}
          inputMode="numeric"
          value={critical}
          onChange={(e) => {
            setCritical(e.target.value);
            dirty();
          }}
        />
      </div>

      <p className="mt-2 text-xs text-danger/90">
        {t("glucoseRanges.criticalNote", { value: critical || "—" })}
      </p>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {saved && <p className="mt-2 text-sm text-success">{t("glucoseRanges.saved")}</p>}

      <div className="mt-4 flex gap-2">
        <Button onClick={save}>{t("glucoseRanges.save")}</Button>
        <Button variant="secondary" onClick={restore}>
          {t("glucoseRanges.reset")}
        </Button>
      </div>
    </Card>
  );
}
