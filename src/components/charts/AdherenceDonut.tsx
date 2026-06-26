import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

export interface DonutSlice {
  name: string;
  value: number;
  color: string;
}

/** Donut for medication adherence (lazy-loaded; pulls in Recharts on demand). */
export default function AdherenceDonut({
  data,
  centerLabel,
}: {
  data: DonutSlice[];
  centerLabel: string;
}) {
  const total = data.reduce((a, d) => a + d.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={80}
            paddingAngle={total > 0 ? 2 : 0}
            stroke="none"
          >
            {data.map((slice) => (
              <Cell key={slice.name} fill={slice.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #E9E2FA",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-semibold text-primary">{centerLabel}</span>
      </div>
    </div>
  );
}
