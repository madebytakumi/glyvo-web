import { pdf } from "@react-pdf/renderer";
import { buildCsv, type ReportStrings } from "./export";
import { ReportPdf } from "./pdf/ReportPdf";
import type { Report } from "./model";

/** Trigger a browser download for a Blob. */
function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportReportCsv(
  report: Report,
  strings: ReportStrings,
  filename = "glyvo-reporte.csv",
): void {
  // Prepend a BOM so Excel detects UTF-8 (accents render correctly).
  const blob = new Blob(["﻿" + buildCsv(report, strings)], {
    type: "text/csv;charset=utf-8",
  });
  download(blob, filename);
}

export async function exportReportPdf(
  report: Report,
  strings: ReportStrings,
  filename = "glyvo-reporte.pdf",
): Promise<void> {
  // ReportPdf is a pure (hook-free) builder returning a <Document>; calling it
  // directly yields the element @react-pdf's pdf() expects.
  const blob = await pdf(ReportPdf({ report, s: strings })).toBlob();
  download(blob, filename);
}
