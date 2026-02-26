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
// Pages imported as components for modal flows
import StrategiesPage from "../../components/StrategiesModal";
import ThematicPacksPage from "../../components/PacksModal";
import { TierBadge } from "../../components/TierBadge";
import { CURRENT_USER_TIER } from "../../constants/tierConfig";
import {
    welfiPesosInvestments,
    investmentStrategies,
    thematicPacks,
    emergencyFunds,
    retirementFunds,
    Investment
} from "../../constants/mockData";

export default function DashboardPage() {
    const router = useRouter();
    const navigate = (path: string) => router.push(path);
    const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");

    // Listen for sidebar 'Nueva Inversión' button
    useEffect(() => {
        const handler = () => setShowProductSelector(true);
        window.addEventListener('welfi:new-investment', handler);
        return () => window.removeEventListener('welfi:new-investment', handler);
    }, []);

    // State for Add Money Flow from Home
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

    // Helper to handle "Add Money" click
    const handleAddMoneyClick = (investments: Investment[], title: string, onCreate?: () => void) => {
        if (investments.length === 0) {
            if (onCreate) onCreate();
            return;
        }
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
            case 'welfi_pesos':
                setShowCreateWelfiPesosFlow(true);
                break;
            case 'strategies':
                setShowStrategiesPage(true);
                break;
            case 'packs':
                setShowThematicPacksFlow(true);
                break;
            default:
                console.log("Selected:", productId);
        }
    };

    // Exchange rate: 1 USD = 1000 ARS (aproximado)
    const EXCHANGE_RATE = 1000;

    // Toggle between USD and ARS
    const toggleCurrency = () => {
        setCurrency(prev => prev === "USD" ? "ARS" : "USD");
    };

    // Helper function to format amount based on selected currency
    const formatAmount = (usdAmount: number, forceARS: boolean = false) => {
        if (forceARS || currency === "ARS") {
            const arsAmount = usdAmount * EXCHANGE_RATE;
            return arsAmount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    // Calculate total balance in selected currency
    // Sum logic could be improved to actually sum mockData, but hardcoded for now to match mock
    const totalBalanceUSD = 4560.00;
    const totalBalance = currency === "USD"
        ? totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : (totalBalanceUSD * EXCHANGE_RATE).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const availableBalanceForModal = {
        ars: "13.254,32",
        usd: "2.543,21"
    };

    if (showStrategiesPage) {
        return <StrategiesPage onClose={() => setShowStrategiesPage(false)} onSelectStrategy={(id) => alert("WIP: " + id)} />;
    }

    if (showThematicPacksFlow) {
        return <ThematicPacksPage availableBalance={availableBalanceForModal} onBack={() => setShowThematicPacksFlow(false)} />;
    }

    return (
        <div className="w-full flex flex-col min-h-full">
            {/* Top Section - Transparent (Reveals Layout Gradient) */}
            {/* 
                Header is absolute. Layout has the Blue Gradient.
                We just need padding to push content down.
            */}
            <div className="w-full bg-transparent relative overflow-hidden pb-6 pt-3 px-4 lg:px-6">
                {/* Background effects removed to prevent 'line' artifact against layout gradient */}

                {/* Content Container */}
                <div className="relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
                        <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-white">
                                    <span className="text-sm font-medium">Todo mi dinero</span>
                                    <TierBadge tier={CURRENT_USER_TIER} />
                                </div>

                                <BalanceCard
                                    balance={totalBalance}
                                    currency={currency}
                                    returnRate="0.0%"
                                    isPositive={true}
                                    onCurrencyChange={toggleCurrency}
                                />

                                {/* Balance breakdown */}
                                <div className="space-y-1 text-white text-[11px]">
                                    <div className="flex items-center justify-between">
                                        <span className="opacity-90">ARS disponibles para operar o retirar:</span>
                                        <span className="font-medium text-white">$ 2.004.000,00</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="opacity-90">USD disponibles para operar o retirar:</span>
                                        <span className="font-medium text-white">$ 4.560,00</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="opacity-90">ARS en proceso de acreditación:</span>
                                        <span className="font-medium text-white">$ 0,00</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="opacity-90">USD en proceso de acreditación:</span>
                                        <span className="font-medium text-white">$ 0,00</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-2">
                                <ActionButton onClick={() => alert("Ingresar dinero WIP")}>💰 Ingresar dinero</ActionButton>
                                <ActionButton onClick={() => alert("Retirar dinero WIP")}>💸 Retirar dinero</ActionButton>
                            </div>
                        </div>

                        {/* Right column - Historical Chart */}
                        <div className="w-full h-full min-h-[220px]">
                            <TotalBalanceChart currency={currency} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section - Light Background */}
            <div className="w-full px-4 lg:px-6 py-4 bg-gray-50 flex-1">
                <div className="space-y-4">
                    {/* Investment sections container */}
                    <div className="space-y-3">
                        {/* Section headers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
                            {/* Corto plazo header */}
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-5 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
                                <h2 className="text-gray-900 text-sm font-bold">Corto plazo</h2>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>

                            {/* Mediano y largo plazo header */}
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-5 bg-gradient-to-b from-[#e5582f] to-[#f06844] rounded-full" />
                                <h2 className="text-gray-900 text-sm font-bold">Mediano y largo plazo</h2>
                                <div className="flex-1 h-px bg-gray-200" />
                            </div>
                        </div>

                        {/* Investment cards grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
                            {/* Corto plazo cards */}
                            <InvestmentCard
                                title="Welfi Pesos"
                                amount="$ 2.004,00"
                                currency="ARS"
                                returnRate="0.9%"
                                objectivesCount={welfiPesosInvestments.length}
                                objectivesLabel="inversión"
                                onViewAll={() => navigate("/investments")}
                                onAddMoney={() => handleAddMoneyClick(welfiPesosInvestments, "Welfi Pesos", () => setShowCreateWelfiPesosFlow(true))}
                                onCreateNew={() => setShowCreateWelfiPesosFlow(true)}
                            />
                            <InvestmentCard
                                title="Welfi Dólares"
                                amount={currency === "USD" ? "$ 0,00" : `$ ${formatAmount(0, false)}`}
                                currency={currency}
                                returnRate="0.9%"
                                isEmpty={true}
                                onCreateNew={() => alert('Próximamente: Crear inversión en Welfi Dólares')}
                            />

                            {/* Mediano y largo plazo cards */}
                            <InvestmentCard
                                title="Estrategias de inversión"
                                amount={currency === "USD" ? "$ 2.004,00" : `$ ${formatAmount(2004, false)}`}
                                currency={currency}
                                returnRate="0.9%"
                                objectivesCount={investmentStrategies.length}
                                objectivesLabel="objetivos"
                                onViewAll={() => navigate("/investments")}
                                onAddMoney={() => handleAddMoneyClick(investmentStrategies, "Objetivo", () => setShowStrategiesPage(true))}
                                onCreateNew={() => setShowStrategiesPage(true)}
                            />
                            <InvestmentCard
                                title="Packs temáticos"
                                amount={currency === "USD" ? "$ 534,00" : `$ ${formatAmount(534, false)}`}
                                currency={currency}
                                returnRate="2.3%"
                                objectivesCount={thematicPacks.length}
                                objectivesLabel="packs"
                                onViewAll={() => navigate("/investments")}
                                onAddMoney={() => handleAddMoneyClick(thematicPacks, "Pack")}
                            />
                            <InvestmentCard
                                title="Fondo de Emergencia"
                                amount={currency === "USD" ? "$ 1.200,00" : `$ ${formatAmount(1200, false)}`}
                                currency={currency}
                                returnRate="1.5%"
                                objectivesCount={emergencyFunds.length}
                                objectivesLabel="fondo"
                                onViewAll={() => navigate("/investments")}
                                onAddMoney={() => handleAddMoneyClick(emergencyFunds, "Fondo de Emergencia")}
                            />
                            <InvestmentCard
                                title="Fondo de retiro"
                                amount={currency === "USD" ? "$ 43,00" : `$ ${formatAmount(43, false)}`}
                                currency={currency}
                                returnRate="0.9%"
                                objectivesCount={retirementFunds.length}
                                objectivesLabel="fondo"
                                onViewAll={() => navigate("/investments")}
                                onAddMoney={() => handleAddMoneyClick(retirementFunds, "Fondo de retiro")}
                                isEmpty={retirementFunds.length === 0}
                                onCreateNew={() => alert('Próximamente: Crear fondo de retiro')}
                            />
                        </div>
                    </div>

                    {/* Lo último en news section */}
                    <section>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-1 h-5 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
                            <h2 className="text-gray-900 text-sm font-bold">Lo último en news</h2>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <NewsCard
                                emoji="🎯"
                                message="Parece que todavía no tienes objetivos de ahorro"
                            />
                            <NewsCard
                                emoji="📈"
                                message="El mercado muestra tendencias positivas esta semana"
                            />
                            <NewsCard
                                emoji="💡"
                                message="Nuevas oportunidades de inversión disponibles"
                            />
                        </div>
                    </section>


                    {/* MODALS render */}
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
                                const investment = selectedInvestmentGroup.find(inv => inv.id === investmentId);
                                if (investment) {
                                    setTargetInvestment(investment);
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
