import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ShareValueEntry, Shareholder } from "../backend";

const LINE_COLORS = [
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#06b6d4",
  "#ec4899",
];

type FilterKey = "All" | "7D" | "30D";
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "All", label: "All" },
  { key: "7D", label: "Last 7 Days" },
  { key: "30D", label: "Last 30 Days" },
];

function formatINR(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);
}

function formatDateDisplay(dateStr: string): string {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return dateStr;
  }
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-primary/30 bg-secondary/95 px-4 py-3 shadow-lg text-sm backdrop-blur-sm">
      <p className="font-semibold text-primary mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span
            className="inline-block h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: p.color }}
          />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-semibold text-card-foreground">
            {formatINR(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

interface Props {
  shareValueHistory: ShareValueEntry[];
  shareholders: Shareholder[];
}

export default function ShareValueTrendChart({
  shareValueHistory,
  shareholders,
}: Props) {
  const [filter, setFilter] = useState<FilterKey>("All");

  const uniqueNames = useMemo(() => {
    const names = new Set(shareValueHistory.map((e) => e.shareholderName));
    // Preserve shareholder order from shareholders list
    const ordered = shareholders.map((s) => s.name).filter((n) => names.has(n));
    // Add any names not in shareholders list
    for (const n of names) {
      if (!ordered.includes(n)) ordered.push(n);
    }
    return ordered;
  }, [shareValueHistory, shareholders]);

  const filteredHistory = useMemo(() => {
    if (filter === "All") return shareValueHistory;
    const now = new Date();
    const days = filter === "7D" ? 7 : 30;
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - days);
    return shareValueHistory.filter((e) => {
      const [y, m, d] = e.date.split("-").map(Number);
      return new Date(y, m - 1, d) >= cutoff;
    });
  }, [shareValueHistory, filter]);

  // Build chart data: one row per unique date, columns per shareholder
  const chartData = useMemo(() => {
    const dateMap = new Map<string, Record<string, number>>();
    for (const entry of filteredHistory) {
      if (!dateMap.has(entry.date)) dateMap.set(entry.date, {});
      const row = dateMap.get(entry.date)!;
      row[entry.shareholderName] = entry.shareAmount;
    }
    return Array.from(dateMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, values]) => ({
        date,
        displayDate: formatDateDisplay(date),
        ...values,
      }));
  }, [filteredHistory]);

  const isEmpty = shareValueHistory.length === 0;

  return (
    <section
      className="container mx-auto px-4 pt-6 pb-0"
      data-ocid="shareholders.trend_chart.section"
    >
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl border-2 border-primary/20 bg-card shadow-gold-glow overflow-hidden">
          {/* Card Header */}
          <div className="border-b border-primary/20 bg-secondary/30 px-4 py-5 md:px-8 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold md:text-2xl leading-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Daily Share Value Trend
                </span>
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Historical share values per shareholder
              </p>
            </div>
            {/* Filter Pills */}
            {!isEmpty && (
              <div
                className="flex gap-2 flex-wrap"
                data-ocid="shareholders.trend_chart.filter_group"
              >
                {FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFilter(key)}
                    data-ocid={`shareholders.trend_chart.filter.${key.toLowerCase()}`}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      filter === key
                        ? "bg-primary text-primary-foreground shadow-gold-glow"
                        : "bg-secondary/60 text-muted-foreground hover:bg-primary/20 hover:text-primary border border-primary/20"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chart Body */}
          <div className="p-4 md:p-8">
            {isEmpty ? (
              <div
                className="flex flex-col items-center justify-center h-56 text-muted-foreground gap-3"
                data-ocid="shareholders.trend_chart.empty_state"
              >
                <svg
                  className="h-12 w-12 text-primary/30"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <title>No data chart icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 12l3-3 3 3 4-4M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-base font-semibold">No Data Available</p>
                <p className="text-xs text-center max-w-xs">
                  Admin can add daily share value entries from the Share Trend
                  tab in the Admin Panel.
                </p>
              </div>
            ) : chartData.length === 0 ? (
              <div
                className="flex items-center justify-center h-56 text-muted-foreground"
                data-ocid="shareholders.trend_chart.empty_state"
              >
                No data for selected filter range
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={chartData}
                  margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(var(--border))"
                    opacity={0.4}
                  />
                  <XAxis
                    dataKey="displayDate"
                    tick={{
                      fill: "oklch(var(--muted-foreground))",
                      fontSize: 11,
                    }}
                    axisLine={{ stroke: "oklch(var(--border))", opacity: 0.4 }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v: number) => formatINR(v)}
                    tick={{
                      fill: "oklch(var(--muted-foreground))",
                      fontSize: 11,
                    }}
                    axisLine={{ stroke: "oklch(var(--border))", opacity: 0.4 }}
                    tickLine={false}
                    width={90}
                    label={{
                      value: "Share Amount (₹)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -8,
                      style: {
                        fill: "oklch(var(--muted-foreground))",
                        fontSize: 10,
                      },
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{
                      fontSize: 12,
                      color: "oklch(var(--muted-foreground))",
                      paddingTop: 16,
                    }}
                  />
                  {uniqueNames.map((name, idx) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
