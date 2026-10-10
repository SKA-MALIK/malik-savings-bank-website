import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { AssetMetricEntry } from "../backend";
import { useAssetMetrics } from "../hooks/useQueries";

type FilterKey = "1D" | "1W" | "1M" | "3M" | "ALL";
const FILTERS: FilterKey[] = ["1D", "1W", "1M", "3M", "ALL"];

function formatINR(v: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);
}

/** Parse date string (may be "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm" etc.) into a Date object */
function parseEntryDate(dateStr: string): Date {
  // If the string has a T separator, treat as local datetime
  // If only date, treat as noon IST to avoid date-shift in UTC
  if (dateStr.includes("T")) {
    return new Date(dateStr);
  }
  // Date-only: parse as IST noon (UTC+5:30 = -330 min offset)
  // Avoids off-by-one from UTC midnight interpretation
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

function formatDateIST(dateStr: string): string {
  const d = parseEntryDate(dateStr);
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTimeIST(dateStr: string): string {
  if (!dateStr.includes("T")) return "—";
  const d = parseEntryDate(dateStr);
  return d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatAxisLabel(dateStr: string): string {
  const d = parseEntryDate(dateStr);
  if (dateStr.includes("T")) {
    const date = d.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
    });
    const time = d.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${date}, ${time}`;
  }
  return d.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
  });
}

function cutoffDate(key: FilterKey): Date | null {
  const now = new Date();
  if (key === "ALL") return null;
  if (key === "1D") {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    return d;
  }
  const daysMap: Record<FilterKey, number> = {
    "1W": 7,
    "1M": 30,
    "3M": 90,
    "1D": 1,
    ALL: 0,
  };
  const d = new Date(now);
  d.setDate(d.getDate() - daysMap[key]);
  return d;
}

interface ChartEntry extends AssetMetricEntry {
  returnPct: number | null;
  returnAmt: number | null;
}

function computeReturns(sorted: AssetMetricEntry[]): ChartEntry[] {
  return sorted.map((entry, idx) => {
    if (idx === 0) return { ...entry, returnPct: null, returnAmt: null };
    const prev = sorted[idx - 1];
    const amt = entry.value - prev.value;
    const pct = (amt / prev.value) * 100;
    return { ...entry, returnPct: pct, returnAmt: amt };
  });
}

interface TooltipPayloadItem {
  value: number;
  payload: ChartEntry;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0].payload;
  const pct = entry.returnPct;
  const amt = entry.returnAmt;

  return (
    <div className="rounded-xl border border-[#FFB703]/40 bg-[#0f0c00]/95 px-4 py-3 text-sm shadow-xl backdrop-blur-sm">
      <p className="text-[#FFB703] font-semibold mb-0.5">
        {formatDateIST(entry.date)}
      </p>
      {formatTimeIST(entry.date) !== "—" && (
        <p className="text-[#FFB703]/70 text-xs mb-1">
          {formatTimeIST(entry.date)} IST
        </p>
      )}
      <p className="text-white font-bold text-base mb-1">
        {formatINR(entry.value)}
      </p>
      {pct !== null && amt !== null ? (
        <>
          <p
            className={`text-xs font-semibold ${pct >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {pct >= 0 ? "+" : ""}
            {pct.toFixed(2)}%
          </p>
          <p
            className={`text-xs ${amt >= 0 ? "text-green-400/80" : "text-red-400/80"}`}
          >
            {amt >= 0 ? "+" : ""}
            {formatINR(amt)}
          </p>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">First entry</p>
      )}
    </div>
  );
}

interface GradientDefsProps {
  isPositive: boolean;
}

function GradientDefs({ isPositive }: GradientDefsProps) {
  const color = isPositive ? "#22c55e" : "#ef4444";
  return (
    <defs>
      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={color} stopOpacity={0.25} />
        <stop offset="95%" stopColor={color} stopOpacity={0.02} />
      </linearGradient>
    </defs>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 rounded-2xl border border-[#FFB703]/20 bg-[#111]"
      data-ocid="asset-metrics-page.empty_state"
    >
      <div className="text-5xl mb-4">📊</div>
      <p className="text-[#FFB703] font-bold text-xl mb-2">No Asset Data Yet</p>
      <p className="text-muted-foreground text-sm text-center max-w-sm">
        Add entries from the Admin Panel → Asset Metrics Manager to start
        tracking your portfolio performance.
      </p>
    </div>
  );
}

export default function AssetMetricsPage() {
  const { data: metrics = [], isLoading, refetch } = useAssetMetrics();

  // Refetch when page becomes visible
  useEffect(() => {
    refetch();
  }, [refetch]);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("ALL");

  // Sort ascending (chart order)
  const sortedAll = useMemo(
    () => [...metrics].sort((a, b) => a.date.localeCompare(b.date)),
    [metrics],
  );

  // Apply time filter
  const filteredSorted = useMemo(() => {
    const cutoff = cutoffDate(activeFilter);
    if (!cutoff) return sortedAll;
    return sortedAll.filter((d) => parseEntryDate(d.date) >= cutoff);
  }, [sortedAll, activeFilter]);

  // Compute returns for chart data (relative to filtered window start)
  const chartData = useMemo(
    () => computeReturns(filteredSorted),
    [filteredSorted],
  );

  // Table data: descending (latest first)
  const tableData = useMemo(() => {
    // Returns computed from full sortedAll for accurate per-entry return
    const allWithReturns = computeReturns(sortedAll);
    // Filter then reverse
    const cutoff = cutoffDate(activeFilter);
    const filtered = cutoff
      ? allWithReturns.filter((d) => parseEntryDate(d.date) >= cutoff)
      : allWithReturns;
    return [...filtered].reverse();
  }, [sortedAll, activeFilter]);

  const first = filteredSorted[0];
  const last = filteredSorted[filteredSorted.length - 1];
  const prevAll = sortedAll[sortedAll.length - 2];

  const periodReturn =
    filteredSorted.length >= 2 && first && last
      ? ((last.value - first.value) / first.value) * 100
      : 0;

  const dailyChange =
    sortedAll.length >= 2 && prevAll && last
      ? ((last.value - prevAll.value) / prevAll.value) * 100
      : 0;

  const isPositive = periodReturn >= 0;
  const lineColor = isPositive ? "#22c55e" : "#ef4444";

  const invested = first?.value ?? 0;
  const currentVal = last?.value ?? 0;
  const totalReturn = currentVal - invested;
  const returnIsPositive = totalReturn >= 0;

  const isEmpty = metrics.length === 0;

  return (
    <div
      className="min-h-screen bg-[#0a0a0a]"
      data-ocid="asset-metrics-page.page"
    >
      {/* Page header */}
      <div className="border-b border-[#FFB703]/20 bg-[#0f0f0f]">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-vibrant-gold via-vibrant-deep-amber to-vibrant-maroon bg-clip-text text-transparent animate-gradient-shift mb-1">
            Asset Metrics
          </h1>
          <p className="text-muted-foreground text-sm">
            Track and analyse total asset value performance over time
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 rounded-full border-2 border-[#FFB703] border-t-transparent animate-spin" />
          </div>
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <>
            {/* ───── CHART SECTION ───── */}
            <section
              className="rounded-2xl border border-[#FFB703]/20 bg-[#111] overflow-hidden"
              data-ocid="asset-metrics-page.section"
            >
              <div className="p-5 pb-0">
                {/* Return headline */}
                <div className="flex flex-wrap items-end gap-3 mb-5">
                  <span
                    className={`text-4xl md:text-5xl font-bold tabular-nums ${
                      isPositive ? "text-green-400" : "text-red-400"
                    }`}
                    style={{ textShadow: `0 0 20px ${lineColor}60` }}
                  >
                    {isPositive ? "+" : ""}
                    {periodReturn.toFixed(2)}%
                  </span>
                  <div className="flex flex-col mb-1">
                    <span className="text-muted-foreground text-xs">
                      {activeFilter === "ALL" ? "All-time" : activeFilter}{" "}
                      return
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        dailyChange >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      Daily: {dailyChange >= 0 ? "+" : ""}
                      {dailyChange.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Filter pills */}
                <div
                  className="flex flex-wrap gap-2 mb-4"
                  data-ocid="asset-metrics-page.tab"
                >
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setActiveFilter(f)}
                      data-ocid={`asset-metrics-page.filter.${f.toLowerCase()}`}
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                        activeFilter === f
                          ? "bg-gradient-to-r from-[#FFB703] to-amber-500 text-black shadow-lg scale-105"
                          : "bg-[#1a1a1a] text-muted-foreground border border-[#333] hover:border-[#FFB703]/50 hover:text-[#FFB703]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Chart */}
              <div
                className="px-2 pb-4"
                data-ocid="asset-metrics-page.chart_point"
              >
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                  >
                    <GradientDefs isPositive={isPositive} />
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1e1e1e"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      tickFormatter={formatAxisLabel}
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      minTickGap={60}
                    />
                    <YAxis
                      tick={{ fill: "#6b7280", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) =>
                        v >= 100000
                          ? `₹${(v / 100000).toFixed(1)}L`
                          : v >= 1000
                            ? `₹${(v / 1000).toFixed(0)}k`
                            : `₹${v}`
                      }
                      width={56}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{
                        stroke: lineColor,
                        strokeWidth: 1,
                        strokeDasharray: "4 4",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={lineColor}
                      strokeWidth={2.5}
                      fill="url(#areaGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: lineColor,
                        stroke: "#0a0a0a",
                        strokeWidth: 2,
                      }}
                      style={{ filter: `drop-shadow(0 0 8px ${lineColor}80)` }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Summary card */}
              <div className="mx-4 mb-5 rounded-xl border border-[#FFB703]/20 bg-[#0d0d0d] p-4 flex flex-col sm:flex-row gap-4 sm:gap-0 sm:divide-x sm:divide-[#FFB703]/20">
                <div className="flex-1 sm:pr-5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    Base Value
                  </p>
                  <p className="text-xl font-bold text-[#FFB703]">
                    {formatINR(invested)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {first ? formatDateIST(first.date) : "—"}
                  </p>
                </div>
                <div className="flex-1 sm:px-5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    Current Value
                  </p>
                  <p className="text-xl font-bold text-white">
                    {formatINR(currentVal)}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {last ? formatDateIST(last.date) : "—"}
                  </p>
                </div>
                <div className="flex-1 sm:pl-5">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">
                    Total Returns
                  </p>
                  <p
                    className={`text-xl font-bold ${
                      returnIsPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {returnIsPositive ? "+" : ""}
                    {formatINR(totalReturn)}
                  </p>
                  <p
                    className={`text-[10px] mt-0.5 ${
                      returnIsPositive ? "text-green-400/70" : "text-red-400/70"
                    }`}
                  >
                    {returnIsPositive ? "+" : ""}
                    {periodReturn.toFixed(2)}% overall
                  </p>
                </div>
              </div>
            </section>

            {/* ───── DATA TABLE ───── */}
            <section
              className="rounded-2xl border border-[#FFB703]/20 bg-[#111] overflow-hidden"
              data-ocid="asset-metrics-page.table"
            >
              <div className="px-5 pt-5 pb-3">
                <h2 className="text-lg font-bold bg-gradient-to-r from-vibrant-gold to-vibrant-deep-amber bg-clip-text text-transparent">
                  Historical Data
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sorted by latest first · All times in IST
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#FFB703]/20 bg-[#0d0d0d]">
                      <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Date (IST)
                      </th>
                      <th className="text-left px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                        Time (IST)
                      </th>
                      <th className="text-right px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Total Assets
                      </th>
                      <th className="text-right px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Return %
                      </th>
                      <th className="text-right px-5 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
                        Return Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((entry, idx) => {
                      const pct = entry.returnPct;
                      const amt = entry.returnAmt;
                      const isGreen = pct !== null && pct >= 0;
                      const isRed = pct !== null && pct < 0;
                      return (
                        <tr
                          key={entry.date}
                          className="border-b border-[#1e1e1e] hover:bg-[#FFB703]/5 transition-colors"
                          data-ocid={`asset-metrics-page.row.item.${idx + 1}`}
                        >
                          <td className="px-5 py-3.5 text-white font-medium whitespace-nowrap">
                            {formatDateIST(entry.date)}
                          </td>
                          <td className="px-3 py-3.5 text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                            {formatTimeIST(entry.date)}
                          </td>
                          <td className="px-3 py-3.5 text-right font-mono font-semibold text-[#FFB703] whitespace-nowrap">
                            {formatINR(entry.value)}
                          </td>
                          <td
                            className={`px-3 py-3.5 text-right font-semibold whitespace-nowrap ${
                              isGreen
                                ? "text-green-400"
                                : isRed
                                  ? "text-red-400"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {pct !== null
                              ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`
                              : "—"}
                          </td>
                          <td
                            className={`px-5 py-3.5 text-right font-mono hidden md:table-cell whitespace-nowrap ${
                              isGreen
                                ? "text-green-400"
                                : isRed
                                  ? "text-red-400"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {amt !== null
                              ? `${amt >= 0 ? "+" : ""}${formatINR(Math.abs(amt))}`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {tableData.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    No entries for the selected period.
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
