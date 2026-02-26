import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TimeRange = "1M" | "6M" | "1A" | "Todo";

interface TotalBalanceChartProps {
  currency: "USD" | "ARS";
}

export function TotalBalanceChart({ currency }: TotalBalanceChartProps) {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1M");

  // Mock data para diferentes periodos
  const dataByRange: Record<TimeRange, Array<{ date: string; value: number }>> = {
    "1M": [
      { date: "5 Ene", value: 4200 },
      { date: "8 Ene", value: 4250 },
      { date: "11 Ene", value: 4180 },
      { date: "14 Ene", value: 4320 },
      { date: "17 Ene", value: 4400 },
      { date: "20 Ene", value: 4380 },
      { date: "23 Ene", value: 4450 },
      { date: "26 Ene", value: 4520 },
      { date: "29 Ene", value: 4500 },
      { date: "1 Feb", value: 4560 },
    ],
    "6M": [
      { date: "Ago", value: 3800 },
      { date: "Sep", value: 3900 },
      { date: "Oct", value: 4100 },
      { date: "Nov", value: 4200 },
      { date: "Dic", value: 4350 },
      { date: "Ene", value: 4480 },
      { date: "Feb", value: 4560 },
    ],
    "1A": [
      { date: "Feb '25", value: 3200 },
      { date: "Abr '25", value: 3400 },
      { date: "Jun '25", value: 3600 },
      { date: "Ago '25", value: 3800 },
      { date: "Oct '25", value: 4100 },
      { date: "Dic '25", value: 4350 },
      { date: "Feb '26", value: 4560 },
    ],
    "Todo": [
      { date: "2023", value: 2000 },
      { date: "2024 Q1", value: 2500 },
      { date: "2024 Q2", value: 3000 },
      { date: "2024 Q3", value: 3500 },
      { date: "2024 Q4", value: 4000 },
      { date: "2025 Q1", value: 4300 },
      { date: "2026 Q1", value: 4560 },
    ],
  };

  const data = dataByRange[selectedRange];
  const EXCHANGE_RATE = 1000;

  // Convert data based on currency
  const chartData = data.map((item) => ({
    ...item,
    value: currency === "ARS" ? item.value * EXCHANGE_RATE : item.value,
  }));

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatTooltipValue = (value: number) => {
    if (currency === "ARS") {
      return `${currency} $${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${currency} $${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="backdrop-blur-lg bg-white/10 rounded-3xl p-6 border border-white/20">
      {/* Title */}
      <h3 className="text-white font-medium mb-6">Evolución histórica de tu cartera</h3>

      {/* Chart */}
      <div className="h-[200px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.2)" }}
              tickFormatter={formatValue}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "14px",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [formatTooltipValue(value), "Valor"]}
              labelStyle={{ color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ffffff"
              strokeWidth={2}
              fill="url(#colorValue)"
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Time range selector - below chart */}
      <div className="flex justify-center">
        <div className="flex gap-2 backdrop-blur-md bg-white/10 rounded-xl p-1">
          {(["1M", "6M", "1A", "Todo"] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedRange === range
                  ? "bg-white text-[#3246ff]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}