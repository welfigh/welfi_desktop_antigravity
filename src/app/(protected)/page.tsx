"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BalanceCard } from "../../components/BalanceCard";
import { InvestmentCard } from "../../components/InvestmentCard";
import { ActionButton } from "../../components/ActionButton";
import { NewsCard } from "../../components/NewsCard";
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
    fetchObjectives,
} from "../../services/portfolio.service";
import type {
    PanelData,
    Objective,
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

// ─── Adapter: map API Objective → local Investment interface ─────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectiveToInvestment(obj: Objective): Investment {
    const o = obj as any; // Objective uses [key: string]: unknown index signature
    return {
        id: String(o.id ?? ""),
        emoji: String(o.icon ?? "📊"),
        name: String(o.name ?? ""),
        amount: typeof o.current_value === "number"
            ? o.current_value.toLocaleString("es-AR", { minimumFractionDigits: 2 })
            : "0,00",
        currency: String(o.currency_code ?? "ARS"),
        returnRate: `${o.return_rate ?? 0}%`,
        isPositive: Boolean(o.is_positive ?? true),
        progress: typeof o.progress === "number" ? o.progress : undefined,
        goalAmount: typeof o.goal_amount === "number"
            ? o.goal_amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })
            : undefined,
        monthlyInvestment: typeof o.monthly_amount === "number"
            ? o.monthly_amount.toLocaleString("es-AR", { minimumFractionDigits: 2 })
            : undefined,
        strategyName: o.strategy_name ? String(o.strategy_name) : undefined,
        packsCount: typeof o.packs_count === "number" ? o.packs_count : undefined,
    };
}


// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const router = useRouter();
    const navigate = (path: string) => router.push(path);
    const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");

    // ── Panel data (single source of truth for totals) ──
    const [panel, setPanel] = useState<PanelData | null>(null);
    const [objectives, setObjectives] = useState<Objective[]>([]);
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
                fetchObjectives().catch(() => []),
            ]);
            setPanel(panelData);
            setObjectives(Array.isArray(objectivesData) ? objectivesData : []);
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

    // Rendimiento diario — viene en USD absoluto (no porcentaje)
    const dailyPerfUSD = panel?.daily_performance ?? 0;
    const dailyPerfARS = panel?.daily_performance_pesos ?? 0;
    const dailyPerfDisplay = currency === "USD"
        ? `${dailyPerfUSD >= 0 ? "+" : ""}${dailyPerfUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
        : `${dailyPerfARS >= 0 ? "+" : ""}${dailyPerfARS.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ARS`;
    const isDailyPositive = dailyPerfUSD >= 0;

    // Welfi Pesos (tenencias del panel)
    const welfiPesosTotalARS = panel?.welfi_pesos_holdings ?? 0;
    const welfiPesosDisplayAmount = currency === "USD"
        ? `$ ${(welfiPesosTotalARS / dollarValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : `$ ${welfiPesosTotalARS.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    const welfiPesosTNAStr = "—"; // se puede obtener de products/welfi_pesos en el futuro

    // Packs & estrategias del panel (globales, para el BalanceCard)
    const packsTotal = panel?.packs_holdings ?? 0;
    const goalsTotal = panel?.goals_holdings ?? 0;

    // Disponible para operar
    const availableARS = panel?.available_in_pesos ?? 0;
    const availableUSD = panel?.available_in_dollars ?? 0;
    const availableBalanceForModal = {
        ars: availableARS.toLocaleString("es-AR", { minimumFractionDigits: 2 }),
        usd: availableUSD.toLocaleString("en-US", { minimumFractionDigits: 2 }),
    };

    // Objectives split by type (para los cards de inversión)
    const strategies = objectives.filter((o) => o.type === "INVESTMENT");
    const packs = objectives.filter((o) => o.type === "PACK");
    const funds = objectives.filter((o) => o.type === "FUND");
    const emergencyFunds = funds.filter((f) => f.name.toLowerCase().includes("emergencia"));
    const retirementFunds = funds.filter((f) => f.name.toLowerCase().includes("retiro") || f.name.toLowerCase().includes("jubilaci"));

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
        return <StrategiesPage onClose={() => setShowStrategiesPage(false)} onSelectStrategy={(id) => alert("WIP: " + id)} />;
    }
    if (showThematicPacksFlow) {
        return <ThematicPacksPage availableBalance={availableBalanceForModal} onBack={() => setShowThematicPacksFlow(false)} />;
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full flex flex-col min-h-full">
            {/* Top Section */}
            <div className="w-full bg-transparent relative overflow-hidden pb-6 pt-3 px-4 lg:px-6">
                <div className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="text-sm font-medium">Todo mi dinero</span>
                                    <TierBadge tier={CURRENT_USER_TIER} />
                                </div>

                                {dataLoading ? (
                                    <SkeletonBalance />
                                ) : (
                                    <BalanceCard
                                        balance={totalBalance}
                                        currency={currency}
                                        returnRate="0.0%"
                                        isPositive={true}
                                        onCurrencyChange={toggleCurrency}
                                    />
                                )}

                                {/* Balance breakdown */}
                                <div className="space-y-1 text-white text-[11px]">
                                    {dataLoading ? (
                                        <div className="space-y-1.5">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className="h-3 bg-white/20 rounded animate-pulse" />
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="opacity-90">ARS disponibles para operar o retirar:</span>
                                                <span className="font-medium text-white">
                                                    $ {availableARS.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="opacity-90">USD disponibles para operar o retirar:</span>
                                                <span className="font-medium text-white">
                                                    $ {availableUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="opacity-90">ARS en proceso de acreditación:</span>
                                                <span className="font-medium text-white">$ 0,00</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="opacity-90">USD en proceso de acreditación:</span>
                                                <span className="font-medium text-white">$ 0,00</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <ActionButton onClick={() => alert("Ingresar dinero WIP")}>💰 Ingresar dinero</ActionButton>
                                <ActionButton onClick={() => alert("Retirar dinero WIP")}>💸 Retirar dinero</ActionButton>
                            </div>
                        </div>

                        {/* Right: Historical Chart */}
                        <div className="w-full h-full min-h-[220px]">
                            <TotalBalanceChart currency={currency} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="w-full px-4 lg:px-6 py-4 bg-gray-50 flex-1">
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
                        {/* Headers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-5 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
                                <h2 className="text-gray-900 text-sm font-bold">Corto plazo</h2>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-5 bg-gradient-to-b from-[#e5582f] to-[#f06844] rounded-full" />
                                <h2 className="text-gray-900 text-sm font-bold">Mediano y largo plazo</h2>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                        </div>

                        {/* Cards grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
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
                                        objectivesCount={welfiPesosInvestments.length}
                                        objectivesLabel="inversión"
                                        onViewAll={() => navigate("/investments")}
                                        onAddMoney={() => handleAddMoneyClick(welfiPesosInvestments, "Welfi Pesos", () => setShowCreateWelfiPesosFlow(true))}
                                        onCreateNew={() => setShowCreateWelfiPesosFlow(true)}
                                    />

                                    {/* Welfi Dólares */}
                                    <InvestmentCard
                                        title="Welfi Dólares"
                                        amount={`$ ${availableUSD.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                        currency={currency}
                                        returnRate="0.9%"
                                        isEmpty={availableUSD === 0}
                                        onCreateNew={() => alert("Próximamente: Crear inversión en Welfi Dólares")}
                                    />

                                    {/* Estrategias */}
                                    <InvestmentCard
                                        title="Estrategias de inversión"
                                        amount={currency === "USD"
                                            ? `$ ${goalsTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                                            : `$ ${goalsTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
                                        }
                                        currency={currency}
                                        returnRate="0.9%"
                                        objectivesCount={investmentStrategies.length}
                                        objectivesLabel="objetivos"
                                        onViewAll={() => navigate("/investments")}
                                        onAddMoney={() => handleAddMoneyClick(investmentStrategies, "Objetivo", () => setShowStrategiesPage(true))}
                                        onCreateNew={() => setShowStrategiesPage(true)}
                                    />

                                    {/* Packs */}
                                    <InvestmentCard
                                        title="Packs temáticos"
                                        amount={currency === "USD"
                                            ? `$ ${packsTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                                            : `$ ${packsTotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
                                        }
                                        currency={currency}
                                        returnRate="2.3%"
                                        objectivesCount={thematicPacks.length}
                                        objectivesLabel="packs"
                                        onViewAll={() => navigate("/investments")}
                                        onAddMoney={() => handleAddMoneyClick(thematicPacks, "Pack")}
                                    />

                                    {/* Fondo de Emergencia */}
                                    {emergencyFunds.length > 0 && (
                                        <InvestmentCard
                                            title="Fondo de Emergencia"
                                            amount={`$ ${emergencyFunds.reduce((s, o) => s + Number((o as any).current_value ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                            currency="USD"
                                            returnRate="1.5%"
                                            objectivesCount={emergencyFunds.length}
                                            objectivesLabel="fondo"
                                            onViewAll={() => navigate("/investments")}
                                            onAddMoney={() => handleAddMoneyClick(emergencyFunds.map(objectiveToInvestment), "Fondo de Emergencia")}
                                        />
                                    )}

                                    {/* Fondo de Retiro */}
                                    {retirementFunds.length > 0 && (
                                        <InvestmentCard
                                            title="Fondo de retiro"
                                            amount={`$ ${retirementFunds.reduce((s, o) => s + Number((o as any).current_value ?? 0), 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                                            currency="USD"
                                            returnRate="0.9%"
                                            objectivesCount={retirementFunds.length}
                                            objectivesLabel="fondo"
                                            onViewAll={() => navigate("/investments")}
                                            onAddMoney={() => handleAddMoneyClick(retirementFunds.map(objectiveToInvestment), "Fondo de retiro")}
                                        />
                                    )}
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
