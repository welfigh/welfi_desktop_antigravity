import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { AddToInvestmentFlow } from "./AddToInvestmentFlow";
import { InvestmentDetailPage } from "./InvestmentDetailPage";

interface Investment {
  id: string;
  emoji: string;
  name: string;
  amount: string;
  currency: string;
  returnRate: string;
  isPositive: boolean;
  progress?: number;
  goalAmount?: string; // Monto objetivo
  monthlyInvestment?: string; // Inversión mensual
  tna?: string; // TNA esperada
}

export function AllInvestmentsPage() {
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Available balance from home
  const availableBalance = {
    ars: "13.254,32",
    usd: "2.543,21"
  };

  // Corto plazo investments
  const shortTermInvestments: Investment[] = [
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
  ];

  // Mediano y largo plazo - Estrategias de inversión
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
    },
    {
      id: "obj2",
      emoji: "🚗",
      name: "Auto 2026",
      amount: "1.354,00",
      currency: "USD",
      returnRate: "0.4%",
      isPositive: false,
      progress: 35,
      goalAmount: "3.850,00",
      monthlyInvestment: "200,00",
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
    },
  ];

  // Packs temáticos
  const thematicPacks: Investment[] = [
    {
      id: "pack1",
      emoji: "💼",
      name: "Empresas de Valor",
      amount: "263,25",
      currency: "USD",
      returnRate: "0.4%",
      isPositive: true,
      monthlyInvestment: "50,00",
    },
    {
      id: "pack2",
      emoji: "🤖",
      name: "Inteligencia Artificial",
      amount: "283,27",
      currency: "USD",
      returnRate: "0.4%",
      isPositive: true,
      monthlyInvestment: "75,00",
    },
  ];

  // Fondos recomendados
  const recommendedFunds: Investment[] = [
    {
      id: "fund1",
      emoji: "🛡️",
      name: "Fondo de emergencia",
      amount: "43,00",
      currency: "USD",
      returnRate: "0.9%",
      isPositive: true,
      monthlyInvestment: "100,00",
    },
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
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-gray-100"
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
              className={`rounded-lg px-2 py-1 ${
                investment.isPositive
                  ? "bg-gradient-to-r from-[#CEF2C5] to-[#d4f5cd]"
                  : "bg-gradient-to-r from-red-100 to-red-200"
              }`}
            >
              <span
                className={`text-xs font-semibold ${
                  investment.isPositive ? "text-[#0D9A68]" : "text-red-700"
                }`}
              >
                {investment.isPositive ? "▲" : "▼"} {investment.returnRate}
              </span>
            </div>
          </div>

          {/* Monthly investment amount */}
          {investment.monthlyInvestment && (
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
          onClick={() => {
            setSelectedInvestment(investment);
            setShowAddFlow(true);
          }}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white rounded-xl hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-sm hover:shadow-md font-semibold text-sm"
        >
          <Plus className="size-4" />
          Sumar a esta inversión
        </button>
        <button
          onClick={() => {
            setSelectedInvestment(investment);
            setShowDetail(true);
          }}
          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
        >
          <ChevronRight className="size-5 text-gray-600" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page title and CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
          <h1 className="text-gray-900 text-3xl font-black">Todas mis inversiones</h1>
        </div>

        {/* Create new investment CTA - moved here */}
        <button
          onClick={() => alert("Próximamente: Crear nueva inversión")}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-md hover:shadow-lg hover:scale-105 font-bold"
        >
          <Plus className="size-5" />
          Crear nueva inversión
        </button>
      </div>

      {/* Corto plazo section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Corto plazo</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortTermInvestments.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Estrategias de inversión - Objetivos personales */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#e5582f] to-[#f06844] rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Estrategias de inversión - Objetivos personales</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investmentStrategies.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Packs temáticos */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Packs temáticos</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {thematicPacks.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Fondos recomendados */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Fondos recomendados</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedFunds.map(renderInvestmentCard)}
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