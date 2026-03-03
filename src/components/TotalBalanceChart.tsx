"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  fetchHistoricalPortfolio,
  type HistoricalPeriod,
  type HistoricalDataPoint,
} from "@/services/portfolio.service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TotalBalanceChartProps {
  currency: "USD" | "ARS";
  dollarValue?: number; // ARS/USD exchange rate for conversion
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  } catch {
    return dateStr;
  }
}

function formatValue(value: number, currency: "USD" | "ARS"): string {
  if (currency === "ARS") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
  if (value >= 1_000_000) return `USD ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `USD ${(value / 1_000).toFixed(1)}K`;
  return `USD ${value.toFixed(2)}`;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, currency }: any) {
  if (!active || !payload || !payload.length) return null;
  const value: number = payload[0].value;
  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 10,
        padding: "8px 14px",
        minWidth: 120,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <p
        style={{
          color: "#6b7280", // gray-500
          fontSize: 11,
          fontWeight: 500,
          marginBottom: 3,
        }}
      >
        {label}
      </p>
      <p style={{ color: "#111827", fontSize: 14, fontWeight: 600 }}>
        {formatValue(value, currency)}
      </p>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChartSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* header row skeleton */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-5 w-8 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
      {/* fake chart skeleton */}
      <div className="flex-1 min-h-0 relative overflow-hidden rounded-lg bg-gray-50/50">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.03) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.4s infinite",
          }}
        />
        {/* Fake wave lines for visual interest */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 340 100"
          preserveAspectRatio="none"
          style={{ opacity: 0.12 }}
        >
          <polyline
            points="0,70 50,55 100,60 150,30 200,40 250,20 300,28 340,18"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function ChartEmpty() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-gray-500 text-[13px] font-medium tracking-wide">
          Evolución histórica
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center relative w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3246ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

        <div className="flex flex-col items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
            <span className="text-xl">📊</span>
          </div>
          <p className="text-gray-500 text-[13px] font-medium tracking-wide">
            Aún no hay datos históricos
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TotalBalanceChart({
  currency,
  dollarValue = 1000,
}: TotalBalanceChartProps) {
  const [selectedRange, setSelectedRange] = useState<HistoricalPeriod>("1M");
  const [chartData, setChartData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (period: HistoricalPeriod) => {
      setLoading(true);
      setError(null);
      try {
        const raw = await fetchHistoricalPortfolio(period);
        // Convert value to selected currency if needed.
        // Backend is assumed to return values in USD.
        const converted = raw.map((d) => ({
          date: formatDate(d.date),
          value:
            currency === "ARS" ? d.value * dollarValue : d.value,
        }));
        setChartData(converted);
      } catch {
        // Endpoint may not exist yet — show graceful fallback
        setError("no-endpoint");
        setChartData([]);
      } finally {
        setLoading(false);
      }
    },
    [currency, dollarValue]
  );

  useEffect(() => {
    loadData(selectedRange);
  }, [selectedRange, loadData]);

  // ── Period selector buttons ──
  const periods: HistoricalPeriod[] = ["1M", "3M", "6M", "1A", "Todo"];

  const PeriodButtons = (
    <div className="flex gap-0.5">
      {periods.map((r) => (
        <button
          key={r}
          onClick={() => setSelectedRange(r)}
          style={{
            padding: "2px 10px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.15s ease",
            border: "none",
            outline: "none",
            background: selectedRange === r ? "#f3f4f6" : "transparent",
            color: selectedRange === r ? "#111827" : "#6b7280",
          }}
          onMouseEnter={(e) => {
            if (selectedRange !== r)
              (e.currentTarget as HTMLButtonElement).style.color = "#111827";
          }}
          onMouseLeave={(e) => {
            if (selectedRange !== r)
              (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
          }}
        >
          {r}
        </button>
      ))}
    </div>
  );

  // ── Loading ──
  if (loading) return <ChartSkeleton />;

  // ── Error / no endpoint yet ──
  if (error || chartData.length === 0) return <ChartEmpty />;

  // ── Chart render ──
  const values = chartData.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const buffer = Math.max((maxVal - minVal) * 0.18, maxVal * 0.05);
  const domain: [number, number] = [minVal - buffer, maxVal + buffer];

  const lineColor = "#3246ff"; // Always primary blue for Mercury style
  const gradientId = `chartGrad-${selectedRange}-${currency}`;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="text-gray-500 text-[13px] font-medium tracking-wide">
          Evolución histórica
        </span>
        {PeriodButtons}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: 180 }}>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 6, right: 2, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={lineColor} stopOpacity={0.15} />
                <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }}
              interval="preserveStartEnd"
              dy={8}
            />
            <YAxis domain={domain} hide />

            <Tooltip
              content={<CustomTooltip currency={currency} />}
              cursor={{
                stroke: "#e5e7eb",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={lineColor}
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{
                r: 4.5,
                fill: lineColor,
                stroke: "white",
                strokeWidth: 2,
              }}
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}