import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Spinner } from "@/components/Spinner";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@/lib/datetime";
import { useReport } from "../queries";
import type { ReportStrings } from "../export";
import type { Report, ReportRangeKind } from "../model";

const RANGES: ReportRangeKind[] = ["day", "week", "month"];

function buildStrings(
  t: ReturnType<typeof useTranslation>["0"],
  report: Report,
  lang: "es" | "en",
): ReportStrings {
  return {
    title: t("documentTitle"),
    periodLabel: t("period"),
    period: t(`ranges.${report.period.kind}`),
    generatedLabel: t("generated"),
    generatedAt: formatDateTime(report.generatedAt, lang),
    mgdl: t("mgdl"),
    units: t("units"),
    sections: t("sections", { returnObjects: true }) as ReportStrings["sections"],
    metrics: t("metrics", { returnObjects: true }) as ReportStrings["metrics"],
  };
}

export function ReportsPage() {
  const { t, i18n } = useTranslation("reports");
  const lang = i18n.language as "es" | "en";
  const [range, setRange] = useState<ReportRangeKind>("week");
  const { data: report, isLoading } = useReport(range);
  const [exporting, setExporting] = useState<"pdf" | "csv" | null>(null);

  async function handleExport(format: "pdf" | "csv") {
    if (!report) return;
    setExporting(format);
    try {
      const strings = buildStrings(t, report, lang);
      const m = await import("../exportWeb");
      if (format === "csv") m.exportReportCsv(report, strings);
      else await m.exportReportPdf(report, strings);
    } finally {
      setExporting(null);
    }
  }

  return (
    <div>
      <PageHeader title={t("title")} />

      <div className="mb-4 flex gap-1">
        {RANGES.map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              range === r
                ? "bg-primary text-primary-fg"
                : "bg-primary-soft/40 text-muted hover:bg-primary-soft",
            )}
          >
            {t(`rangeShort.${r}`)}
          </button>
        ))}
      </div>

      {isLoading || !report ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <>
          <ReportSummary report={report} />
          <div className="mt-4 flex gap-2">
            <Button
              variant="secondary"
              loading={exporting === "csv"}
              onClick={() => handleExport("csv")}
            >
              {t("exportCsv")}
            </Button>
            <Button loading={exporting === "pdf"} onClick={() => handleExport("pdf")}>
              {t("exportPdf")}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

function ReportSummary({ report }: { report: Report }) {
  const { t } = useTranslation("reports");
  const dash = (v: number | null) => (v == null ? "—" : String(v));
  const pct = report.medication.pct == null ? "—" : `${report.medication.pct}%`;

  const sections: { title: string; rows: [string, string][] }[] = [
    {
      title: t("sections.glucose"),
      rows: [
        [t("metrics.count"), String(report.glucose.count)],
        [t("metrics.average"), `${dash(report.glucose.average)} ${t("mgdl")}`],
        [t("metrics.highest"), `${dash(report.glucose.highest)} ${t("mgdl")}`],
        [t("metrics.lowest"), `${dash(report.glucose.lowest)} ${t("mgdl")}`],
      ],
    },
    {
      title: t("sections.insulin"),
      rows: [
        [t("metrics.administrations"), String(report.insulin.count)],
        [t("metrics.totalUnits"), `${report.insulin.totalUnits} ${t("units")}`],
      ],
    },
    {
      title: t("sections.meals"),
      rows: [[t("metrics.mealsLogged"), String(report.meals.count)]],
    },
    {
      title: t("sections.medication"),
      rows: [
        [t("metrics.adherence"), pct],
        [t("metrics.taken"), String(report.medication.taken)],
        [t("metrics.skipped"), String(report.medication.skipped)],
        [t("metrics.missed"), String(report.medication.missed)],
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => (
        <Card key={section.title}>
          <h2 className="mb-2 font-medium text-primary">{section.title}</h2>
          <dl className="flex flex-col">
            {section.rows.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-border py-1.5 last:border-0">
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}
