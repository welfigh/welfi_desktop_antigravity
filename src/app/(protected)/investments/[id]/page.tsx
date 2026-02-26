"use client";

import { ArrowLeft, TrendingUp, Calendar, Clock, Info, Pencil, PieChart as PieChartIcon } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { allInvestments } from "../../../../constants/mockData";
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
  ResponsiveContainer,
} from "recharts";

import { WithdrawFromInvestmentFlow } from "../../../../components/WithdrawFromInvestmentFlow";
import { AddToInvestmentFlow } from "../../../../components/AddToInvestmentFlow";
import { AdvisorModule } from "../../../../components/AdvisorModule";
import { CURRENT_USER_TIER } from "../../../../constants/tierConfig";

export default function InvestmentDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const navigate = (path: string | number) => {
    if (typeof path === 'number') router.back();
    else router.push(path);
  };
  const investment = allInvestments.find((inv) => inv.id === id);

  if (!investment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800">Inversión no encontrada</h2>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#3246ff] hover:underline">Volver</button>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<"overview" | "movements" | "calendar" | "characteristics" | "composition">("overview");
  const [selectedPeriod, setSelectedPeriod] = useState<"1M" | "3M" | "6M" | "1A" | "Todo">("Todo");
  const [monthlyAmount, setMonthlyAmount] = useState(parseInt(investment.monthlyInvestment?.replace(/\./g, "").replace(",", ".") || "500"));
  const [oneTimeAmount, setOneTimeAmount] = useState(0);
  const [projectionMonths, setProjectionMonths] = useState(12);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(investment.name);
  const [showWithdrawFlow, setShowWithdrawFlow] = useState(false);
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalAmount, setGoalAmount] = useState(
    parseFloat(investment.goalAmount?.replace(/\./g, "").replace(",", ".") || "0")
  );

  // Currency Toggle State
  const [viewCurrency, setViewCurrency] = useState<"ARS" | "USD">(investment.currency as "ARS" | "USD");
  const MEP_RATE = 1150;

  // Function to get displayed amount based on toggle
  const getDisplayedAmount = (originalAmount: number, originalCurrency: string) => {
    if (originalCurrency === viewCurrency) return originalAmount;
    if (viewCurrency === "ARS") return originalAmount * MEP_RATE;
    return originalAmount / MEP_RATE;
  };

  const toggleViewCurrency = () => {
    setViewCurrency(prev => prev === "ARS" ? "USD" : "ARS");
  };


  const currentValueForGoal = parseFloat(investment.amount.replace(/\./g, "").replace(",", ".") || "0");
  const goalProgress = goalAmount > 0 ? Math.min(100, Math.round((currentValueForGoal / goalAmount) * 100)) : 0;
  const goalRemaining = Math.max(0, goalAmount - currentValueForGoal);
  const goalReached = goalProgress >= 100;

  // Format currency number (must be before getMotivationalContent)
  const formatCurrency = (num: number) => {
    return num.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Duolingo-style motivational messages based on progress
  const getMotivationalContent = () => {
    if (goalAmount <= 0) {
      return {
        emoji: "🎯",
        title: "¡Ponete una meta!",
        message: "Definí un objetivo para tu inversión y hacele seguimiento. Los inversores con metas claras ahorran hasta un 40% más.",
        color: "blue",
        bgGradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
      };
    }
    if (goalReached) {
      const celebrationMessages = [
        { emoji: "🎉", title: "¡OBJETIVO CUMPLIDO!", message: "¡Lo lograste! Alcanzaste tu meta. Sos un crack invirtiendo. ¿Listo para apuntar más alto?" },
        { emoji: "🏆", title: "¡CAMPEÓN/A!", message: "Tu disciplina dio frutos. ¡Alcanzaste el 100% de tu meta! Es momento de celebrar y planificar el siguiente paso." },
        { emoji: "🚀", title: "¡MISIÓN CUMPLIDA!", message: "Llegaste a destino. El esfuerzo constante rinde. ¿Querés subir la vara y seguir creciendo?" },
      ];
      const msg = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
      return { ...msg, color: "green", bgGradient: "from-emerald-50 to-green-50", borderColor: "border-emerald-300", textColor: "text-emerald-700" };
    }
    if (goalProgress >= 75) {
      return {
        emoji: "🔥",
        title: "¡Ya casi llegás!",
        message: `Te faltan $${formatCurrency(goalRemaining)} ${investment.currency}. ¡Mantené el ritmo, estás a punto de lograrlo!`,
        color: "orange",
        bgGradient: "from-orange-50 to-amber-50",
        borderColor: "border-orange-200",
        textColor: "text-orange-700",
      };
    }
    if (goalProgress >= 50) {
      return {
        emoji: "💪",
        title: "¡Pasaste la mitad!",
        message: `Ya tenés más de la mitad de tu objetivo. Vas por buen camino. Te faltan $${formatCurrency(goalRemaining)} ${investment.currency}.`,
        color: "purple",
        bgGradient: "from-purple-50 to-pink-50",
        borderColor: "border-purple-200",
        textColor: "text-purple-700",
      };
    }
    if (goalProgress >= 25) {
      return {
        emoji: "📈",
        title: "¡Buen progreso!",
        message: `Ya acumulaste un ${goalProgress}% de tu meta. Cada aporte cuenta. ¡Seguí sumando!`,
        color: "blue",
        bgGradient: "from-blue-50 to-indigo-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-700",
      };
    }
    return {
      emoji: "🌱",
      title: "¡Empezaste tu camino!",
      message: `Ya diste el primer paso. Llevás un ${goalProgress}% de tu meta. Los grandes logros empiezan así.`,
      color: "teal",
      bgGradient: "from-teal-50 to-cyan-50",
      borderColor: "border-teal-200",
      textColor: "text-teal-700",
    };
  };

  const motivational = getMotivationalContent();

  // Tab labels in Spanish
  const tabLabels: Record<string, string> = {
    overview: "Evolución",
    movements: "Movimientos",
    calendar: "Calendario",
    characteristics: "Características",
    composition: "Composición",
  };

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
    const currentValue = parseFloat(investment.amount.replace(/\./g, "").replace(",", ".") || "0");
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
  const currentValueClean = parseFloat(investment.amount.replace(/\./g, "").replace(",", ".") || "0");
  const totalContributed = currentValueClean + oneTimeAmount + (monthlyAmount * projectionMonths);
  const totalReturn = finalAmount - totalContributed;

  // Filtrar datos según período seleccionado
  const getFilteredData = () => {
    let data;
    switch (selectedPeriod) {
      case "1M":
        data = evolutionData.slice(-1);
        break;
      case "3M":
        data = evolutionData.slice(-3);
        break;
      case "6M":
        data = evolutionData.slice(-6);
        break;
      case "1A":
        data = evolutionData.slice(-12);
        break;
      case "Todo":
      default:
        data = evolutionData;
    }
    return data.map(item => ({
      ...item,
      value: getDisplayedAmount(item.value, investment.currency)
    }));
  };

  // Mock data para movimientos
  const movements = [
    { id: 1, type: "aporte" as const, amount: "500,00", date: "15 Dic 2024", status: "confirmado" as const },
    { id: 2, type: "retiro" as const, amount: "50,00", date: "10 Dic 2024", status: "confirmado" as const },
    { id: 3, type: "aporte" as const, amount: "500,00", date: "15 Nov 2024", status: "confirmado" as const },
    { id: 4, type: "aporte" as const, amount: "500,00", date: "15 Oct 2024", status: "confirmado" as const },
    { id: 5, type: "aporte" as const, amount: "300,00", date: "15 Sep 2024", status: "pendiente" as const },
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

  // Calcular rachas y stats de calendario
  const calculateCalendarStats = () => {
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;
    const completedCount = monthlyContributions.filter(c => c.completed).length;
    const totalCount = monthlyContributions.length;
    const constancy = Math.round((completedCount / totalCount) * 100);

    for (let i = monthlyContributions.length - 1; i >= 0; i--) {
      if (monthlyContributions[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    for (let i = 0; i < monthlyContributions.length; i++) {
      if (monthlyContributions[i].completed) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { currentStreak, maxStreak, completedCount, totalCount, constancy };
  };

  const { currentStreak, maxStreak, completedCount, totalCount, constancy } = calculateCalendarStats();

  // Composition data
  const compositionData = [
    { name: "S&P 500", value: 45, color: "#3246ff", type: "ETF / Índice", risk: "Medio-Alto" },
    { name: "NASDAQ 100", value: 35, color: "#e5582f", type: "ETF / Tecnológico", risk: "Alto" },
    { name: "Bonos Pampa Energía", value: 20, color: "#14B87D", type: "Renta Fija Corp", risk: "Moderado" },
  ];

  const onBack = () => navigate(-1);



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
            <div className="flex items-center justify-center gap-2 mb-2">
              <p className="text-5xl font-black text-gray-900">
                $ {formatCurrency(getDisplayedAmount(parseFloat(investment.amount.replace(/\./g, "").replace(",", ".")), investment.currency))}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-lg text-gray-600 font-semibold">Valor actual • </span>
              {!investment.id.startsWith("wp") ? (
                <button
                  onClick={toggleViewCurrency}
                  className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors text-sm font-bold text-gray-700"
                >
                  {viewCurrency === "ARS" ? "🇦🇷 ARS" : "🇺🇸 USD"}
                  <span className="text-[10px]">▼</span>
                </button>
              ) : (
                <span className="text-lg text-gray-600 font-semibold">ARS</span>
              )}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="size-4 text-gray-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">
                ${formatCurrency(getDisplayedAmount(1800, investment.currency))}
              </p>
              <p className="text-sm text-gray-600 font-semibold">Aportes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="size-4 text-green-600" />
              </div>
              <p className="text-2xl font-black text-green-600">
                ${formatCurrency(getDisplayedAmount(587, investment.currency))}
              </p>
              <p className="text-sm text-gray-600 font-semibold">Rendimiento</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <TrendingUp className="size-4 text-gray-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">
                ${formatCurrency(getDisplayedAmount(50, investment.currency))}
              </p>
              <p className="text-sm text-gray-600 font-semibold">Retirado</p>
            </div>
          </div>

          {/* Duplicate removed */}
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
            availableBalance={{ ars: "500.000,00", usd: "1.200,00" }}
          />
        )}
        {showWithdrawFlow && (
          <WithdrawFromInvestmentFlow
            investment={investment}
            onClose={() => setShowWithdrawFlow(false)}
          />
        )}

        {/* GOAL PROGRESS SECTION */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
              🎯 Seguimiento de objetivo
            </h2>
            {goalAmount > 0 && !goalReached && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${goalProgress >= 75 ? "bg-orange-100 text-orange-700" :
                goalProgress >= 50 ? "bg-purple-100 text-purple-700" :
                  goalProgress >= 25 ? "bg-blue-100 text-blue-700" :
                    "bg-teal-100 text-teal-700"
                }`}>
                {goalProgress}% completado
              </span>
            )}
            {goalReached && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 animate-pulse">
                ✅ ¡Meta alcanzada!
              </span>
            )}
          </div>

          {/* Goal amount + edit */}
          <div className="flex items-center gap-4 mb-6">
            {isEditingGoal ? (
              <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center bg-gray-50 border-2 border-[#3246ff] rounded-xl p-3 flex-1">
                  <span className="text-gray-400 mr-2 font-bold">$</span>
                  <input
                    type="number"
                    value={goalAmount || ""}
                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                    placeholder="Ingresá tu meta"
                    className="bg-transparent w-full font-bold text-gray-900 focus:outline-none text-lg"
                    autoFocus
                  />
                  <span className="text-gray-400 ml-2 font-semibold text-sm">{investment.currency}</span>
                </div>
                <button
                  onClick={() => setIsEditingGoal(false)}
                  className="px-5 py-3 bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white rounded-xl font-bold text-sm hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setGoalAmount(parseFloat(investment.goalAmount?.replace(/\./g, "").replace(",", ".") || "0"));
                    setIsEditingGoal(false);
                  }}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-all"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-1 bg-gray-50 rounded-2xl p-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Meta establecida</p>
                  <p className="text-2xl font-black text-gray-900">
                    {goalAmount > 0 ? `$${formatCurrency(goalAmount)} ${investment.currency}` : "Sin meta definida"}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 hover:border-[#3246ff] transition-all"
                >
                  {goalAmount > 0 ? "Modificar" : "Definir meta"}
                </button>
              </div>
            )}
          </div>

          {/* Progress bar */}
          {goalAmount > 0 && (
            <>
              <div className="mb-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-600">
                    ${formatCurrency(currentValueForGoal)} {investment.currency}
                  </span>
                  <span className="text-sm font-semibold text-gray-400">
                    ${formatCurrency(goalAmount)} {investment.currency}
                  </span>
                </div>
                <div className="relative w-full h-5 bg-gray-100 rounded-full overflow-hidden">
                  {/* Milestone markers */}
                  {[25, 50, 75].map((milestone) => (
                    <div
                      key={milestone}
                      className="absolute top-0 bottom-0 w-px bg-gray-300 z-10"
                      style={{ left: `${milestone}%` }}
                    />
                  ))}
                  {/* Progress fill */}
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
                {/* Milestone labels */}
                <div className="flex justify-between mt-1 px-1">
                  <span className="text-[9px] text-gray-400">0%</span>
                  <span className={`text-[9px] ${goalProgress >= 25 ? 'text-gray-600 font-semibold' : 'text-gray-400'}`}>25%</span>
                  <span className={`text-[9px] ${goalProgress >= 50 ? 'text-gray-600 font-semibold' : 'text-gray-400'}`}>50%</span>
                  <span className={`text-[9px] ${goalProgress >= 75 ? 'text-gray-600 font-semibold' : 'text-gray-400'}`}>75%</span>
                  <span className={`text-[9px] ${goalProgress >= 100 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>100%</span>
                </div>
              </div>

              {/* Remaining amount */}
              {!goalReached && (
                <div className="text-center my-4">
                  <span className="text-sm text-gray-500">Te faltan </span>
                  <span className="text-lg font-black text-gray-900">${formatCurrency(goalRemaining)} {investment.currency}</span>
                </div>
              )}
            </>
          )}

          {/* Motivational message - Duolingo style */}
          <div className={`bg-gradient-to-r ${motivational.bgGradient} border-2 ${motivational.borderColor} rounded-2xl p-5 mt-4`}>
            <div className="flex items-start gap-4">
              <span className="text-4xl flex-shrink-0">{motivational.emoji}</span>
              <div>
                <p className={`font-black text-lg ${motivational.textColor} mb-1`}>{motivational.title}</p>
                <p className="text-sm text-gray-700">{motivational.message}</p>
              </div>
            </div>
            {goalReached && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    setGoalAmount(Math.round(goalAmount * 1.5));
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg"
                >
                  🚀 Subir meta a ${formatCurrency(Math.round(goalAmount * 1.5))}
                </button>
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="flex-1 py-3 rounded-xl bg-white border-2 border-emerald-300 text-emerald-700 font-bold text-sm hover:bg-emerald-50 transition-all"
                >
                  ✏️ Definir nueva meta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ==================== MONTHLY CONTRIBUTION CONFIG ==================== */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-2xl shadow-sm text-2xl">
              💡
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg mb-1">
                Tu inversión mensual configurada
              </p>

              {/* Logic: 
                  - If Welfi Pesos (wp*): Show ARS only.
                  - If others: Show USD primary (stored) + ARS equivalent.
                  - Exception: If 'obj2' (Auto 2026), it's ARS strategy but user wants USD-pegged logic. 
                    For this demo, we'll treat non-Welfi-Pesos as USD-basable/dual display.
              */}
              {(() => {
                const isWelfiPesos = investment.id.startsWith("wp");
                const MEP_RATE = 1150;

                // If amount is 0, show CTA
                if (monthlyAmount === 0 && !isEditingGoal) { // Reusing isEditingGoal logic? No, let's stick to reading monthlyAmount
                  // Wait, we need a separate edit state for this card? 
                  // Ideally yes, but for MVP let's assume if it's 0 we show text "No configurada".
                  // But user asked to "poder sumar".
                }

                return (
                  <div className="mt-2">
                    {monthlyAmount === 0 ? (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-600 text-sm">Aún no tenés un aporte mensual automático.</p>
                        <button
                          onClick={() => setMonthlyAmount(100)} // Mock set
                          className="px-4 py-2 bg-[#3246ff] text-white rounded-xl font-bold text-sm hover:bg-[#2034e0] transition-colors"
                        >
                          Configurar ahora
                        </button>
                      </div>
                    ) : (
                      <div>
                        {isWelfiPesos ? (
                          // Welfi Pesos: Simple ARS
                          <div>
                            <p className="text-3xl font-black text-[#3246ff]">
                              $ {formatCurrency(monthlyAmount)} ARS
                            </p>
                            <p className="text-xs text-blue-600 mt-1 font-semibold">
                              Se debita automáticamente de tu saldo disponible
                            </p>
                          </div>
                        ) : (
                          // Strategies / USD / Others: Show Dual Currency
                          <div>
                            <div className="flex items-baseline flex-wrap gap-2">
                              <span className="text-3xl font-black text-[#3246ff]">
                                {formatCurrency(monthlyAmount)} USD
                              </span>
                              <span className="text-xl font-bold text-gray-500">
                                (~ $ {formatCurrency(monthlyAmount * MEP_RATE)} ARS)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                                Tipo de cambio MEP: ${formatCurrency(MEP_RATE)}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Edit button */}
                        <button
                          onClick={() => {
                            const newVal = prompt("Ingresá el nuevo monto mensual:", monthlyAmount.toString());
                            if (newVal) setMonthlyAmount(Number(newVal));
                          }}
                          className="mt-4 text-sm font-bold text-[#3246ff] hover:underline flex items-center gap-1"
                        >
                          <Pencil className="size-3" />
                          Modificar monto
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* 2. TABS */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex gap-2 overflow-x-auto">
          {(["overview", "movements", "calendar", "characteristics", "composition"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab
                ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </div>

        {/* ==================== EVOLUCIÓN TAB ==================== */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">Evolución histórica</h2>
              {!investment.id.startsWith("wp") && (
                <button
                  onClick={toggleViewCurrency}
                  className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors text-sm font-bold text-gray-700"
                >
                  {viewCurrency === "ARS" ? "🇦🇷 ARS" : "🇺🇸 USD"}
                  <span className="text-[10px]">▼</span>
                </button>
              )}
            </div>

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
                    formatter={(value: number) => [`$${value}`, "Saldo"]}
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

        {/* ==================== MOVIMIENTOS TAB ==================== */}
        {activeTab === "movements" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6">Movimientos</h2>
            <div className="space-y-3">
              {movements.map((mov) => (
                <div
                  key={mov.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mov.type === "aporte" ? "bg-green-100" : "bg-red-100"
                      }`}>
                      <span className="text-lg">{mov.type === "aporte" ? "📥" : "📤"}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 capitalize">{mov.type}</p>
                      <p className="text-sm text-gray-500">{mov.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-lg ${mov.type === "aporte" ? "text-green-600" : "text-red-600"
                      }`}>
                      {mov.type === "aporte" ? "+" : "-"}${mov.amount}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${mov.status === "confirmado" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                      {mov.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== CALENDARIO TAB ==================== */}
        {activeTab === "calendar" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="size-6 text-[#3246ff]" />
              Calendario de aportes mensuales
            </h2>

            {/* Monthly contributions grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {monthlyContributions.map((contrib, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl p-4 border-2 transition-all ${contrib.completed
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-gray-400" />
                      <span className="font-bold text-gray-800 text-sm">{contrib.month}</span>
                    </div>
                    {contrib.completed ? (
                      <span className="text-green-500 text-lg">✅</span>
                    ) : (
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs font-bold">⏸</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Aportado</p>
                  <p className={`font-black text-base ${contrib.completed ? "text-green-700" : "text-gray-500"}`}>
                    ${contrib.amount} {contrib.currency}
                  </p>
                </div>
              ))}
            </div>

            {/* Calendar stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Meses cumplidos</p>
                <p className="text-2xl font-black text-blue-600">{completedCount}/{totalCount}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Constancia</p>
                <p className="text-2xl font-black text-purple-600">{constancy}%</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Racha actual</p>
                <p className="text-2xl font-black text-orange-600">{currentStreak}</p>
                <p className="text-[10px] text-orange-500">meses consecutivos 🔥</p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Racha máxima</p>
                <p className="text-2xl font-black text-pink-600">{maxStreak}</p>
                <p className="text-[10px] text-pink-500">¡Tu mejor racha! ⚡</p>
              </div>
            </div>
          </div>
        )}

        {/* ==================== CARACTERÍSTICAS TAB ==================== */}
        {activeTab === "characteristics" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Info className="size-6 text-[#3246ff]" />
              Características de esta inversión
            </h2>

            {/* Risk & Volatility cards */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Nivel de riesgo</span>
                  <span className="text-2xl">🛡️</span>
                </div>
                <p className="text-xl font-black text-gray-900">Conservador</p>
                <p className="text-xs text-gray-500">Baja probabilidad de pérdidas</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Volatilidad</span>
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-xl font-black text-gray-900">Baja</p>
                <p className="text-xs text-gray-500">Fluctuaciones mínimas de valor</p>
              </div>
            </div>

            {/* Plazo cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Plazo mínimo sugerido</span>
                  <Clock className="size-5 text-purple-400" />
                </div>
                <p className="text-xl font-black text-purple-700">1 mes</p>
                <p className="text-xs text-gray-500">Tiempo recomendado de inversión</p>
              </div>
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">Plazo de rescate</span>
                  <span className="text-2xl">⏱️</span>
                </div>
                <p className="text-xl font-black text-orange-600">24 horas</p>
                <p className="text-xs text-gray-500">Tiempo para recibir tu dinero</p>
              </div>
            </div>

            {/* Moneda section */}
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              Moneda
              <Info className="size-4 text-gray-400" />
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📊</span>
                  <span className="font-semibold text-gray-700">Estrategia en</span>
                </div>
                <span className="px-3 py-1 bg-gray-200 rounded-lg font-bold text-sm text-gray-800">{investment.currency}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💰</span>
                  <span className="font-semibold text-gray-700">Ingresás en</span>
                </div>
                <span className="px-3 py-1 bg-gray-200 rounded-lg font-bold text-sm text-gray-800">
                  {investment.allowedInputCurrencies?.join(" o ") || investment.currency}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💸</span>
                  <span className="font-semibold text-gray-700">Retirás en</span>
                </div>
                <span className="px-3 py-1 bg-gray-200 rounded-lg font-bold text-sm text-gray-800">
                  {investment.allowedInputCurrencies?.join(" o ") || investment.currency}
                </span>
              </div>
            </div>

            {/* Rentabilidad section */}
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              Rentabilidad
              <Info className="size-4 text-gray-400" />
            </h3>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="size-5 text-green-600" />
                  <span className="font-semibold text-gray-700">Rentabilidad esperada anual</span>
                </div>
                <span className="font-black text-green-600 text-lg">{investment.tna || "38.0%"}</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== COMPOSICIÓN TAB ==================== */}
        {activeTab === "composition" && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <PieChartIcon className="size-6 text-[#3246ff]" />
              Composición de la cartera
            </h2>

            <div className="flex items-center gap-8 mb-6">
              {/* Donut chart */}
              <div className="relative w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={compositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {compositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-gray-900">100%</span>
                  <span className="text-[10px] font-bold text-gray-500 tracking-wider">DIVERSIFICADO</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex-1 space-y-4">
                {compositionData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-10 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.type} • {item.risk}</p>
                      </div>
                    </div>
                    <span className="font-black text-gray-900 text-lg">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rebalancing notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
              <Info className="size-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                Esta cartera se rebalancea automáticamente para mantener estos porcentajes y maximizar tu retorno ajustado por riesgo.
              </p>
            </div>
          </div>
        )}

        {/* ==================== PROGRESO COMO INVERSOR ==================== */}
        <div className="bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-400 rounded-3xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
            📈 Tu progreso como inversor
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🔥</span>
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">¡Seguí así!</span>
              </div>
              <p className="text-3xl font-black text-gray-900">247</p>
              <p className="text-xs font-semibold text-gray-600">días invirtiendo</p>
              <p className="text-[10px] text-gray-400">8 meses construyendo tu futuro 💪</p>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⚡</span>
                <span className="text-[10px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full font-bold">Récord</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{maxStreak}</p>
              <p className="text-xs font-semibold text-gray-600">meses consecutivos</p>
              <p className="text-[10px] text-gray-400">¡Tu mejor racha de aportes! 🏆</p>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏆</span>
                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">Top</span>
              </div>
              <p className="text-3xl font-black text-gray-900">+12.4%</p>
              <p className="text-xs font-semibold text-gray-600">tu mejor mes</p>
              <p className="text-[10px] text-gray-400">Octubre 2024 • $148 ganados</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">💰</span>
                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">Gratis</span>
              </div>
              <p className="text-3xl font-black text-green-600">$587</p>
              <p className="text-xs font-semibold text-gray-600">interés compuesto</p>
              <p className="text-[10px] text-gray-400">Dinero que ganó tu dinero 📈</p>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🎯</span>
                <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-bold">Objetivo</span>
              </div>
              <p className="text-3xl font-black text-gray-900">$2.500</p>
              <p className="text-xs font-semibold text-gray-600">próximo hito</p>
              <p className="text-[10px] text-gray-400">te faltan $496 • 91% completado</p>
            </div>
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">🏅</span>
                <span className="text-[10px] bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-bold">Élite</span>
              </div>
              <p className="text-3xl font-black text-gray-900">Top 15%</p>
              <p className="text-xs font-semibold text-gray-600">de inversores</p>
              <p className="text-[10px] text-gray-400">Por constancia y disciplina 💎</p>
            </div>
          </div>

          {/* Motivational message */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="font-bold text-gray-900 text-sm">¡Vas excelente! Seguí invirtiendo de forma consistente</p>
              <p className="text-xs text-gray-600 mt-1">
                Los inversores que mantienen sus inversiones por más de 1 año y aportan mensualmente obtienen en promedio{" "}
                <span className="font-bold text-green-600">43% más de rendimiento</span> que quienes retiran anticipadamente.
              </p>
            </div>
          </div>
        </div>

        {/* ==================== SIMULADOR Y PROYECCIÓN ==================== */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            📊 Simulador y proyección futura
          </h2>

          {/* Explanation */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              Te mostramos una <span className="font-bold text-[#3246ff]">proyección teniendo en cuenta la rentabilidad actual de esta cartera</span>,
              las condiciones de mercado, y los posibles <span className="font-bold text-[#3246ff]">aportes únicos o mensuales</span> que vayas a hacer hoy o en el futuro.
              Modificá los valores para ver <span className="font-bold">diferentes escenarios</span>.
            </p>
          </div>

          {/* Current value */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Valor actual de tu inversión</p>
            <p className="text-2xl font-black text-gray-900">$ {investment.amount}</p>
            <p className="text-[10px] text-gray-400">Este monto se proyecta automáticamente con la TNA {investment.tna || "38.0%"}</p>
          </div>

          {/* Monthly contribution */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Aporte mensual configurado</p>
              <p className="text-2xl font-black text-gray-900">${formatCurrency(monthlyAmount)}</p>
            </div>
            <button className="px-4 py-2 bg-white border-2 border-gray-300 rounded-xl font-bold text-sm text-gray-700 hover:bg-gray-50 transition-all">
              Modificar
            </button>
          </div>

          {/* Editable inputs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Aporte único (opcional)</label>
              <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3">
                <span className="text-gray-400 mr-2">$</span>
                <input
                  type="number"
                  value={oneTimeAmount}
                  onChange={(e) => setOneTimeAmount(Number(e.target.value))}
                  className="bg-transparent w-full font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Aporte mensual</label>
              <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3">
                <span className="text-gray-400 mr-2">$</span>
                <input
                  type="number"
                  value={monthlyAmount}
                  onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                  className="bg-transparent w-full font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Plazo (meses)</label>
              <div className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl p-3">
                <input
                  type="number"
                  value={projectionMonths}
                  onChange={(e) => setProjectionMonths(Number(e.target.value))}
                  className="bg-transparent w-full font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Projection chart */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">Proyección de crecimiento</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: "11px", fontWeight: 600 }}
                    label={{ value: "Meses", position: "insideBottom", offset: -5 }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "11px", fontWeight: 600 }}
                    tickFormatter={(value) => `$${formatCurrency(value)}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "2px solid #14B87D",
                      borderRadius: "12px",
                      fontWeight: 700,
                    }}
                    formatter={(value: number) => [`$${formatCurrency(value)}`, "Proyección"]}
                    labelFormatter={(label) => `Mes ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#14B87D"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 5, fill: "#14B87D" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Projected results */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5">
              <p className="text-xs text-green-600 font-semibold mb-1">Tendrías aproximadamente</p>
              <p className="text-3xl font-black text-gray-900">${formatCurrency(finalAmount)}</p>
              <p className="text-xs text-gray-500">En {projectionMonths} meses</p>
            </div>
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-5">
              <p className="text-xs text-emerald-600 font-semibold mb-1">Rendimiento estimado</p>
              <p className="text-3xl font-black text-emerald-600">${formatCurrency(Math.max(0, totalReturn))}</p>
              <p className="text-xs text-gray-500">TNA {investment.tna || "38.0%"} • Capital + Intereses</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-xs font-bold text-amber-800 mb-1">Información importante</p>
              <p className="text-xs text-amber-700">
                Las proyecciones mostradas son estimaciones calculadas en base a la TNA actual ({investment.tna || "38.0%"}) y los parámetros ingresados.{" "}
                <span className="font-bold">Estos valores no constituyen una promesa ni garantía de rentabilidad futura.</span>{" "}
                Los rendimientos pasados no garantizan resultados futuros. Toda inversión conlleva riesgos, incluyendo la posible pérdida de capital.
                Las tasas de interés y condiciones de mercado pueden variar. Te recomendamos leer los términos y condiciones antes de invertir.
              </p>
            </div>
          </div>
        </div>

        {/* Advisor Module */}
        <div className="mb-6">
          <AdvisorModule tier={"pro"} />
        </div>
      </div>
    </div>
  );
}