"use client";

import { ChevronRight, Plus, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AddToInvestmentFlow } from "../../../components/AddToInvestmentFlow";
import { ProductSelector } from "../../../components/ProductSelector";
import { CreateWelfiPesosFlow } from "../../../components/CreateWelfiPesosFlow";
import {
  fetchObjectivesReal,
  fetchPanel,
} from "../../../services/portfolio.service";
import type { TracingObjective, PanelData } from "../../../types/api.types";
import type { Investment } from "../../../constants/mockData";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatARS(n: number): string {
  return n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatUSD(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPerformance(perf: number): string {
  const pct = perf * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

// ─── Skeleton Card ──────────────────────────────────────────────────────────

function SkeletonCard({ wide = false }: { wide?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-gray-100 animate-pulse ${wide ? "col-span-full max-w-md" : ""}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
      <div className="h-7 bg-gray-200 rounded w-40 mb-3" />
      <div className="h-9 bg-gray-100 rounded-lg w-full" />
    </div>
  );
}

// ─── Type configuration ─────────────────────────────────────────────────────

const TYPE_CONFIG: Record<string, { label: string; accentColor: string; accentBg: string }> = {
  INVESTMENT: {
    label: "Estrategias y objetivos personales",
    accentColor: "text-[#e5582f]",
    accentBg: "bg-[#e5582f]",
  },
  PACK: {
    label: "Packs temáticos",
    accentColor: "text-[#9b59b6]",
    accentBg: "bg-[#9b59b6]",
  },
  EMERGENCY: {
    label: "Fondo de Emergencia",
    accentColor: "text-emerald-600",
    accentBg: "bg-emerald-500",
  },
  RETIREMENT: {
    label: "Fondo de Retiro",
    accentColor: "text-amber-600",
    accentBg: "bg-amber-500",
  },
};

const TYPE_ORDER = ["INVESTMENT", "PACK", "EMERGENCY", "RETIREMENT"];

// ─── Badge config per objective type ─────────────────────────────────────────

function getTypeBadge(type: string) {
  const map: Record<string, { label: string; cls: string }> = {
    INVESTMENT: { label: "Estrategia", cls: "bg-orange-50 text-orange-600" },
    PACK: { label: "Pack", cls: "bg-purple-50 text-purple-600" },
    EMERGENCY: { label: "Fondo", cls: "bg-emerald-50 text-emerald-600" },
    RETIREMENT: { label: "Retiro", cls: "bg-amber-50 text-amber-600" },
  };
  return map[type] ?? { label: type, cls: "bg-gray-50 text-gray-600" };
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function InvestmentsPage() {
  const router = useRouter();

  // ── UI state ──
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showCreateWelfiPesosFlow, setShowCreateWelfiPesosFlow] = useState(false);
  const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");

  // ── Data state ──
  const [customs, setCustoms] = useState<TracingObjective[]>([]);
  const [recommended, setRecommended] = useState<TracingObjective[]>([]);
  const [panel, setPanel] = useState<PanelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const availableBalance = {
    ars: formatARS(panel?.available_in_pesos ?? 0),
    usd: formatUSD(panel?.available_in_dollars ?? 0),
  };

  // ── Data loading ──
  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const [objData, panelData] = await Promise.all([
        fetchObjectivesReal(),
        fetchPanel(),
      ]);
      setCustoms(objData?.customs ?? []);
      setRecommended(objData?.recommended ?? []);
      setPanel(panelData);
    } catch (err) {
      console.error("[InvestmentsPage] Load error:", err);
      setError("No pudimos cargar tus inversiones. Intentá de nuevo.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Group ALL objectives (customs + recommended) by objective_type ──
  const allObjectives = [...customs, ...recommended];
  const groupedByType = allObjectives.reduce<Record<string, TracingObjective[]>>(
    (acc, obj) => {
      const type = obj.objective_type || "OTHER";
      if (!acc[type]) acc[type] = [];
      acc[type].push(obj);
      return acc;
    },
    {}
  );
  const sortedTypes = [
    ...TYPE_ORDER.filter((t) => groupedByType[t]),
    ...Object.keys(groupedByType).filter((t) => !TYPE_ORDER.includes(t)),
  ];

  // ── Welfi Pesos / Dólares from PANEL (aggregated — FUND type excluded from get_objectives) ──
  const welfiPesosTotalARS = panel?.welfi_pesos_holdings ?? 0;
  const welfiPesosPerf = panel?.welfi_pesos_performance ?? 0;
  const welfiDolaresHoldingsUSD = panel?.welfi_dolares_holdings ?? 0;
  const welfiDolaresPerf = panel?.welfi_dolares_performance ?? 0;

  // ── Toggleable-currency card for objectives ──
  const renderObjectiveCard = (obj: TracingObjective) => {
    const isPositive = obj.performance >= 0;
    const badge = getTypeBadge(obj.objective_type);
    const displayValue = currency === "USD"
      ? `U$S ${formatUSD(obj.current_position_value)}`
      : `$ ${formatARS(obj.current_position_value_pesos)}`;
    const perfDisplay = currency === "USD"
      ? formatPerformance(obj.performance)
      : formatPerformance(obj.performance_pesos);
    const asInvestment: Investment = {
      id: obj.id, emoji: obj.icon || "📊", name: obj.title,
      amount: currency === "USD" ? formatUSD(obj.current_position_value) : formatARS(obj.current_position_value_pesos),
      currency: currency === "USD" ? "USD" : "ARS", returnRate: perfDisplay, isPositive,
    };

    return (
      <div
        key={obj.id}
        onClick={() => router.push(`/investments/${obj.id}`)}
        className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
      >
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-100">
              <span className="text-lg">{obj.icon || "📊"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">{obj.title}</h3>
              <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5 ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
            <ChevronRight className="size-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
          </div>
          <div className="flex items-end justify-between">
            <p className="text-xl font-black text-gray-900 tabular-nums leading-none">{displayValue}</p>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
              {isPositive ? <TrendingUp className="size-3 inline mr-0.5 -mt-0.5" /> : <TrendingDown className="size-3 inline mr-0.5 -mt-0.5" />}
              {perfDisplay}
            </span>
          </div>
          {obj.pending_amount > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] text-amber-600 font-medium">U$S {formatUSD(obj.pending_amount)} pendiente</span>
            </div>
          )}
        </div>
        <div className="border-t border-gray-50 px-5 py-3 bg-gray-50/30">
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedInvestment(asInvestment); setShowAddFlow(true); }}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#3246ff] text-white rounded-lg hover:bg-[#2635c2] transition-colors font-semibold text-xs"
          >
            <Plus className="size-3.5" /> Sumar
          </button>
        </div>
      </div>
    );
  };

  // ── Main render ──
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 py-6 space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            Todas mis inversiones
          </h2>
          <button
            onClick={() => setShowProductSelector(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#3246ff] text-white rounded-lg font-semibold text-xs hover:bg-[#2635c2] transition-colors shadow-sm"
          >
            <Plus className="size-3.5" />
            Nueva inversión
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrency((c) => c === "ARS" ? "USD" : "ARS")}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 transition-colors text-xs font-semibold"
          >
            {currency === "USD" ? "🇺🇸 USD" : "🇦🇷 ARS"}
          </button>
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`size-3.5 text-gray-500 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile new investment */}
      <button
        onClick={() => setShowProductSelector(true)}
        className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#3246ff] text-white rounded-xl font-semibold text-sm hover:bg-[#2635c2] transition-colors shadow-sm"
      >
        <Plus className="size-4" />
        Nueva inversión
      </button>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <span>{error}</span>
          <button onClick={() => loadData()} className="text-xs font-bold underline hover:no-underline">Reintentar</button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* Welfi Pesos — aggregated from panel, always ARS */}
          {welfiPesosTotalARS > 0 && (
            <section>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-0.5 h-5 bg-[#3246ff] rounded-full" />
                <h3 className="text-sm font-bold text-gray-800">Welfi Pesos</h3>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center flex-shrink-0 border border-blue-100">
                        <span className="text-lg">💰</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">Welfi Pesos</h3>
                        <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5 bg-blue-50 text-blue-600">
                          Renta fija ARS
                        </span>
                      </div>
                      <ChevronRight className="size-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-xl font-black text-gray-900 tabular-nums leading-none">
                        $ {formatARS(welfiPesosTotalARS)}
                      </p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${welfiPesosPerf >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                        {welfiPesosPerf >= 0 ? <TrendingUp className="size-3 inline mr-0.5 -mt-0.5" /> : <TrendingDown className="size-3 inline mr-0.5 -mt-0.5" />}
                        {welfiPesosPerf >= 0 ? "+" : ""}{welfiPesosPerf.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-50 px-5 py-3 bg-gray-50/30">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowCreateWelfiPesosFlow(true); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#3246ff] text-white rounded-lg hover:bg-[#2635c2] transition-colors font-semibold text-xs"
                    >
                      <Plus className="size-3.5" /> Sumar
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Welfi Dólares — aggregated from panel, always USD */}
          {welfiDolaresHoldingsUSD > 0 && (
            <section>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-0.5 h-5 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-bold text-gray-800">Welfi Dólares</h3>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center flex-shrink-0 border border-green-100">
                        <span className="text-lg">💵</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-gray-900 leading-tight">Welfi Dólares</h3>
                        <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-0.5 bg-green-50 text-green-600">
                          Renta fija USD
                        </span>
                      </div>
                      <ChevronRight className="size-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
                    </div>
                    <div className="flex items-end justify-between">
                      <p className="text-xl font-black text-gray-900 tabular-nums leading-none">
                        U$S {formatUSD(welfiDolaresHoldingsUSD)}
                      </p>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${welfiDolaresPerf >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                        {welfiDolaresPerf >= 0 ? <TrendingUp className="size-3 inline mr-0.5 -mt-0.5" /> : <TrendingDown className="size-3 inline mr-0.5 -mt-0.5" />}
                        {welfiDolaresPerf >= 0 ? "+" : ""}{welfiDolaresPerf.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-50 px-5 py-3 bg-gray-50/30">
                    <button
                      onClick={(e) => { e.stopPropagation(); }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#3246ff] text-white rounded-lg hover:bg-[#2635c2] transition-colors font-semibold text-xs"
                    >
                      <Plus className="size-3.5" /> Sumar
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* All objectives grouped by type */}
          {sortedTypes.map((type) => {
            const config = TYPE_CONFIG[type] ?? { label: type, accentBg: "bg-gray-400" };
            const objectives = groupedByType[type];
            if (!objectives?.length) return null;

            return (
              <section key={type}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-0.5 h-5 ${config.accentBg} rounded-full`} />
                  <h3 className="text-sm font-bold text-gray-800">{config.label}</h3>
                  <span className="text-[11px] text-gray-400 font-medium bg-gray-100 px-1.5 py-0.5 rounded-md">
                    {objectives.length}
                  </span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {objectives.map(renderObjectiveCard)}
                </div>
              </section>
            );
          })}

          {/* Empty state */}
          {allObjectives.length === 0 && welfiPesosTotalARS <= 0 && welfiDolaresHoldingsUSD <= 0 && (
            <div className="text-center py-20">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏦</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Todavía no tenés inversiones</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                Creá tu primera inversión y empezá a hacer rendir tu dinero.
              </p>
              <button
                onClick={() => setShowProductSelector(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3246ff] text-white rounded-xl font-semibold text-sm hover:bg-[#2635c2] transition-colors shadow-sm"
              >
                <Plus className="size-4" />
                Crear mi primera inversión
              </button>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showProductSelector && (
        <ProductSelector
          onClose={() => setShowProductSelector(false)}
          onSelectProduct={(product) => {
            setShowProductSelector(false);
            if (product === "welfi_pesos") setShowCreateWelfiPesosFlow(true);
            else if (product === "strategies") router.push("/strategies");
            else alert(`Seleccionaste: ${product}`);
          }}
        />
      )}
      {showAddFlow && selectedInvestment && (
        <AddToInvestmentFlow
          investment={selectedInvestment}
          availableBalance={availableBalance}
          onClose={() => setShowAddFlow(false)}
        />
      )}
      {showCreateWelfiPesosFlow && (
        <CreateWelfiPesosFlow
          availableBalance={availableBalance}
          onClose={() => setShowCreateWelfiPesosFlow(false)}
        />
      )}
    </div>
  );
}