import { ChevronRight, Plus, Target } from "lucide-react";
import { useState } from "react";
import { AddToInvestmentFlow } from "./AddToInvestmentFlow";
import { InvestmentDetailPage } from "./InvestmentDetailPage";
import { ProductSelector } from "./ProductSelector";
import { CreateWelfiPesosFlow } from "./CreateWelfiPesosFlow";
import { ThematicPacksPage } from "./ThematicPacksPage";

interface Investment {
  id: string;
  emoji: string;
  name: string;
  amount: string;
  currency: string;
  returnRate: string;
  isPositive: boolean;
  progress?: number;
  goalAmount?: string;
  monthlyInvestment?: string;
  tna?: string;
  packsCount?: number;
  allowedInputCurrencies?: ("ARS" | "USD")[];
}

interface AllInvestmentsPageProps {
  onCreateStrategy?: () => void;
}

export function AllInvestmentsPage({ onCreateStrategy }: AllInvestmentsPageProps) {
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showCreateWelfiPesosFlow, setShowCreateWelfiPesosFlow] = useState(false);
  const [showThematicPacksFlow, setShowThematicPacksFlow] = useState(false);

  // Available balance from home
  const availableBalance = {
    ars: "13.254,32",
    usd: "2.543,21"
  };

  // Welfi Pesos investments
  const welfiPesosInvestments: Investment[] = [
    {
      id: "wp1",
      emoji: "💰",
      name: "Welfi Pesos Principal",
      amount: "2.004,00",
      currency: "ARS",
      returnRate: "0.9%",
      isPositive: true,
      monthlyInvestment: "500,00",
      tna: "38.0%",
    },
    {
      id: "wp2",
      emoji: "💸",
      name: "Gastos del mes",
      amount: "450,00",
      currency: "ARS",
      returnRate: "0.8%",
      isPositive: true,
      tna: "38.0%",
    },
  ];

  // Estrategias de inversión - Objetivos personales
  const investmentStrategies: Investment[] = [
    {
      id: "obj1",
      emoji: "💻",
      name: "Cambio de compu",
      amount: "1.354,00",
      currency: "USD",
      returnRate: "0.4%",
      isPositive: true,
      progress: 65,
      goalAmount: "2.000,00",
      monthlyInvestment: "150,00",
      allowedInputCurrencies: ["ARS", "USD"],
    },
    {
      id: "obj2",
      emoji: "🚗",
      name: "Auto 2026",
      amount: "1.354.000,00",
      currency: "ARS",
      returnRate: "35%",
      isPositive: true,
      progress: 35,
      goalAmount: "3.850.000,00",
      monthlyInvestment: "200.000,00",
      allowedInputCurrencies: ["ARS"],
    },
    {
      id: "obj3",
      emoji: "🏖️",
      name: "Vacaciones Europa",
      amount: "650,00",
      currency: "USD",
      returnRate: "1.2%",
      isPositive: true,
      progress: 80,
      goalAmount: "810,00",
      monthlyInvestment: "80,00",
      allowedInputCurrencies: ["ARS", "USD"],
    },
    {
      id: "obj_usd_only",
      emoji: "👮",
      name: "Bono Tesoro USA",
      amount: "5.000,00",
      currency: "USD",
      returnRate: "5%",
      isPositive: true,
      monthlyInvestment: "100,00",
      allowedInputCurrencies: ["USD"],
    },
    {
      id: "obj_mixed_usd",
      emoji: "🍎",
      name: "Apple Equity",
      amount: "2.500,00",
      currency: "USD",
      returnRate: "12%",
      isPositive: true,
      monthlyInvestment: "200,00",
      allowedInputCurrencies: ["ARS", "USD"],
    },
  ];

  const thematicPacks: Investment[] = [
    {
      id: "pack1",
      emoji: "💼",
      name: "Empresas de Valor",
      amount: "263,25",
      currency: "USD",
      returnRate: "0.4%",
      isPositive: true,
      packsCount: 5,
    },
    {
      id: "pack2",
      emoji: "🤖",
      name: "Inteligencia Artificial",
      amount: "283,27",
      currency: "USD",
      returnRate: "0.4%",
      isPositive: true,
      packsCount: 3,
    },
  ];

  // Fondo de Emergencia
  const emergencyFunds: Investment[] = [
    {
      id: "fund1",
      emoji: "🛡️",
      name: "Fondo de emergencia",
      amount: "1.200,00",
      currency: "USD",
      returnRate: "0.9%",
      isPositive: true,
      monthlyInvestment: "100,00",
    },
  ];

  // Fondo de Retiro
  const retirementFunds: Investment[] = [
    {
      id: "fund2",
      emoji: "👴",
      name: "Fondo de retiro",
      amount: "43,00",
      currency: "USD",
      returnRate: "0.9%",
      isPositive: true,
      monthlyInvestment: "120,00",
    },
  ];

  const renderInvestmentCard = (investment: Investment) => (
    <div
      key={investment.id}
      onClick={() => {
        setSelectedInvestment(investment);
        setShowDetail(true);
      }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 cursor-pointer group"
    >
      <div className="flex items-start gap-4 mb-4">
        {/* Emoji icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-2xl">{investment.emoji}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {investment.name}
          </h3>

          {/* Progress bar with goal amount */}
          {investment.progress !== undefined && investment.goalAmount && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">
                  {investment.progress}% del objetivo
                </span>
                <span className="text-xs text-gray-500">
                  Meta: {investment.goalAmount} {investment.currency}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#3246ff] to-[#4856ff] rounded-full transition-all"
                  style={{ width: `${investment.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-gray-900">{investment.amount}</span>
              <span className="text-xs text-gray-500">{investment.currency}</span>
            </div>

            <div
              className={`rounded-lg px-2 py-1 ${investment.isPositive
                ? "bg-gradient-to-r from-[#CEF2C5] to-[#d4f5cd]"
                : "bg-gradient-to-r from-red-100 to-red-200"
                }`}
            >
              <span
                className={`text-xs font-semibold ${investment.isPositive ? "text-[#0D9A68]" : "text-red-700"
                  }`}
              >
                {investment.isPositive ? "▲" : "▼"} {investment.returnRate}
              </span>
            </div>
          </div>

          {/* Monthly investment amount or Packs count */}
          {investment.packsCount ? (
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xs text-gray-600">
                <span className="font-semibold">Tenencia:</span> {investment.packsCount} packs
              </div>
            </div>
          ) : investment.monthlyInvestment && (
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xs text-gray-600">
                <span className="font-semibold">Inversión mensual:</span>{" "}
                {investment.monthlyInvestment} {investment.currency}
              </div>
            </div>
          )}

          {/* TNA expected */}
          {investment.tna && (
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xs text-gray-600">
                <span className="font-semibold">TNA esperada:</span>{" "}
                {investment.tna}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedInvestment(investment);
            setShowAddFlow(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white rounded-xl hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-sm hover:shadow-md font-semibold text-sm"
        >
          <Plus className="size-4" />
          Sumar a esta inversión
        </button>
        <button
          className="px-4 py-2.5 bg-gray-100 group-hover:bg-gray-200 rounded-xl transition-all"
        >
          <ChevronRight className="size-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header with improved button placement */}
      <div className="flex items-center justify-between font-bold">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black text-gray-900">Todas mis inversiones</h2>
          <button
            onClick={() => setShowProductSelector(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3246ff] text-white rounded-xl font-bold text-sm hover:bg-[#2635c2] transition-colors shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
          >
            <Plus className="size-4" />
            Crear nueva inversión
          </button>
        </div>
      </div>

      {showProductSelector && (
        <ProductSelector
          onClose={() => setShowProductSelector(false)}
          onSelectProduct={(product) => {
            setShowProductSelector(false);

            if (product === "welfi_pesos") {
              setShowCreateWelfiPesosFlow(true);
            } else if (product === "strategies" && onCreateStrategy) {
              onCreateStrategy();
            } else if (product === "packs") {
              setShowThematicPacksFlow(true);
            } else {
              alert(`Seleccionaste: ${product}. (Flujo de creación pendiente)`);
            }
          }}
        />
      )}

      {/* Welfi Pesos Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Welfi Pesos</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {welfiPesosInvestments.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Fondo de Emergencia Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#0D9A68] to-[#14B87D] rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Fondo de Emergencia</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyFunds.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Fondo de Retiro Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-orange-500 rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Fondo de Retiro</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {retirementFunds.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Objetivos Personales Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#e5582f] to-[#f06844] rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Estrategias y objetivos personales</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>

        {/* New Strategy Title Card (Optional, or just list investments) */}
        {!investmentStrategies.length && (
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">No tenés objetivos personales activos.</p>
            <button
              onClick={onCreateStrategy}
              className="text-[#3246ff] font-bold hover:underline"
            >
              ¡Crear mi primer objetivo!
            </button>
          </div>
        )}

        {/* Also show button next to title if there are items, but user wants to add more? 
            Mock doesn't show it explicitly, but common UX.
            For now, let's keep the main "Crear nueva inversión" button as the primary driver.
        */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investmentStrategies.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Packs Temáticos Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Packs Temáticos</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {thematicPacks.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Add to investment flow */}
      {showAddFlow && selectedInvestment && (
        <AddToInvestmentFlow
          investment={selectedInvestment}
          availableBalance={availableBalance}
          onClose={() => setShowAddFlow(false)}
        />
      )}

      {/* Create Welfi Pesos Flow */}
      {showCreateWelfiPesosFlow && (
        <CreateWelfiPesosFlow
          availableBalance={availableBalance}
          onClose={() => setShowCreateWelfiPesosFlow(false)}
        />
      )}

      {/* Thematic Packs Flow */}
      {showThematicPacksFlow && (
        <ThematicPacksPage
          availableBalance={availableBalance}
          onBack={() => setShowThematicPacksFlow(false)}
        />
      )}

      {/* Investment detail page */}
      {showDetail && selectedInvestment && (
        <InvestmentDetailPage
          investment={selectedInvestment}
          onBack={() => setShowDetail(false)}
        />
      )}
    </div>
  );
}