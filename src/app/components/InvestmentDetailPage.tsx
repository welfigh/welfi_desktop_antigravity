import { ArrowLeft, TrendingUp, Calendar, Clock, Info, Pencil, PieChart as PieChartIcon } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { WithdrawFromInvestmentFlow } from "./WithdrawFromInvestmentFlow";
import { AddToInvestmentFlow } from "./AddToInvestmentFlow";

interface InvestmentDetailPageProps {
  onBack: () => void;
  investment: {
    name: string;
    emoji: string;
    amount: string;
    currency: string;
    returnRate: string;
    isPositive: boolean;
    tna?: string;
  };
}

export function InvestmentDetailPage({ onBack, investment }: InvestmentDetailPageProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "movements" | "calendar" | "characteristics" | "composition">("overview");
  const [selectedPeriod, setSelectedPeriod] = useState<"1M" | "3M" | "6M" | "1A" | "Todo">("Todo");
  const [monthlyAmount, setMonthlyAmount] = useState(500);
  const [oneTimeAmount, setOneTimeAmount] = useState(0);
  const [projectionMonths, setProjectionMonths] = useState(12);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(investment.name);
  const [showWithdrawFlow, setShowWithdrawFlow] = useState(false);
  const [showAddFlow, setShowAddFlow] = useState(false);

  // Mock data para el gráfico de evolución
  const evolutionData = [
    { month: "Ene", value: 500 },
    { month: "Feb", value: 750 },
    { month: "Mar", value: 680 },
    { month: "Abr", value: 920 },
    { month: "May", value: 1150 },
    { month: "Jun", value: 1080 },
    { month: "Jul", value: 1350 },
    { month: "Ago", value: 1580 },
    { month: "Sep", value: 1720 },
    { month: "Oct", value: 1950 },
    { month: "Nov", value: 2180 },
    { month: "Dic", value: 2387 },
  ];

  // Calcular proyección
  const calculateProjection = () => {
    const currentValue = parseFloat(investment.amount.replace(/\./g, "").replace(",", "."));
    const tnaRate = parseFloat(investment.tna?.replace("%", "") || "38") / 100;
    const monthlyRate = tnaRate / 12;

    const projectionData = [];
    let balance = currentValue + oneTimeAmount;

    projectionData.push({ month: 0, value: Math.round(balance) });

    for (let i = 1; i <= projectionMonths; i++) {
      balance = balance * (1 + monthlyRate) + monthlyAmount;
      projectionData.push({
        month: i,
        value: Math.round(balance)
      });
    }

    return projectionData;
  };

  const projectionData = calculateProjection();
  const finalAmount = projectionData[projectionData.length - 1]?.value || 0;
  const totalContributed = parseFloat(investment.amount.replace(/\./g, "").replace(",", ".")) + oneTimeAmount + (monthlyAmount * projectionMonths);
  const totalReturn = finalAmount - totalContributed;

  // Filtrar datos según período seleccionado
  const getFilteredData = () => {
    const dataLength = evolutionData.length;
    switch (selectedPeriod) {
      case "1M":
        return evolutionData.slice(-1);
      case "3M":
        return evolutionData.slice(-3);
      case "6M":
        return evolutionData.slice(-6);
      case "1A":
        return evolutionData.slice(-12);
      case "Todo":
      default:
        return evolutionData;
    }
  };

  // Mock data para movimientos
  const movements = [
    {
      id: 1,
      type: "aporte" as const,
      amount: "500,00",
      date: "15 Dic 2024",
      status: "confirmado" as const,
    },
    {
      id: 2,
      type: "retiro" as const,
      amount: "50,00",
      date: "10 Dic 2024",
      status: "confirmado" as const,
    },
    {
      id: 3,
      type: "aporte" as const,
      amount: "500,00",
      date: "15 Nov 2024",
      status: "confirmado" as const,
    },
    {
      id: 4,
      type: "aporte" as const,
      amount: "500,00",
      date: "15 Oct 2024",
      status: "confirmado" as const,
    },
    {
      id: 5,
      type: "aporte" as const,
      amount: "300,00",
      date: "15 Sep 2024",
      status: "pendiente" as const,
    },
  ];

  // Mock data para calendario de aportes
  const monthlyContributions = [
    { month: "Ene 2024", completed: true, amount: "500,00", currency: "ARS" },
    { month: "Feb 2024", completed: false, amount: "0,00", currency: "ARS" },
    { month: "Mar 2024", completed: true, amount: "500,00", currency: "ARS" },
    { month: "Abr 2024", completed: true, amount: "500,00", currency: "ARS" },
    { month: "May 2024", completed: true, amount: "500,00", currency: "ARS" },
    { month: "Jun 2024", completed: false, amount: "0,00", currency: "ARS" },
    { month: "Jul 2024", completed: true, amount: "300,00", currency: "USD" },
    { month: "Ago 2024", completed: true, amount: "500,00", currency: "ARS" },
    { month: "Sep 2024", completed: true, amount: "500,00", currency: "ARS" },
    { month: "Oct 2024", completed: true, amount: "1.000,00", currency: "ARS" },
    { month: "Nov 2024", completed: true, amount: "500,00", currency: "ARS" },
    { month: "Dic 2024", completed: true, amount: "750,00", currency: "ARS" },
  ];

  // Calcular racha actual y racha máxima
  const calculateStreaks = () => {
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // Racha actual (contar desde el final hacia atrás)
    for (let i = monthlyContributions.length - 1; i >= 0; i--) {
      if (monthlyContributions[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Racha máxima (buscar la secuencia más larga)
    for (let i = 0; i < monthlyContributions.length; i++) {
      if (monthlyContributions[i].completed) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { currentStreak, maxStreak };
  };

  const { currentStreak, maxStreak } = calculateStreaks();

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#3246ff] via-[#4856ff] to-[#5a6aff] text-white pb-32 pt-8 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Back button */}
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors mb-6"
          >
            <ArrowLeft className="size-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-20 pb-12">
        {/* 1. VALOR ACTUAL DE LA INVERSIÓN */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          {/* Title and badge */}
          <div className="flex items-center justify-center gap-3 mb-6">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-2xl font-black text-gray-900 px-4 py-2 border-2 border-[#3246ff] rounded-xl focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsEditingName(false);
                    }
                  }}
                />
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-4 py-2 bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white rounded-xl font-bold text-sm hover:from-[#4856ff] hover:to-[#3246ff] transition-all"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditedName(investment.name);
                    setIsEditingName(false);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-all"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-black text-gray-900">
                  {editedName} {investment.emoji}
                </h1>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <Pencil className="size-4 text-gray-600" />
                </button>
              </>
            )}
            <span
              className={`px-3 py-1 rounded-full text-sm font-bold ${investment.isPositive
                ? "bg-[#CEF2C5] text-green-800"
                : "bg-red-100 text-red-800"
                }`}
            >
              {investment.isPositive ? "+" : ""}{investment.returnRate}
            </span>
          </div>

          {/* Main amount */}
          <div className="text-center mb-8">
            <p className="text-5xl font-black text-gray-900 mb-2">
              $ {investment.amount}
            </p>
            <p className="text-lg text-gray-600 font-semibold">Valor actual • {investment.currency}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="size-4 text-gray-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">$1.800,00</p>
              <p className="text-sm text-gray-600 font-semibold">Aportes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="size-4 text-green-600" />
              </div>
              <p className="text-2xl font-black text-green-600">$587,00</p>
              <p className="text-sm text-gray-600 font-semibold">Rendimiento</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="size-4 text-gray-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">$50,00</p>
              <p className="text-sm text-gray-600 font-semibold">Retirado</p>
            </div>
          </div>

          {/* Expected return rate */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <Info className="size-5 text-gray-600" />
              <span className="font-semibold text-gray-700">Rendimiento esperado</span>
            </div>
            <span className="px-4 py-2 bg-[#CEF2C5] text-green-800 rounded-full font-black text-sm">
              TNA • {investment.tna || "38.0%"}
            </span>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowAddFlow(true)}
              className="py-4 rounded-2xl bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white font-bold text-lg hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg hover:shadow-xl"
            >
              Sumar a esta inversión
            </button>
            <button
              onClick={() => setShowWithdrawFlow(true)}
              className="py-4 rounded-2xl border-2 border-[#3246ff] text-[#3246ff] font-bold text-lg hover:bg-blue-50 transition-all"
            >
              Retirar de esta inversión
            </button>
          </div>
        </div>

        {/* Flows Modals */}
        {showAddFlow && (
          <AddToInvestmentFlow
            investment={investment}
            onClose={() => setShowAddFlow(false)}
            availableBalance={{ ars: "500.000,00", usd: "1.200,00" }} // Mock balance
          />
        )}
        {showWithdrawFlow && (
          <WithdrawFromInvestmentFlow
            investment={investment}
            onClose={() => setShowWithdrawFlow(false)}
          />
        )}

        {/* 2. TABS */}
        {/* 2. TABS */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "overview"
              ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Evolución
          </button>
          <button
            onClick={() => setActiveTab("movements")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "movements"
              ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Movimientos
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "calendar"
              ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Calendario
          </button>
          <button
            onClick={() => setActiveTab("characteristics")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "characteristics"
              ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Características
          </button>
          <button
            onClick={() => setActiveTab("composition")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === "composition"
              ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
              : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            Composición
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Evolución histórica</h2>
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getFilteredData()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #3246ff",
                      borderRadius: "12px",
                      fontWeight: 700,
                    }}
                    formatter={(value) => [`$${value}`, "Saldo"]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3246ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3246ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3246ff"
                    strokeWidth={3}
                    dot={{ fill: "#3246ff", r: 4 }}
                    activeDot={{ r: 6 }}
                    fill="url(#colorGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Period selector */}
            <div className="flex gap-2 justify-center flex-wrap">
              {(["1M", "3M", "6M", "1A", "Todo"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedPeriod === period
                    ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "movements" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Movimientos</h2>
            <div className="space-y-4">
              {movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-200 hover:border-[#3246ff] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${movement.type === "aporte"
                        ? "bg-green-100"
                        : "bg-orange-100"
                        }`}
                    >
                      <span className="text-2xl">
                        {movement.type === "aporte" ? "📥" : "📤"}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-gray-900 capitalize">
                        {movement.type}
                      </p>
                      <p className="text-sm text-gray-600">{movement.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl font-black ${movement.type === "aporte"
                        ? "text-green-600"
                        : "text-orange-600"
                        }`}
                    >
                      {movement.type === "aporte" ? "+" : "-"}${movement.amount}
                    </p>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${movement.status === "confirmado"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {movement.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-black text-gray-900 mb-6">
              Calendario de aportes mensuales
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {monthlyContributions.map((contribution, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border-2 transition-all ${contribution.completed
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="size-5 text-gray-600" />
                      <span className="font-bold text-gray-900">
                        {contribution.month}
                      </span>
                    </div>
                    <div>
                      {contribution.completed ? (
                        <span className="text-2xl">✅</span>
                      ) : (
                        <span className="text-2xl">⏸️</span>
                      )}
                    </div>
                  </div>
                  {/* Monto aportado */}
                  <div className={`mt-2 pt-3 border-t ${contribution.completed
                    ? "border-green-200"
                    : "border-gray-200"
                    }`}>
                    <p className="text-xs text-gray-600 mb-1">Aportado</p>
                    <p className={`text-lg font-black ${contribution.completed
                      ? "text-green-700"
                      : "text-gray-400"
                      }`}>
                      ${contribution.amount} {contribution.currency}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-2">Meses cumplidos</p>
                <p className="text-4xl font-black text-green-600">
                  {monthlyContributions.filter((c) => c.completed).length}/
                  {monthlyContributions.length}
                </p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-2">Constancia</p>
                <p className="text-4xl font-black text-[#3246ff]">
                  {Math.round(
                    (monthlyContributions.filter((c) => c.completed).length /
                      monthlyContributions.length) *
                    100
                  )}
                  %
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-2">Racha actual</p>
                <p className="text-4xl font-black text-orange-600">
                  {currentStreak}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentStreak === 1 ? 'mes consecutivo' : 'meses consecutivos'} 🔥
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-2">Racha máxima</p>
                <p className="text-4xl font-black text-purple-600">
                  {maxStreak}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ¡Tu mejor racha! ⚡
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "characteristics" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Info className="size-6 text-[#3246ff]" />
              Características de esta inversión
            </h2>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Riesgo */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600">Nivel de riesgo</p>
                  <span className="text-2xl">🛡️</span>
                </div>
                <p className="text-2xl font-black text-[#3246ff] mb-1">Conservador</p>
                <p className="text-xs text-gray-600">Baja probabilidad de pérdidas</p>
              </div>

              {/* Volatilidad */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600">Volatilidad</p>
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-2xl font-black text-green-700 mb-1">Baja</p>
                <p className="text-xs text-gray-600">Fluctuaciones mínimas de valor</p>
              </div>

              {/* Plazo mínimo */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600">Plazo mínimo sugerido</p>
                  <Clock className="size-5 text-purple-600" />
                </div>
                <p className="text-2xl font-black text-purple-700 mb-1">1 mes</p>
                <p className="text-xs text-gray-600">Tiempo recomendado de inversión</p>
              </div>

              {/* Plazo de rescate */}
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-600">Plazo de rescate</p>
                  <span className="text-2xl">⏱️</span>
                </div>
                <p className="text-2xl font-black text-orange-700 mb-1">24 horas</p>
                <p className="text-xs text-gray-600">Tiempo para recibir tu dinero</p>
              </div>
            </div>

            {/* List Details */}
            <div className="space-y-6">
              {/* Moneda */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Moneda <Info className="size-3 text-gray-400" />
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg shadow-sm">💵</div>
                      Estrategia en
                    </div>
                    <span className="font-black text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">{investment.currency}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg shadow-sm">📥</div>
                      Ingresás en
                    </div>
                    <span className="font-black text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">ARS o USD</span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3 text-gray-700 font-medium">
                      <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-lg shadow-sm">📤</div>
                      Retirás en
                    </div>
                    <span className="font-black text-gray-900 bg-white px-3 py-1 rounded-lg border border-gray-200 shadow-sm">ARS o USD</span>
                  </div>
                </div>
              </div>

              {/* Rentabilidad */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Rentabilidad <Info className="size-3 text-gray-400" />
                </h3>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-green-600">
                        <TrendingUp className="size-5" />
                      </div>
                      <span className="font-medium text-gray-700">Rentabilidad esperada anual</span>
                    </div>
                    <span className="font-black text-green-700 text-lg">{investment.tna || "CER + 2%"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "composition" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <PieChartIcon className="size-6 text-[#3246ff]" />
              Composición de la cartera
            </h2>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Chart */}
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "S&P 500", value: 45, color: "#3246ff" },
                        { name: "NASDAQ 100", value: 35, color: "#e5582f" },
                        { name: "Bonos Pampa Energía", value: 20, color: "#14B87D" },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[
                        { name: "S&P 500", value: 45, color: "#3246ff" },
                        { name: "NASDAQ 100", value: 35, color: "#e5582f" },
                        { name: "Bonos Pampa Energía", value: 20, color: "#14B87D" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`${value}%`, 'Participación']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-gray-900">100%</span>
                    <span className="text-xs text-gray-500 font-bold uppercase">Diversificado</span>
                  </div>
                </div>
              </div>

              {/* Legend List */}
              <div className="space-y-4">
                {[
                  { name: "S&P 500", value: 45, color: "bg-[#3246ff]", type: "ETF / Índice", risk: "Medio-Alto" },
                  { name: "NASDAQ 100", value: 35, color: "bg-[#e5582f]", type: "ETF / Tecnológico", risk: "Alto" },
                  { name: "Bonos Pampa Energía", value: 20, color: "bg-[#14B87D]", type: "Renta Fija Corp", risk: "Moderado" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-12 rounded-full ${item.color}`} />
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.type} • {item.risk}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900">{item.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">
              <Info className="size-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                Esta cartera se rebalancea automáticamente para mantener estos porcentajes y maximizar tu retorno ajustado por riesgo.
              </p>
            </div>
          </div>
        )}

        {/* 3. TU PROGRESO COMO INVERSOR */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-3xl shadow-xl p-8 mb-6 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
              <TrendingUp className="size-6" />
              Tu progreso como inversor
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Días invirtiendo */}
              <div className="bg-white/95 backdrop-blur rounded-2xl p-5 border-2 border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🔥</span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-black">
                    ¡Seguí así!
                  </span>
                </div>
                <p className="text-4xl font-black text-gray-900 mb-1">247</p>
                <p className="text-sm font-semibold text-gray-600">días invirtiendo</p>
                <p className="text-xs text-gray-500 mt-2">
                  8 meses construyendo tu futuro 💪
                </p>
              </div>

              {/* Racha de aportes */}
              <div className="bg-white/95 backdrop-blur rounded-2xl p-5 border-2 border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">⚡</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-black">
                    Récord
                  </span>
                </div>
                <p className="text-4xl font-black text-gray-900 mb-1">{maxStreak}</p>
                <p className="text-sm font-semibold text-gray-600">meses consecutivos</p>
                <p className="text-xs text-gray-500 mt-2">
                  ¡Tu mejor racha de aportes! 🎯
                </p>
              </div>

              {/* Tu mejor mes */}
              <div className="bg-white/95 backdrop-blur rounded-2xl p-5 border-2 border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🏆</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-black">
                    Top
                  </span>
                </div>
                <p className="text-4xl font-black text-gray-900 mb-1">+12.4%</p>
                <p className="text-sm font-semibold text-gray-600">tu mejor mes</p>
                <p className="text-xs text-gray-500 mt-2">
                  Octubre 2024 • $148 ganados
                </p>
              </div>

              {/* Interés compuesto ganado */}
              <div className="bg-white/95 backdrop-blur rounded-2xl p-5 border-2 border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">💰</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-black">
                    Gratis
                  </span>
                </div>
                <p className="text-4xl font-black text-green-600 mb-1">$587</p>
                <p className="text-sm font-semibold text-gray-600">interés compuesto</p>
                <p className="text-xs text-gray-500 mt-2">
                  Dinero que ganó tu dinero 📈
                </p>
              </div>

              {/* Próximo hito */}
              <div className="bg-white/95 backdrop-blur rounded-2xl p-5 border-2 border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">🎯</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-black">
                    Objetivo
                  </span>
                </div>
                <p className="text-4xl font-black text-[#3246ff] mb-1">$2.500</p>
                <p className="text-sm font-semibold text-gray-600">próximo hito</p>
                <p className="text-xs text-gray-500 mt-2">
                  Te faltan $496 • 92% completado
                </p>
              </div>

              {/* Comparación social */}
              <div className="bg-white/95 backdrop-blur rounded-2xl p-5 border-2 border-white/50 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">👥</span>
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-black">
                    Elite
                  </span>
                </div>
                <p className="text-4xl font-black text-gray-900 mb-1">Top 15%</p>
                <p className="text-sm font-semibold text-gray-600">de inversores</p>
                <p className="text-xs text-gray-500 mt-2">
                  Por constancia y disciplina 🌟
                </p>
              </div>
            </div>

            {/* Mensaje motivacional */}
            <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl p-5 border-2 border-white/50">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <p className="font-black text-gray-900 mb-1">
                    ¡Vas excelente! Seguí invirtiendo de forma consistente
                  </p>
                  <p className="text-sm text-gray-700">
                    Los inversores que mantienen sus inversiones por más de 1 año y aportan mensualmente
                    obtienen en promedio <strong className="text-[#3246ff]">43% más de rendimiento</strong> que quienes retiran anticipadamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SIMULADOR Y PROYECCIÓN FUTURA */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
            📊 Simulador y proyección futura
          </h2>

          {/* Explicación del simulador */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-6 border-2 border-blue-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              Te mostramos una <strong className="text-[#3246ff]">proyección teniendo en cuenta la rentabilidad actual de esta cartera</strong>,
              las condiciones de mercado, y los posibles <strong className="text-[#3246ff]">aportes únicos o mensuales</strong> que
              vayas a hacer hoy o en el futuro. Modificá los valores para ver diferentes escenarios.
            </p>
          </div>

          {/* Current value - non editable */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-6 border-2 border-blue-300">
            <p className="text-sm text-gray-600 mb-2">Valor actual de tu inversión</p>
            <p className="text-4xl font-black text-[#3246ff]">
              ${investment.amount}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Este monto se proyecta automáticamente con la TNA {investment.tna || "38%"}
            </p>
          </div>

          {/* Monthly investment configured */}
          {monthlyAmount > 0 ? (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Aporte mensual configurado</p>
                  <p className="text-3xl font-black text-green-700">${monthlyAmount.toLocaleString("es-AR")}</p>
                </div>
                <button className="px-4 py-2 bg-white hover:bg-gray-50 rounded-xl font-bold text-sm transition-all shadow-md border-2 border-green-300">
                  Modificar
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-6 border-2 border-orange-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚠️</span>
                <div>
                  <p className="font-black text-gray-900">No tenés aporte mensual configurado</p>
                  <p className="text-sm text-gray-600">Configurá un aporte automático y potenciá tus inversiones</p>
                </div>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white font-bold rounded-xl hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg">
                Configurar aporte mensual
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aporte único (opcional)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={oneTimeAmount}
                  onChange={(e) => setOneTimeAmount(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 text-lg font-black text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3246ff]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aporte mensual
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-black text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-3 text-lg font-black text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3246ff]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Plazo (meses)
              </label>
              <input
                type="number"
                value={projectionMonths}
                onChange={(e) => setProjectionMonths(Number(e.target.value) || 1)}
                min="1"
                max="120"
                className="w-full px-4 py-3 text-lg font-black text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#3246ff]"
              />
            </div>
          </div>

          {/* Projection chart */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
            <h4 className="font-bold text-gray-900 mb-4">Proyección de crecimiento</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                    label={{ value: "Meses", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "12px", fontWeight: 600 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #3246ff",
                      borderRadius: "12px",
                      fontWeight: 700,
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString("es-AR")}`, "Saldo proyectado"]}
                  />
                  <defs>
                    <linearGradient id="projectionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                    fill="url(#projectionGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-300">
              <p className="text-sm text-gray-600 mb-2">Tendrías aproximadamente</p>
              <p className="text-4xl font-black text-[#3246ff]">
                ${finalAmount.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                En {projectionMonths} {projectionMonths === 1 ? "mes" : "meses"}
              </p>
            </div>
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300">
              <p className="text-sm text-gray-600 mb-2">Rendimiento estimado</p>
              <p className="text-4xl font-black text-green-600">
                ${totalReturn.toLocaleString("es-AR")}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                TNA {investment.tna || "38%"} • Capital + intereses
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
            <div className="flex gap-3">
              <Info className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 leading-relaxed">
                <p className="font-bold text-amber-900 mb-1">⚠️ Información importante</p>
                <p>
                  Las proyecciones mostradas son estimaciones calculadas en base a la TNA actual ({investment.tna || "38.0%"}) y los parámetros ingresados.
                  <strong className="text-gray-900"> Estos valores no constituyen una promesa ni garantía de rentabilidad futura.</strong> Los rendimientos pasados no garantizan resultados futuros.
                  Toda inversión conlleva riesgos, incluyendo la posible pérdida de capital. Las tasas de interés y condiciones de mercado pueden variar.
                  Te recomendamos leer los términos y condiciones antes de invertir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}