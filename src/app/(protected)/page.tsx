"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BalanceCard } from "../../components/BalanceCard";
import { InvestmentCard } from "../../components/InvestmentCard";
import { ActionButton } from "../../components/ActionButton";
import { NewsCard } from "../../components/NewsCard";
import { AlertCircle } from "lucide-react";
import { TotalBalanceChart } from "../../components/TotalBalanceChart";
import { InvestmentSelectionModal } from "../../components/InvestmentSelectionModal";
import { AddToInvestmentFlow } from "../../components/AddToInvestmentFlow";
import { CreateWelfiPesosFlow } from "../../components/CreateWelfiPesosFlow";
import { ProductSelector } from "../../components/ProductSelector";
import StrategiesPage from "../../components/StrategiesModal";
import ThematicPacksPage from "../../components/PacksModal";
import { TierBadge } from "../../components/TierBadge";
import { CURRENT_USER_TIER } from "../../constants/tierConfig";
import type { Investment } from "../../constants/mockData";
import {
    fetchPanel,
    fetchObjectivesReal,
} from "../../services/portfolio.service";
import type {
    PanelData,
    TracingObjective,
} from "../../types/api.types";

// ─── Exchange rate constant (todo: pull from /mep/quote) ─────────────────────
const EXCHANGE_RATE = 1000;

// ─── Small skeleton helpers ───────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="rounded-2xl bg-gray-100 animate-pulse h-40" />
    );
}

function SkeletonBalance() {
    return (
        <div className="space-y-2">
            <div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse" />
            <div className="h-5 w-32 bg-white/10 rounded-lg animate-pulse" />
        </div>
    );
}

// ─── Adapter: map API TracingObjective → local Investment interface ───────────
function objectiveToInvestment(obj: TracingObjective): Investment {
    return {
        id: obj.id,
        emoji: obj.icon || "📊",
        name: obj.title,
        amount: (obj.current_position_value_pesos ?? 0).toLocaleString("es-AR", { minimumFractionDigits: 2 }),
        currency: obj.currency_code ?? "ARS",
        returnRate: `${((obj.performance ?? 0) * 100).toFixed(2)}%`,
        isPositive: (obj.performance ?? 0) >= 0,
    };
}


// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter();
    const navigate = (path: string) => router.push(path);
    const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");

    // ── Panel data (single source of truth for totals) ──
    const [panel, setPanel] = useState<PanelData | null>(null);
    const [objectives, setObjectives] = useState<TracingObjective[]>([]);
    const [dataLoading, setDataLoading] = useState(true);
    const [dataError, setDataError] = useState<string | null>(null);

    // ── Flow state ──
    const [showAddFlow, setShowAddFlow] = useState(false);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [selectedInvestmentGroup, setSelectedInvestmentGroup] = useState<Investment[]>([]);
    const [selectedGroupTitle, setSelectedGroupTitle] = useState("");
    const [targetInvestment, setTargetInvestment] = useState<Investment | null>(null);
    const [showCreateWelfiPesosFlow, setShowCreateWelfiPesosFlow] = useState(false);
    const [showStrategiesPage, setShowStrategiesPage] = useState(false);
    const [showProductSelector, setShowProductSelector] = useState(false);
    const [showThematicPacksFlow, setShowThematicPacksFlow] = useState(false);
    const [onModalCreate, setOnModalCreate] = useState<(() => void) | undefined>(undefined);

    // ── Load dashboard data ───────────────────────────────────────────────────
    const loadDashboardData = async () => {
        setDataLoading(true);
        setDataError(null);
        try {
            // get_panel_for_profile = single call that returns ALL totals
            const [panelData, objectivesData] = await Promise.all([
                fetchPanel(),
                fetchObjectivesReal().catch(() => ({ customs: [], recommended: [] })),
            ]);
            setPanel(panelData);
            const allObjs = [
                ...(objectivesData?.customs ?? []),
                ...(objectivesData?.recommended ?? []),
            ];
            setObjectives(allObjs);
            console.log("[DEBUG] Raw objectives:", JSON.stringify(allObjs, null, 2));
        } catch (err) {
            console.error("Dashboard load error:", err);
            setDataError("No pudimos cargar tus datos. Verificá tu conexión.");
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // ── Listen for sidebar 'Nueva Inversión' button ──
    useEffect(() => {
        const handler = () => setShowProductSelector(true);
        window.addEventListener("welfi:new-investment", handler);
        return () => window.removeEventListener("welfi:new-investment", handler);
    }, []);

    // ── Computed values from panel ─────────────────────────────────────────────
    const dollarValue = panel?.dollar_value ?? 1422; // ARS por USD

    // "Todo mi dinero" — balance viene en USD desde el engine
    const balanceUSD = panel?.balance ?? 0;
    const balanceARS = balanceUSD * dollarValue;

    const totalBalance = currency === "USD"
        ? balanceUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : balanceARS.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Rendimiento diario (Porcentaje)
    // El JSON trae el % diario en general_performance (ya viene como %, no multiplicar por 100)
    const dailyPerfPctUSD = panel?.general_performance ?? 0;
    const dailyPerfPctARS = panel?.general_performance_pesos ?? 0;

    const dailyPerfDisplay = currency === "USD"
        ? `${dailyPerfPctUSD >= 0 ? "+" : ""}${dailyPerfPctUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
        : `${dailyPerfPctARS >= 0 ? "+" : ""}${dailyPerfPctARS.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
    const isDailyPositive = currency === "USD" ? dailyPerfPctUSD >= 0 : dailyPerfPctARS >= 0;

    // Variación en pesos/dólares (monto absoluto diario)
    const dailyPerfAmtUSD = balanceUSD * (dailyPerfPctUSD / 100);
    const dailyPerfAmtARS = balanceARS * (dailyPerfPctARS / 100);
    const dailyPerfAmtDisplay = currency === "USD"
        ? `${dailyPerfAmtUSD >= 0 ? "+" : ""}USD ${dailyPerfAmtUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `${dailyPerfAmtARS >= 0 ? "+" : ""}ARS ${dailyPerfAmtARS.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Welfi Pesos (tenencias y rendimiento)
    const welfiPesosTotalARS = panel?.welfi_pesos_holdings ?? 0;
    const welfiPesosDisplayAmount = currency === "USD"
        ? `$ ${(welfiPesosTotalARS / dollarValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : `$ ${welfiPesosTotalARS.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    // Ya viene como porcentaje
    const welfiPesosPerfPct = panel?.welfi_pesos_performance ?? 0;
    const welfiPesosTNAStr = `${welfiPesosPerfPct > 0 ? "+" : ""}${welfiPesosPerfPct.toFixed(2)}%`;
    const isWelfiPesosPositive = welfiPesosPerfPct >= 0;

    // Welfi Dólares (tenencias y rendimiento)
    const welfiDolaresHoldingsUSD = panel?.welfi_dolares_holdings ?? 0;
    const welfiDolaresPerfPct = panel?.welfi_dolares_performance ?? 0;
    const welfiDolaresDisplayAmount = currency === "USD"
        ? `$ ${welfiDolaresHoldingsUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : `$ ${(welfiDolaresHoldingsUSD * dollarValue).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    const welfiDolaresPerfDisplay = `${welfiDolaresPerfPct > 0 ? "+" : ""}${welfiDolaresPerfPct.toFixed(2)}%`;
    const isWelfiDolaresPositive = welfiDolaresPerfPct >= 0;

    // Packs & estrategias del panel (globales, en USD desde engine)
    const packsHoldingsUSD = panel?.packs_holdings ?? 0;
    const goalsHoldingsUSD = panel?.goals_holdings ?? 0;

    const packsPerfUSD = panel?.packs_performance ?? 0;
    const packsPerfARS = panel?.packs_performance_pesos ?? 0;
    const packsPerfDisplay = currency === "USD"
        ? `${packsPerfUSD >= 0 ? "+" : ""}${packsPerfUSD.toFixed(2)}%`
        : `${packsPerfARS >= 0 ? "+" : ""}${packsPerfARS.toFixed(2)}%`;
    const isPacksPositive = currency === "USD" ? packsPerfUSD >= 0 : packsPerfARS >= 0;

    const goalsPerfUSD = panel?.goals_performance ?? 0;
    const goalsPerfARS = panel?.goals_performance_pesos ?? 0;
    const goalsPerfDisplay = currency === "USD"
        ? `${goalsPerfUSD >= 0 ? "+" : ""}${goalsPerfUSD.toFixed(2)}%`
        : `${goalsPerfARS >= 0 ? "+" : ""}${goalsPerfARS.toFixed(2)}%`;
    const isGoalsPositive = currency === "USD" ? goalsPerfUSD >= 0 : goalsPerfARS >= 0;

    // Formatted amounts for Estrategias and Packs (USD from engine, convert to ARS)
    const goalsDisplayAmount = currency === "USD"
        ? `$ ${goalsHoldingsUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : `$ ${(goalsHoldingsUSD * dollarValue).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    const packsDisplayAmount = currency === "USD"
        ? `$ ${packsHoldingsUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : `$ ${(packsHoldingsUSD * dollarValue).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;


    // Disponible para operar
    const availableARS = panel?.available_in_pesos ?? 0;
    const availableUSD = panel?.available_in_dollars ?? 0;
    const availableBalanceForModal = {
        ars: availableARS.toLocaleString("es-AR", { minimumFractionDigits: 2 }),
        usd: availableUSD.toLocaleString("en-US", { minimumFractionDigits: 2 }),
    };

    // Objectives split by type (para los cards de inversión)
    const getObjType = (o: TracingObjective) => o.objective_type || "";
    const strategies = objectives.filter((o) => getObjType(o) === "INVESTMENT");
    const packs = objectives.filter((o) => getObjType(o) === "PACK");
    const emergencyFunds = objectives.filter((o) => getObjType(o) === "EMERGENCY");
    const retirementFunds = objectives.filter((o) => getObjType(o) === "RETIREMENT");

    const welfiPesosInvestments: Investment[] = welfiPesosTotalARS > 0 ? [{
        id: "welfi-pesos",
        emoji: "💰",
        name: "Welfi Pesos",
        amount: welfiPesosTotalARS.toLocaleString("es-AR", { minimumFractionDigits: 2 }),
        currency: "ARS",
        returnRate: welfiPesosTNAStr,
        isPositive: true,
    }] : [];
    const investmentStrategies = strategies.map(objectiveToInvestment);
    const thematicPacks = packs.map(objectiveToInvestment);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleAddMoneyClick = (investments: Investment[], title: string, onCreate?: () => void) => {
        if (investments.length === 0) { if (onCreate) onCreate(); return; }
        if (investments.length === 1) {
            setTargetInvestment(investments[0]);
            setShowAddFlow(true);
        } else {
            setSelectedInvestmentGroup(investments);
            setSelectedGroupTitle(title);
            setOnModalCreate(() => onCreate);
            setShowSelectionModal(true);
        }
    };

    const handleProductSelect = (productId: string) => {
        setShowProductSelector(false);
        switch (productId) {
            case "welfi_pesos": setShowCreateWelfiPesosFlow(true); break;
            case "strategies": setShowStrategiesPage(true); break;
            case "packs": setShowThematicPacksFlow(true); break;
            default: console.log("Selected:", productId);
        }
    };

    const toggleCurrency = () => setCurrency((prev) => (prev === "USD" ? "ARS" : "USD"));

    // ── Modal screens ─────────────────────────────────────────────────────────
    if (showStrategiesPage) {
        return <StrategiesPage onClose={() => setShowStrategiesPage(false)} onSelectStrategy={(id) => setShowStrategiesPage(false)} />;
    }
    if (showThematicPacksFlow) {
        return <ThematicPacksPage availableBalance={availableBalanceForModal} onBack={() => setShowThematicPacksFlow(false)} />;
    }

    // ── Check Customer Status ───────────────────────────────────────────────
    // Si ya cargaron los datos y NO es Cliente Activo, mostramos pantalla bloqueada
    if (!dataLoading && panel && panel.customer_status !== "Cliente Activo") {
        return (
            <div className="w-full h-full flex items-center justify-center p-6 bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="size-8" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900">Tu cuenta no está activa</h2>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Parece que tu cuenta (Estado: <span className="font-semibold text-gray-700">{panel.customer_status}</span>) actualmente no está habilitada para operar.
                    </p>
                    <div className="pt-4">
                        <button
                            onClick={() => window.open("https://api.whatsapp.com/send/?phone=5491136979606", "_blank")}
                            className="w-full py-3 px-4 bg-[#3246ff] hover:bg-[#2031d4] text-white rounded-xl font-bold transition-colors"
                        >
                            Contactar a Soporte
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full flex flex-col min-h-full bg-[#f5f5f7]">

            {/* ─── Revolut-style Hero Section ────────────────────────── */}
            <div className="px-4 lg:px-6 pt-4 pb-2 w-full max-w-[1400px] mx-auto">
                <div className="flex flex-col xl:flex-row gap-4">

                    {/* ── Module 1: Balance & Actions ── */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-[20px] p-6 lg:p-8 flex flex-col justify-between xl:w-[480px] shrink-0 relative overflow-hidden group">

                        {/* Top info and toggle */}
                        <div className="flex items-center justify-between mb-8 z-10">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-[13px] font-medium tracking-wide">
                                    Balance Total
                                </span>
                                <TierBadge tier={CURRENT_USER_TIER} />
                            </div>
                            {!dataLoading && (
                                <button
                                    onClick={toggleCurrency}
                                    className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200"
                                    style={{ fontSize: 13, fontWeight: 500 }}
                                >
                                    <span>{currency === "USD" ? "🇺🇸 USD" : "🇦🇷 ARS"}</span>
                                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" className="opacity-70">
                                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Balance Amount */}
                        <div className="z-10 mb-8">
                            {dataLoading ? (
                                <div className="space-y-3">
                                    <div className="h-12 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
                                    <div className="h-5 w-1/2 bg-gray-100 rounded animate-pulse" />
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-gray-900 font-medium text-2xl leading-none select-none tracking-tight">
                                            {currency === "USD" ? "U$S" : "$"}
                                        </span>
                                        <p
                                            className="text-gray-900 font-semibold leading-none"
                                            style={{
                                                fontSize: "clamp(36px, 4vw, 44px)",
                                                letterSpacing: "-1px",
                                                fontVariantNumeric: "tabular-nums",
                                            }}
                                        >
                                            {totalBalance}
                                        </p>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-2.5 mt-2">
                                        <span className={`text-[13px] font-medium flex items-center gap-1 ${isDailyPositive ? "text-emerald-600" : "text-gray-500"}`}>
                                            {isDailyPositive ? (
                                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10L6 2M6 2L2 6M6 2L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            ) : (
                                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2L6 10M6 10L2 6M6 10L10 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                            )}
                                            {dailyPerfAmtDisplay}
                                        </span>
                                        <span className="text-gray-400 text-[13px] font-medium">
                                            {dailyPerfDisplay} hoy
                                        </span>
                                    </div>

                                    {/* Availability */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <span className="text-[12px] text-gray-500 font-medium">ARS disp.</span>
                                            <div className="text-gray-900 font-medium text-[15px] tabular-nums">
                                                $ {availableARS.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                        <div className="hidden sm:block w-[1px] h-8 bg-gray-200" />
                                        <div className="flex-1 flex flex-col gap-1">
                                            <span className="text-[12px] text-gray-500 font-medium">USD disp.</span>
                                            <div className="text-gray-900 font-medium text-[15px] tabular-nums">
                                                $ {availableUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2.5 z-10 pt-6">
                            {[
                                { label: "Ingresar", icon: "↓", onClick: () => alert("Ingresar dinero WIP"), primary: true },
                                { label: "Retirar", icon: "↑", onClick: () => alert("Retirar dinero WIP") },
                                { label: "Invertir", icon: "+", onClick: () => setShowProductSelector(true) },
                            ].map(({ label, icon, onClick, primary }) => (
                                <button
                                    key={label}
                                    onClick={onClick}
                                    className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all duration-200 font-medium tracking-wide text-[13px] ${primary
                                        ? "bg-[#3246ff] text-white hover:bg-[#2031d4] shadow-sm"
                                        : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-sm"
                                        }`}
                                >
                                    <span>{icon}</span>
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Module 2: Evolution Chart ── */}
                    <div className="bg-white border border-gray-200 shadow-sm rounded-[20px] p-6 lg:p-8 flex-1 min-w-0 flex flex-col min-h-[300px] xl:min-h-[360px] relative overflow-hidden">
                        <div className="relative z-10 w-full h-full min-h-[260px]">
                            <TotalBalanceChart currency={currency} dollarValue={dollarValue} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 py-4 flex-1">
                <div className="space-y-4">

                    {/* Error banner */}
                    {dataError && !dataLoading && (
                        <div className="flex items-center justify-between gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                            <span>{dataError}</span>
                            <button
                                onClick={loadDashboardData}
                                className="text-xs font-semibold underline hover:no-underline"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    <div className="space-y-3">
                        {/* Section header */}
                        <h2 className="text-gray-900 text-sm font-semibold px-0.5">Mis inversiones</h2>

                        {/* Cards grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                            {dataLoading ? (
                                [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                            ) : (
                                <>
                                    {/* Welfi Pesos */}
                                    <InvestmentCard
                                        title="Welfi Pesos"
                                        amount={welfiPesosDisplayAmount}
                                        currency={currency}
                                        returnRate={welfiPesosTNAStr}
                                        isPositive={isWelfiPesosPositive}
                                        isEmpty={welfiPesosTotalARS === 0}
                                        onAddMoney={() => handleAddMoneyClick(welfiPesosInvestments, "Welfi Pesos", () => setShowCreateWelfiPesosFlow(true))}
                                        onCreateNew={() => setShowCreateWelfiPesosFlow(true)}
                                    />

                                    {/* Welfi Dólares */}
                                    <InvestmentCard
                                        title="Welfi Dólares"
                                        amount={welfiDolaresDisplayAmount}
                                        currency={currency}
                                        returnRate={welfiDolaresPerfDisplay}
                                        isPositive={isWelfiDolaresPositive}
                                        isEmpty={welfiDolaresHoldingsUSD === 0}
                                        onAddMoney={() => alert("Próximamente: Sumar welfi dólares")}
                                        onCreateNew={() => alert("Próximamente: Crear inversión en Welfi Dólares")}
                                    />

                                    {/* Estrategias */}
                                    <InvestmentCard
                                        title="Estrategias de inversión"
                                        amount={goalsDisplayAmount}
                                        currency={currency}
                                        returnRate={goalsPerfDisplay}
                                        isPositive={isGoalsPositive}
                                        objectivesCount={investmentStrategies.length}
                                        objectivesLabel="objetivos"
                                        onViewAll={() => navigate("/investments")}
                                        onAddMoney={() => handleAddMoneyClick(investmentStrategies, "Estrategias de Inversión", () => setShowStrategiesPage(true))}
                                        onCreateNew={() => setShowStrategiesPage(true)}
                                    />

                                    {/* Packs */}
                                    <InvestmentCard
                                        title="Packs temáticos"
                                        amount={packsDisplayAmount}
                                        currency={currency}
                                        returnRate={packsPerfDisplay}
                                        isPositive={isPacksPositive}
                                        objectivesCount={thematicPacks.length}
                                        objectivesLabel="packs"
                                        onViewAll={() => navigate("/investments")}
                                        onAddMoney={() => handleAddMoneyClick(thematicPacks, "Packs Temáticos", () => setShowThematicPacksFlow(true))}
                                        onCreateNew={() => setShowThematicPacksFlow(true)}
                                    />

                                    {/* Fondo de Emergencia */}
                                    {(() => {
                                        const emergencyTotalUSD = emergencyFunds.reduce((s, o) => s + (o.current_position_value ?? 0), 0);
                                        const emergencyTotalARS = emergencyFunds.reduce((s, o) => s + (o.current_position_value_pesos ?? 0), 0);
                                        const emergencyAmount = currency === "USD"
                                            ? `$ ${emergencyTotalUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                                            : `$ ${emergencyTotalARS.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
                                        const emergencyPerfUSD = emergencyFunds.length > 0
                                            ? emergencyFunds.reduce((s, o) => s + (o.performance ?? 0), 0) / emergencyFunds.length
                                            : 0;
                                        const emergencyPerfARS = emergencyFunds.length > 0
                                            ? emergencyFunds.reduce((s, o) => s + (o.performance_pesos ?? 0), 0) / emergencyFunds.length
                                            : 0;
                                        const emergencyPerf = currency === "USD" ? emergencyPerfUSD : emergencyPerfARS;
                                        const emergencyPerfDisplay = `${emergencyPerf >= 0 ? "+" : ""}${(emergencyPerf * 100).toFixed(2)}%`;
                                        return (
                                            <InvestmentCard
                                                title="Fondo de Emergencia"
                                                amount={emergencyAmount}
                                                currency={currency}
                                                returnRate={emergencyFunds.length > 0 ? emergencyPerfDisplay : ""}
                                                isPositive={emergencyPerf >= 0}
                                                isEmpty={emergencyFunds.length === 0}
                                                objectivesCount={emergencyFunds.length > 0 ? emergencyFunds.length : undefined}
                                                objectivesLabel="fondos"
                                                onViewAll={() => navigate("/investments")}
                                                onAddMoney={emergencyFunds.length > 0 ? () => handleAddMoneyClick(emergencyFunds.map(objectiveToInvestment), "Fondo de Emergencia") : undefined}
                                                onCreateNew={() => alert("Próximamente: Crear Fondo de Emergencia")}
                                            />
                                        );
                                    })()}

                                    {/* Fondo de Retiro */}
                                    {(() => {
                                        const retirementTotalUSD = retirementFunds.reduce((s, o) => s + (o.current_position_value ?? 0), 0);
                                        const retirementTotalARS = retirementFunds.reduce((s, o) => s + (o.current_position_value_pesos ?? 0), 0);
                                        const retirementAmount = currency === "USD"
                                            ? `$ ${retirementTotalUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                                            : `$ ${retirementTotalARS.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
                                        const retirementPerfUSD = retirementFunds.length > 0
                                            ? retirementFunds.reduce((s, o) => s + (o.performance ?? 0), 0) / retirementFunds.length
                                            : 0;
                                        const retirementPerfARS = retirementFunds.length > 0
                                            ? retirementFunds.reduce((s, o) => s + (o.performance_pesos ?? 0), 0) / retirementFunds.length
                                            : 0;
                                        const retirementPerf = currency === "USD" ? retirementPerfUSD : retirementPerfARS;
                                        const retirementPerfDisplay = `${retirementPerf >= 0 ? "+" : ""}${(retirementPerf * 100).toFixed(2)}%`;
                                        return (
                                            <InvestmentCard
                                                title="Fondo de Retiro"
                                                amount={retirementAmount}
                                                currency={currency}
                                                returnRate={retirementFunds.length > 0 ? retirementPerfDisplay : ""}
                                                isPositive={retirementPerf >= 0}
                                                isEmpty={retirementFunds.length === 0}
                                                objectivesCount={retirementFunds.length > 0 ? retirementFunds.length : undefined}
                                                objectivesLabel="fondos"
                                                onViewAll={() => navigate("/investments")}
                                                onAddMoney={retirementFunds.length > 0 ? () => handleAddMoneyClick(retirementFunds.map(objectiveToInvestment), "Fondo de Retiro") : undefined}
                                                onCreateNew={() => alert("Próximamente: Crear Fondo de Retiro")}
                                            />
                                        );
                                    })()}
                                    {/* Card CTA: Nueva Inversión */}
                                    <div
                                        className="rounded-2xl border-2 border-dashed border-[#3246ff]/30 hover:border-[#3246ff]/60 bg-white hover:bg-[#3246ff]/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 p-4 min-h-[160px] group"
                                        onClick={() => setShowProductSelector(true)}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#3246ff]/10 group-hover:bg-[#3246ff]/20 flex items-center justify-center transition-all">
                                            <span className="text-[#3246ff] text-xl font-light">+</span>
                                        </div>
                                        <p className="text-[#3246ff] text-xs font-medium text-center leading-tight">Nueva inversión</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* News */}
                    <section>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-5 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
                            <h2 className="text-gray-900 text-sm font-bold">Lo último en news</h2>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <NewsCard emoji="🎯" message="Parece que todavía no tienes objetivos de ahorro" />
                            <NewsCard emoji="📈" message="El mercado muestra tendencias positivas esta semana" />
                            <NewsCard emoji="💡" message="Nuevas oportunidades de inversión disponibles" />
                        </div>
                    </section>

                    {/* Modals */}
                    {showAddFlow && targetInvestment && (
                        <AddToInvestmentFlow
                            investment={targetInvestment}
                            availableBalance={availableBalanceForModal}
                            onClose={() => setShowAddFlow(false)}
                        />
                    )}
                    {showSelectionModal && (
                        <InvestmentSelectionModal
                            onClose={() => setShowSelectionModal(false)}
                            title={`Sumar dinero a ${selectedGroupTitle}`}
                            investments={selectedInvestmentGroup}
                            onCreateNew={onModalCreate}
                            onSelect={(investmentId) => {
                                const inv = selectedInvestmentGroup.find((i) => i.id === investmentId);
                                if (inv) {
                                    setTargetInvestment(inv);
                                    setShowSelectionModal(false);
                                    setShowAddFlow(true);
                                }
                            }}
                        />
                    )}
                    {showCreateWelfiPesosFlow && (
                        <CreateWelfiPesosFlow
                            availableBalance={availableBalanceForModal}
                            onClose={() => setShowCreateWelfiPesosFlow(false)}
                        />
                    )}
                    {showProductSelector && (
                        <ProductSelector
                            onClose={() => setShowProductSelector(false)}
                            onSelectProduct={handleProductSelect}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
