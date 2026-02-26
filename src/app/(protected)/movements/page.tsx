"use client";

import { ArrowDownLeft, ArrowUpRight, Search, Filter } from "lucide-react";
import { useState } from "react";

interface Movement {
  id: string;
  type: "deposit" | "withdrawal" | "investment" | "yield";
  description: string;
  amount: number;
  currency: "ARS" | "USD";
  date: string;
  status: "completed" | "pending" | "failed";
}

export default function MovementsPage() {
  const [filter, setFilter] = useState("all");

  const movements: Movement[] = [
    {
      id: "1",
      type: "deposit",
      description: "Ingreso de dinero",
      amount: 50000,
      currency: "ARS",
      date: "2024-02-05",
      status: "completed"
    },
    {
      id: "2",
      type: "investment",
      description: "Suscripción Welfi Pesos",
      amount: -25000,
      currency: "ARS",
      date: "2024-02-04",
      status: "completed"
    },
    {
      id: "3",
      type: "yield",
      description: "Rendimiento diario",
      amount: 125.50,
      currency: "ARS",
      date: "2024-02-04",
      status: "completed"
    },
    {
      id: "4",
      type: "withdrawal",
      description: "Retiro a cuenta bancaria",
      amount: -10000,
      currency: "ARS",
      date: "2024-02-01",
      status: "completed"
    },
    {
      id: "5",
      type: "deposit",
      description: "Ingreso de dinero",
      amount: 100,
      currency: "USD",
      date: "2024-01-28",
      status: "completed"
    }
  ];

  const getIcon = (type: Movement["type"]) => {
    switch (type) {
      case "deposit":
      case "yield":
        return <ArrowDownLeft className="size-5 text-green-600" />;
      case "withdrawal":
      case "investment":
        return <ArrowUpRight className="size-5 text-gray-600" />;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const isPositive = amount > 0;
    return `${isPositive ? '+' : ''}${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })} ${currency}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
          <h1 className="text-gray-900 text-3xl font-black">Movimientos</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar movimientos..."
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3246ff]/20 w-64"
            />
          </div>
          <button className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="size-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Movements List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="w-12 text-center">Tipo</div>
          <div>Descripción</div>
          <div className="text-right">Monto</div>
        </div>

        <div className="divide-y divide-gray-100">
          {movements.map((movement) => (
            <div key={movement.id} className="grid grid-cols-[auto_1fr_auto] gap-4 p-4 hover:bg-gray-50 transition-colors items-center">
              <div className="w-12 flex justify-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${movement.amount > 0 ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                  {getIcon(movement.type)}
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900">{movement.description}</div>
                <div className="text-sm text-gray-500">{movement.date}</div>
              </div>

              <div className={`text-right font-medium ${movement.amount > 0 ? 'text-green-600' : 'text-gray-900'
                }`}>
                {formatAmount(movement.amount, movement.currency)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <button className="text-[#3246ff] font-semibold text-sm hover:underline">
          Ver más movimientos antiguos
        </button>
      </div>
    </div>
  );
}
