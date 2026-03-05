"use client";

import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Info,
  PieChart as PieChartIcon,
  RefreshCw,
  Plus,
  Minus,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  fetchObjectiveTracing,
  fetchObjectiveDashboard,
  fetchFundDetail,
  fetchLastHolding,
} from "../../../../services/portfolio.service";
import type { HoldingData } from "../../../../services/portfolio.service";
import type {
  ObjectiveDetail,
  InstrumentHolding,
  WelfiFundObjective,
} from "../../../../types/api.types";

// ── Chart types ──────────────────────────────────────────────────────────────

type ChartPeriod = "1M" | "YTD" | "1A" | "HISTORICAL";
interface ChartPoint { x: string; position: number; contributions: number; }

function formatChartValue(value: number, cur: "ARS" | "USD"): string {
  if (cur === "ARS") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  }
  if (value >= 1_000_000) return `USD ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `USD ${(value / 1_000).toFixed(1)}K`;
  return `USD ${value.toFixed(2)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label, cur }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 10,
        padding: "8px 14px",
        minWidth: 140,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      }}
    >
      <p style={{ color: "#6b7280", fontSize: 11, fontWeight: 500, marginBottom: 4 }}>{label}</p>
      {payload.map((p: { dataKey: string; value: number; color: string }, i: number) => (
        <p key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600 }}>
          {p.dataKey === "position" ? "Posición" : "Aportes"}: {formatChartValue(p.value, cur)}
        </p>
      ))}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatARS(n: number): string {
  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatUSD(n: number): string {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatCurrency(n: number): string {
  return n.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatPerformance(perf: number | null | undefined): string {
  if (perf == null) return "--";
  const pct = perf * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

// Friendly label for objective types
function getObjectiveTypeLabel(type: string | undefined): string {
  const map: Record<string, string> = {
    INVESTMENT: "Estrategia personal",
    PACK: "Pack temático",
    EMERGENCY: "Fondo de Emergencia",
    RETIREMENT: "Fondo de Retiro",
    FUND: "Welfi Fund",
    PORTFOLIO: "Pack temático",
  };
  return map[type ?? ""] ?? type ?? "Inversión";
}

// Accent color per type
function getTypeAccent(type: string | undefined) {
  const map: Record<string, { gradient: string; badgeCls: string }> = {
    INVESTMENT: {
      gradient: "from-[#3246ff] via-[#4856ff] to-[#5a6aff]",
      badgeCls: "bg-orange-50 text-orange-600",
    },
    PACK: {
      gradient: "from-[#9b59b6] via-[#8e44ad] to-[#7d3c98]",
      badgeCls: "bg-purple-50 text-purple-600",
    },
    EMERGENCY: {
      gradient: "from-emerald-500 via-emerald-600 to-green-600",
      badgeCls: "bg-emerald-50 text-emerald-600",
    },
    RETIREMENT: {
      gradient: "from-amber-500 via-amber-600 to-orange-600",
      badgeCls: "bg-amber-50 text-amber-600",
    },
    FUND: {
      gradient: "from-[#3246ff] via-[#4856ff] to-[#5a6aff]",
      badgeCls: "bg-blue-50 text-blue-600",
    },
    PORTFOLIO: {
      gradient: "from-[#9b59b6] via-[#8e44ad] to-[#7d3c98]",
      badgeCls: "bg-purple-50 text-purple-600",
    },
  };
  return (
    map[type ?? ""] ?? {
      gradient: "from-[#3246ff] via-[#4856ff] to-[#5a6aff]",
      badgeCls: "bg-gray-50 text-gray-600",
    }
  );
}

// Pie chart color palette
const PIE_COLORS = [
  "#3246ff",
  "#e5582f",
  "#14B87D",
  "#9b59b6",
  "#f59e0b",
  "#06b6d4",
  "#ec4899",
  "#6366f1",
  "#84cc16",
  "#f97316",
];

// ── Skeleton ─────────────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="bg-gradient-to-br from-[#3246ff] via-[#4856ff] to-[#5a6aff] pb-32 pt-8 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="w-10 h-10 rounded-full bg-white/20 mb-6 animate-pulse" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20 pb-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 animate-pulse">
          <div className="flex justify-center gap-3 mb-6">
            <div className="h-8 bg-gray-200 rounded-xl w-56" />
            <div className="h-8 bg-gray-100 rounded-full w-20" />
          </div>
          <div className="flex justify-center mb-8">
            <div className="h-14 bg-gray-200 rounded-xl w-72" />
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-8 bg-gray-200 rounded w-24 mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-16 mx-auto" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-14 bg-gray-200 rounded-2xl" />
            <div className="h-14 bg-gray-100 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function InvestmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // ── State ──
  const [detail, setDetail] = useState<ObjectiveDetail | null>(null);
  const [fundDetail, setFundDetail] = useState<WelfiFundObjective | null>(null);
  const [holdingData, setHoldingData] = useState<HoldingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "composition" | "info"
  >("overview");
  const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");

  // Chart state
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartPerf, setChartPerf] = useState<number>(0);
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("HISTORICAL");
  const [chartCurrency, setChartCurrency] = useState<"ARS" | "USD">("ARS");
  const [chartLoading, setChartLoading] = useState(false);

  // ── Parse dashboard response into chart points ──
  const parseDashboard = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (raw: any): { points: ChartPoint[]; perf: number } => {
      const inner = raw?.data ?? raw;
      const series = inner?.series;
      const perf: number = inner?.performance ?? 0;
      if (!series || !Array.isArray(series) || series.length < 2) {
        return { points: [], perf };
      }
      const positionSeries: { x: string; y: number }[] = series[0]?.data ?? [];
      const contribSeries: { x: string; y: number }[] = series[1]?.data ?? [];

      const points: ChartPoint[] = positionSeries.map((pt, i) => ({
        x: pt.x,
        position: pt.y,
        contributions: contribSeries[i]?.y ?? 0,
      }));
      return { points, perf };
    },
    []
  );

  // ── Load chart data (period / currency change) ──
  const loadChart = useCallback(
    async (period: ChartPeriod, cur: "ARS" | "USD") => {
      if (!id) return;
      setChartLoading(true);
      try {
        const dashboardData = await fetchObjectiveDashboard(id, period, cur);
        if (dashboardData) {
          const { points, perf } = parseDashboard(dashboardData);
          setChartData(points);
          setChartPerf(perf);
        } else {
          setChartData([]);
          setChartPerf(0);
        }
      } catch {
        setChartData([]);
      } finally {
        setChartLoading(false);
      }
    },
    [id, parseDashboard]
  );

  // ── Main data loading ──
  const loadData = useCallback(
    async (isRefresh = false) => {
      if (!id) return;
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        // Fetch tracing (full detail), chart, and holdings in parallel
        const [tracingData, dashboardData, holdingsResult] = await Promise.all([
          fetchObjectiveTracing(id),
          fetchObjectiveDashboard(id, "HISTORICAL", "ARS"),
          fetchLastHolding(id),
        ]);

        if (!tracingData) {
          setError("No pudimos encontrar esta inversión.");
          return;
        }

        setDetail(tracingData);
        if (holdingsResult) setHoldingData(holdingsResult);

        // Set initial currency based on objective currency
        const initCur = tracingData.currency_code === "USD" ? "USD" as const : "ARS" as const;
        setCurrency(initCur);
        setChartCurrency(initCur);

        // If it's a FUND type, also fetch from Products API
        if (
          tracingData.objective_type === "FUND" ||
          tracingData.objective_type === "PORTFOLIO"
        ) {
          try {
            const fund = await fetchFundDetail(id);
            setFundDetail(fund);
          } catch {
            // Fund detail is optional
          }
        }

        // Parse chart data from initial load
        if (dashboardData) {
          const { points, perf } = parseDashboard(dashboardData);
          setChartData(points);
          setChartPerf(perf);
          // If initial was ARS but objective is USD, reload chart in USD
          if (initCur === "USD") {
            loadChart("HISTORICAL", "USD");
          }
        }
      } catch (err) {
        console.error("[InvestmentDetailPage] Load error:", err);
        setError("No pudimos cargar el detalle. Intentá de nuevo.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [id, parseDashboard, loadChart]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Loading ──
  if (loading) return <DetailSkeleton />;

  // ── Error ──
  if (error || !detail) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center gap-4 px-6">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-2">
          <span className="text-3xl">😞</span>
        </div>
        <h2 className="text-xl font-black text-gray-900 text-center">
          {error || "Inversión no encontrada"}
        </h2>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          Puede que esta inversión haya sido eliminada o que no tengamos datos
          disponibles en este momento.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => loadData()}
            className="px-5 py-2.5 bg-[#3246ff] text-white rounded-xl font-semibold text-sm hover:bg-[#2635c2] transition-colors"
          >
            Reintentar
          </button>
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // ── Compute display values ──
  const isFund = detail.objective_type === "FUND";
  const isPack = detail.objective_type === "PORTFOLIO";
  const objType = detail.objective_type;
  const accent = getTypeAccent(objType);
  const typeLabel = getObjectiveTypeLabel(objType);

  // Position values — holdings is the primary financial source
  const currentValueARS = holdingData?.current_position_value ?? detail.current_position_value ?? 0;
  const currentValueUSD = holdingData?.current_position_value_usd ?? detail.current_position_value_usd ?? 0;

  // If we have fund detail, use its richer data for performance
  const fundPerf = fundDetail
    ? currency === "ARS"
      ? fundDetail.performance_pesos
      : fundDetail.performance
    : null;

  const displayValue =
    currency === "ARS"
      ? `$ ${formatARS(isFund && fundDetail ? (fundDetail.current_position_value_pesos ?? currentValueARS) : currentValueARS)}`
      : `U$S ${formatUSD(isFund && fundDetail ? (fundDetail.current_position_value ?? currentValueUSD) : currentValueUSD)}`;

  // Chart period labels
  const chartPeriods: { key: ChartPeriod; label: string }[] = [
    { key: "1M", label: "1M" },
    { key: "YTD", label: "YTD" },
    { key: "1A", label: "1A" },
    { key: "HISTORICAL", label: "Histórico" },
  ];

  // Contributions, withdrawals, profit (from holdings, with currency awareness)
  const contributionsARS = holdingData?.contributions_accrued ?? 0;
  const contributionsUSD = holdingData?.contributions_accrued_usd ?? 0;
  const withdrawalsARS = holdingData?.withdrawal_accrued ?? 0;
  const withdrawalsUSD = holdingData?.withdrawal_accrued_usd ?? 0;
  const profitARS = holdingData?.profit_accrued ?? 0;
  const profitUSD = holdingData?.profit_accrued_usd ?? 0;

  const displayContributions = currency === "ARS" ? contributionsARS : contributionsUSD;
  const displayWithdrawals = currency === "ARS" ? withdrawalsARS : withdrawalsUSD;
  const displayProfit = currency === "ARS" ? profitARS : profitUSD;
  const profitPositive = displayProfit >= 0;

  // Performance — from holdings rentability
  const perf =
    fundPerf ??
    (holdingData ? (currency === "ARS" ? holdingData.rentability_accrued : holdingData.rentability_accrued_usd) : null) ??
    (chartPerf !== 0 ? chartPerf : null) ??
    detail.rentability ??
    detail.percentage_change ??
    0;
  const perfDisplay = formatPerformance(perf);
  const perfPositive = (perf ?? 0) >= 0;

  // Daily performance — for the title badge
  const dailyPerf = holdingData
    ? (currency === "ARS" ? holdingData.rentability_daily : holdingData.rentability_daily_usd)
    : detail.percentage_change ?? 0;
  const dailyPerfDisplay = formatPerformance(dailyPerf);
  const dailyPerfPositive = (dailyPerf ?? 0) >= 0;

  // Configuration
  const config = detail.configuration ?? {};
  const goalAmount = config.goal_amount ?? 0;
  const startingAmount = config.starting_amount ?? 0;
  const monthlyAmount = config.monthly_amount ?? 0;

  // Goal progress
  const goalProgress =
    goalAmount > 0
      ? Math.min(100, Math.round((currentValueARS / goalAmount) * 100))
      : 0;
  const goalReached = goalProgress >= 100;

  // Portfolio instruments — from holdings, fallback to tracing
  const portfolio: InstrumentHolding[] = holdingData?.portfolio as InstrumentHolding[] ?? detail.portfolio ?? [];

  // Pending amounts
  const pendingAmount = isFund && fundDetail
    ? (currency === "ARS" ? fundDetail.pending_amount_ars : fundDetail.pending_amount)
    : 0;

  // Tab config
  const tabs = [
    { key: "overview" as const, label: "Resumen" },
    ...(portfolio.length > 0
      ? [{ key: "composition" as const, label: "Composición" }]
      : []),
    { key: "info" as const, label: "Información" },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* ── Header ── */}
      <div
        className={`bg-gradient-to-br ${accent.gradient} text-white pb-32 pt-8 px-6 relative overflow-hidden`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div className="flex items-center gap-2">
            {!isFund && (
              <button
                onClick={() =>
                  setCurrency((c) => (c === "ARS" ? "USD" : "ARS"))
                }
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold"
              >
                {currency === "USD" ? "🇺🇸 USD" : "🇦🇷 ARS"}
              </button>
            )}
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`size-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20 pb-12">
        {/* ── Value card ── */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          {/* Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <h1 className="text-2xl font-black text-gray-900">
              {detail.name}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${dailyPerfPositive ? "bg-[#CEF2C5] text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {dailyPerfDisplay}
            </span>
          </div>

          {/* Type badge */}
          <div className="flex justify-center mb-6">
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-lg ${accent.badgeCls}`}
            >
              {typeLabel}
            </span>
          </div>

          {/* Main amount */}
          <div className="text-center mb-8">
            <p className="text-5xl font-black text-gray-900 tabular-nums">
              {displayValue}
            </p>
            <p className="text-lg text-gray-500 font-semibold mt-2">
              Valor actual •{" "}
              {isFund ? (
                <span>
                  {detail.currency_code === "ARS" ? "🇦🇷 ARS" : "🇺🇸 USD"}
                </span>
              ) : (
                <span>
                  {currency === "ARS" ? "🇦🇷 ARS" : "🇺🇸 USD"}
                </span>
              )}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Aportes */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Plus className="size-4 text-blue-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 tabular-nums">
                {currency === "ARS"
                  ? `$ ${formatCurrency(displayContributions)}`
                  : `U$S ${formatCurrency(displayContributions)}`}
              </p>
              <p className="text-sm text-gray-600 font-semibold">Aportes</p>
            </div>

            {/* Ganancias */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {profitPositive ? (
                  <TrendingUp className="size-4 text-green-600" />
                ) : (
                  <TrendingDown className="size-4 text-red-500" />
                )}
              </div>
              <p
                className={`text-2xl font-black tabular-nums ${profitPositive ? "text-green-600" : "text-red-500"}`}
              >
                {currency === "ARS"
                  ? `$ ${formatCurrency(Math.abs(displayProfit))}`
                  : `U$S ${formatCurrency(Math.abs(displayProfit))}`}
              </p>
              <p className="text-sm text-gray-600 font-semibold">
                {profitPositive ? "Ganancia" : "Pérdida"}
              </p>
            </div>

            {/* Retiros */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Minus className="size-4 text-orange-500" />
              </div>
              <p className="text-2xl font-black text-gray-900 tabular-nums">
                {currency === "ARS"
                  ? `$ ${formatCurrency(displayWithdrawals)}`
                  : `U$S ${formatCurrency(displayWithdrawals)}`}
              </p>
              <p className="text-sm text-gray-600 font-semibold">Retiros</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button className="py-4 rounded-2xl bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white font-bold text-lg hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg hover:shadow-xl">
              Sumar
            </button>
            <button className="py-4 rounded-2xl border-2 border-[#3246ff] text-[#3246ff] font-bold text-lg hover:bg-blue-50 transition-all">
              Retirar
            </button>
          </div>
        </div>

        {/* ── Goal progress (if goal exists) ── */}
        {goalAmount > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                🎯 Seguimiento de objetivo
              </h2>
              {goalReached ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 animate-pulse">
                  ✅ ¡Meta alcanzada!
                </span>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${goalProgress >= 75
                    ? "bg-orange-100 text-orange-700"
                    : goalProgress >= 50
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                    }`}
                >
                  {goalProgress}% completado
                </span>
              )}
            </div>

            <div className="flex items-center justify-between flex-1 bg-gray-50 rounded-2xl p-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Meta establecida</p>
                <p className="text-2xl font-black text-gray-900">
                  $ {formatCurrency(goalAmount)} {detail.currency_code}
                </p>
              </div>
            </div>

            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  $ {formatCurrency(currentValueARS)} {detail.currency_code}
                </span>
                <span className="text-sm font-semibold text-gray-400">
                  $ {formatCurrency(goalAmount)} {detail.currency_code}
                </span>
              </div>
              <div className="relative w-full h-5 bg-gray-100 rounded-full overflow-hidden">
                {[25, 50, 75].map((milestone) => (
                  <div
                    key={milestone}
                    className="absolute top-0 bottom-0 w-px bg-gray-300 z-10"
                    style={{ left: `${milestone}%` }}
                  />
                ))}
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${goalReached
                    ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600"
                    : goalProgress >= 75
                      ? "bg-gradient-to-r from-orange-400 to-amber-500"
                      : goalProgress >= 50
                        ? "bg-gradient-to-r from-purple-500 to-pink-500"
                        : "bg-gradient-to-r from-[#3246ff] to-[#4856ff]"
                    }`}
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 px-1">
                {[0, 25, 50, 75, 100].map((pct) => (
                  <span
                    key={pct}
                    className={`text-[9px] ${goalProgress >= pct ? "text-gray-600 font-semibold" : "text-gray-400"}`}
                  >
                    {pct}%
                  </span>
                ))}
              </div>
            </div>

            {!goalReached && (
              <div className="text-center my-4">
                <span className="text-sm text-gray-500">Te faltan </span>
                <span className="text-lg font-black text-gray-900">
                  $ {formatCurrency(Math.max(0, goalAmount - currentValueARS))}{" "}
                  {detail.currency_code}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Configuration card ── */}
        {(startingAmount > 0 || monthlyAmount > 0) && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-2xl">
                💡
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg mb-2">
                  Configuración de tu inversión
                </p>
                <div className="space-y-2">
                  {startingAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Inversión inicial
                      </span>
                      <span className="font-bold text-gray-900">
                        $ {formatCurrency(startingAmount)}{" "}
                        {detail.currency_code}
                      </span>
                    </div>
                  )}
                  {monthlyAmount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Aporte mensual
                      </span>
                      <span className="font-bold text-[#3246ff]">
                        $ {formatCurrency(monthlyAmount)}{" "}
                        {detail.currency_code}
                      </span>
                    </div>
                  )}
                  {detail.investment_strategy && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estrategia</span>
                      <span className="font-bold text-gray-900">
                        {detail.investment_strategy}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.key
                ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Evolution chart */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              {/* Header with period selector and currency toggle */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-[13px] font-medium tracking-wide">
                  Evolución histórica
                </span>
                <div className="flex items-center gap-3">
                  {/* Currency toggle */}
                  <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                    {(["ARS", "USD"] as const).map((cur) => (
                      <button
                        key={cur}
                        onClick={() => {
                          setChartCurrency(cur);
                          loadChart(chartPeriod, cur);
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${chartCurrency === cur
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                          }`}
                      >
                        {cur === "ARS" ? "🇦🇷 ARS" : "🇺🇸 USD"}
                      </button>
                    ))}
                  </div>
                  {/* Period selector */}
                  <div className="flex gap-0.5">
                    {chartPeriods.map((p) => (
                      <button
                        key={p.key}
                        onClick={() => {
                          setChartPeriod(p.key);
                          loadChart(p.key, chartCurrency);
                        }}
                        style={{
                          padding: "2px 10px",
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          border: "none",
                          outline: "none",
                          background: chartPeriod === p.key ? "#f3f4f6" : "transparent",
                          color: chartPeriod === p.key ? "#111827" : "#6b7280",
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance badge */}
              {chartPerf !== 0 && (
                <div className="mb-4">
                  <span
                    className={`inline-block text-xs font-bold px-2.5 py-1 rounded-lg ${chartPerf >= 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                      }`}
                  >
                    {chartPerf >= 0 ? "+" : ""}
                    {(chartPerf * 100).toFixed(2)}% rendimiento
                  </span>
                </div>
              )}

              {/* Chart */}
              {chartLoading ? (
                <div className="h-72 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#3246ff] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : chartData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 4, right: 4, left: 4, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3246ff" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#3246ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14B87D" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#14B87D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="x"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 500 }}
                        interval={"equidistantPreserveStart"}
                        minTickGap={40}
                        dy={6}
                      />
                      <YAxis hide />
                      <Tooltip
                        content={<ChartTooltip cur={chartCurrency} />}
                        cursor={{
                          stroke: "#e5e7eb",
                          strokeWidth: 1,
                          strokeDasharray: "4 4",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="position"
                        name="Posición"
                        stroke="#3246ff"
                        strokeWidth={2}
                        fill="url(#posGrad)"
                        dot={false}
                        activeDot={{
                          r: 4.5,
                          fill: "#3246ff",
                          stroke: "white",
                          strokeWidth: 2,
                        }}
                        animationDuration={500}
                      />
                      <Area
                        type="monotone"
                        dataKey="contributions"
                        name="Aportes"
                        stroke="#14B87D"
                        strokeWidth={2}
                        fill="url(#contribGrad)"
                        dot={false}
                        activeDot={{
                          r: 4.5,
                          fill: "#14B87D",
                          stroke: "white",
                          strokeWidth: 2,
                        }}
                        animationDuration={500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                      <span className="text-xl">📊</span>
                    </div>
                    <p className="text-gray-500 text-[13px] font-medium">
                      Aún no hay datos históricos
                    </p>
                  </div>
                </div>
              )}

              {/* Legend */}
              {chartData.length > 0 && (
                <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3246ff]" />
                    <span className="text-xs font-medium text-gray-600">Posición actual</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#14B87D]" />
                    <span className="text-xs font-medium text-gray-600">Aportes acumulados</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-md p-5">
                <p className="text-xs text-gray-500 mb-1">Moneda</p>
                <p className="text-lg font-black text-gray-900">
                  {detail.currency_code === "ARS"
                    ? "🇦🇷 Pesos argentinos"
                    : "🇺🇸 Dólares"}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-5">
                <p className="text-xs text-gray-500 mb-1">Tipo de objetivo</p>
                <p className="text-lg font-black text-gray-900">{typeLabel}</p>
              </div>
              {detail.created_at && (
                <div className="bg-white rounded-2xl shadow-md p-5">
                  <p className="text-xs text-gray-500 mb-1">Creado</p>
                  <p className="text-lg font-black text-gray-900">
                    {new Date(detail.created_at).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
              {detail.packets > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-5">
                  <p className="text-xs text-gray-500 mb-1">Packs</p>
                  <p className="text-lg font-black text-gray-900">
                    {detail.packets}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Composition tab ── */}
        {activeTab === "composition" && portfolio.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <PieChartIcon className="size-6 text-[#3246ff]" />
              Composición de la cartera
            </h2>

            <div className="flex flex-col lg:flex-row items-center gap-8 mb-6">
              {/* Pie chart */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={portfolio.map((h) => ({
                        name: h.instrument_code,
                        value: h.percentage ?? 0,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {portfolio.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-gray-900">
                    {portfolio.length}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 tracking-wider">
                    ACTIVOS
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 w-full space-y-3">
                {portfolio.map((h, idx) => {
                  const pct = h.percentage ?? 0;
                  const color = PIE_COLORS[idx % PIE_COLORS.length];
                  return (
                    <div
                      key={h.instrument_id ?? idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-1 h-10 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">
                            {h.instrument_code}
                          </p>
                          <p className="text-xs text-gray-500">
                            {h.type ?? h.instrument_type ?? "—"} •{" "}
                            {h.qty?.toLocaleString("es-AR") ?? 0} nominales
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-sm tabular-nums">
                          $ {formatARS(h.current_amount ?? 0)}
                        </p>
                        <p className="text-xs text-gray-500 tabular-nums">
                          {pct.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="size-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                La composición refleja tus tenencias actuales según la última
                valuación del mercado.
              </p>
            </div>
          </div>
        )}

        {/* ── Info tab ── */}
        {activeTab === "info" && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Info className="size-6 text-[#3246ff]" />
              Información del objetivo
            </h2>

            <div className="space-y-3">
              <InfoRow
                label="ID del objetivo"
                value={detail.id}
              />
              <InfoRow
                label="Tipo"
                value={typeLabel}
              />
              <InfoRow
                label="Moneda"
                value={
                  detail.currency_code === "ARS"
                    ? "🇦🇷 Pesos argentinos (ARS)"
                    : "🇺🇸 Dólares estadounidenses (USD)"
                }
              />
              {detail.investment_strategy && (
                <InfoRow
                  label="Estrategia de inversión"
                  value={detail.investment_strategy}
                />
              )}
              {detail.created_at && (
                <InfoRow
                  label="Fecha de creación"
                  value={new Date(detail.created_at).toLocaleDateString(
                    "es-AR",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                />
              )}
              {detail.objective_configuration_id && (
                <InfoRow
                  label="Configuración"
                  value={detail.objective_configuration_id}
                />
              )}
              {startingAmount > 0 && (
                <InfoRow
                  label="Inversión inicial"
                  value={`$ ${formatCurrency(startingAmount)} ${detail.currency_code}`}
                />
              )}
              {monthlyAmount > 0 && (
                <InfoRow
                  label="Aporte mensual"
                  value={`$ ${formatCurrency(monthlyAmount)} ${detail.currency_code}`}
                />
              )}
              {goalAmount > 0 && (
                <InfoRow
                  label="Meta"
                  value={`$ ${formatCurrency(goalAmount)} ${detail.currency_code}`}
                />
              )}
              {detail.goal_deadline && (
                <InfoRow
                  label="Fecha objetivo"
                  value={new Date(detail.goal_deadline).toLocaleDateString(
                    "es-AR",
                    { day: "numeric", month: "long", year: "numeric" }
                  )}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Info Row component ────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
      <span className="text-sm font-semibold text-gray-600">{label}</span>
      <span className="text-sm font-bold text-gray-900 text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}