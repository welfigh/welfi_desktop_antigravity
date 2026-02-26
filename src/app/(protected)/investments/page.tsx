"use client";

import { ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AddToInvestmentFlow } from "../../../components/AddToInvestmentFlow";
import { ProductSelector } from "../../../components/ProductSelector";
import { CreateWelfiPesosFlow } from "../../../components/CreateWelfiPesosFlow";
import ThematicPacksPage from "../../../components/PacksModal";
import { welfiPesosInvestments, investmentStrategies, thematicPacks, emergencyFunds, retirementFunds, Investment } from "../../../constants/mockData";

export default function InvestmentsPage() {
  const router = useRouter();
  const navigate = (path: string) => router.push(path);
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showCreateWelfiPesosFlow, setShowCreateWelfiPesosFlow] = useState(false);
  const [showThematicPacksFlow, setShowThematicPacksFlow] = useState(false);

  // Available balance (mock)
  const availableBalance = { ars: "13.254,32", usd: "2.543,21" };

  const renderInvestmentCard = (investment: Investment) => (
    <div
      key={investment.id}
      onClick={() => navigate(`/investments/${investment.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 cursor-pointer group"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-2xl">{investment.emoji}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {investment.name}
          </h3>
          {investment.strategyName && (
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-1 bg-indigo-50 text-indigo-600">
              {investment.strategyName}
            </span>
          )}
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
        </div>
      </div>

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
          Sumar
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
    <div className="space-y-8 pt-6 px-4 sm:px-6 lg:px-8 pb-8">
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
            } else if (product === "strategies") {
              navigate("/strategies");
            } else if (product === "packs") {
              navigate("/packs");
            } else {
              alert(`Seleccionaste: ${product}`);
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

      {/* Estrategias y objetivos personales Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#e5582f] to-[#f06844] rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Estrategias y objetivos personales</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investmentStrategies.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Packs temáticos Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#9b59b6] to-[#8e44ad] rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Packs temáticos</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {thematicPacks.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Fondo de Emergencia Section */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-gradient-to-b from-[#27ae60] to-[#2ecc71] rounded-full" />
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
          <div className="w-1 h-6 bg-gradient-to-b from-[#f39c12] to-[#e67e22] rounded-full" />
          <h2 className="text-gray-800 text-xl font-semibold">Fondo de Retiro</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {retirementFunds.map(renderInvestmentCard)}
        </div>
      </section>

      {/* Modals */}
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