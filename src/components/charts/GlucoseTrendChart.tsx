import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { GlucoseTrendPoint } from "@/features/glucose/service";

/** Glucose daily-average trend (lazy-loaded; pulls in Recharts on demand). */
export default function GlucoseTrendChart({
  data,
}: {
  data: GlucoseTrendPoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <defs>
          <linearGradient id="glucoseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94A3B8" />
        <YAxis tick={{ fontSize: 11 }} stroke="#94A3B8" width={36} />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #E9E2FA",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="avg"
          stroke="#8B5CF6"
          strokeWidth={2}
          fill="url(#glucoseFill)"
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
