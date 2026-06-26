import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Report } from "../model";
import type { ReportStrings } from "../export";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 11, color: "#0F172A", fontFamily: "Helvetica" },
  title: { fontSize: 18, marginBottom: 2 },
  meta: { fontSize: 9, color: "#64748B", marginBottom: 16 },
  section: { fontSize: 12, color: "#7C3AED", marginTop: 14, marginBottom: 4 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 4,
  },
  value: { fontFamily: "Helvetica-Bold" },
});

const dash = (v: number | null) => (v == null ? "—" : String(v));

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.row}>
      <Text>{k}</Text>
      <Text style={styles.value}>{v}</Text>
    </View>
  );
}

/** Declarative PDF document for a health report. */
export function ReportPdf({ report, s }: { report: Report; s: ReportStrings }) {
  const pct = report.medication.pct == null ? "—" : `${report.medication.pct}%`;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{s.title}</Text>
        <Text style={styles.meta}>
          {s.period} · {s.generatedLabel}: {s.generatedAt}
        </Text>

        <Text style={styles.section}>{s.sections.glucose}</Text>
        <Row k={s.metrics.count} v={String(report.glucose.count)} />
        <Row k={s.metrics.average} v={`${dash(report.glucose.average)} ${s.mgdl}`} />
        <Row k={s.metrics.highest} v={`${dash(report.glucose.highest)} ${s.mgdl}`} />
        <Row k={s.metrics.lowest} v={`${dash(report.glucose.lowest)} ${s.mgdl}`} />

        <Text style={styles.section}>{s.sections.insulin}</Text>
        <Row k={s.metrics.administrations} v={String(report.insulin.count)} />
        <Row k={s.metrics.totalUnits} v={`${report.insulin.totalUnits} ${s.units}`} />

        <Text style={styles.section}>{s.sections.meals}</Text>
        <Row k={s.metrics.mealsLogged} v={String(report.meals.count)} />

        <Text style={styles.section}>{s.sections.medication}</Text>
        <Row k={s.metrics.adherence} v={pct} />
        <Row k={s.metrics.taken} v={String(report.medication.taken)} />
        <Row k={s.metrics.skipped} v={String(report.medication.skipped)} />
        <Row k={s.metrics.missed} v={String(report.medication.missed)} />
      </Page>
    </Document>
  );
}
