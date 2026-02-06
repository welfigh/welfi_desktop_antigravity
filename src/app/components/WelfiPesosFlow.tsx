import { useState } from "react";
import { X, ChevronLeft, Check } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import imgSuccess from "../../assets/fd2c423c6d41ed3ce9009258405303a91f9a3b68.png";
import img716 from "../../assets/72384e84861ccea0025a5cb04af72b6dbb5d53f9.png";

interface WelfiPesosFlowProps {
  availableBalanceARS: string;
  availableBalanceUSD: string;
  onClose: () => void;
}

type FlowStep = "historic" | "calculator" | "fundinfo" | "name" | "confirm" | "success";
type Currency = "ARS" | "USD";
type TimePeriod = "1M" | "3M" | "1A";

// Datos históricos de ejemplo
const historicalData = {
  "1M": [
    { date: "05/01", value: 100.0 },
    { date: "08/01", value: 100.2 },
    { date: "11/01", value: 100.3 },
    { date: "14/01", value: 100.1 },
    { date: "17/01", value: 100.4 },
    { date: "20/01", value: 100.5 },
    { date: "23/01", value: 100.3 },
    { date: "26/01", value: 100.6 },
    { date: "29/01", value: 100.7 },
    { date: "01/02", value: 100.9 },
    { date: "04/02", value: 100.4 },
  ],
  "3M": [
    { date: "Nov", value: 98.5 },
    { date: "Nov", value: 99.0 },
    { date: "Dic", value: 99.3 },
    { date: "Dic", value: 99.8 },
    { date: "Dic", value: 100.0 },
    { date: "Ene", value: 100.5 },
    { date: "Ene", value: 100.7 },
    { date: "Ene", value: 100.3 },
    { date: "Feb", value: 100.9 },
    { date: "Feb", value: 101.2 },
  ],
  "1A": [
    { date: "Feb '25", value: 94.2 },
    { date: "Abr '25", value: 95.8 },
    { date: "Jun '25", value: 97.1 },
    { date: "Ago '25", value: 96.8 },
    { date: "Oct '25", value: 98.5 },
    { date: "Dic '25", value: 99.8 },
    { date: "Feb '26", value: 101.2 },
  ],
};

const periodReturns = {
  "1M": "+0.4%",
  "3M": "+2.7%",
  "1A": "+7.4%",
};

export function WelfiPesosFlow({ availableBalanceARS, availableBalanceUSD, onClose }: WelfiPesosFlowProps) {
  const [step, setStep] = useState<FlowStep>("historic");
  const [amount, setAmount] = useState("1000");
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("ARS");
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1M");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [investmentName, setInvestmentName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🏝️");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Cotización dólar MEP estimada
  const MEP_RATE = 1150.50;

  // Lista de emojis populares para inversiones
  const popularEmojis = ["🏝️", "🏠", "🚗", "✈️", "🎓", "💰", "🎯", "🌟", "🔥", "💎", "🚀", "🌴", "⛱️", "🏖️", "🎉", "🎊"];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, ''); // Only numbers and decimal point

    // Prevent multiple decimal points
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) return;

    // Limit to 2 decimal places
    const parts = value.split('.');
    if (parts[1] && parts[1].length > 2) return;

    // Limit to reasonable amount (100 million ARS or 100,000 USD)
    const numericValue = parseFloat(value) || 0;
    const maxAmount = selectedCurrency === "ARS" ? 100000000 : 100000;
    if (numericValue > maxAmount) return;

    setAmount(value);
  };

  const getAvailableBalance = () => {
    return selectedCurrency === "ARS" ? availableBalanceARS : availableBalanceUSD;
  };

  const getNumericAmount = () => {
    return parseFloat(amount) || 0;
  };

  const isAmountValid = getNumericAmount() > 0 &&
    getNumericAmount() <= parseFloat(getAvailableBalance().replace(/,/g, ""));

  // Calcular ARS a invertir (si es USD, hacer conversión)
  const getARSAmount = () => {
    const numAmount = getNumericAmount();
    if (selectedCurrency === "USD") {
      return (numAmount * MEP_RATE).toFixed(2);
    }
    return numAmount.toFixed(2);
  };

  const formatNumber = (num: string) => {
    return parseFloat(num).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDisplayAmount = () => {
    if (!amount) return "0.00";
    return formatNumber(getNumericAmount().toFixed(2));
  };

  // Calcular proyecciones de rendimiento basadas en el monto ARS
  const calculateProjections = () => {
    const arsAmount = parseFloat(getARSAmount());
    const annualRate = 0.0625; // 6.25%

    const annualReturn = arsAmount * annualRate;
    const monthlyReturn = annualReturn / 12;
    const dailyReturn = annualReturn / 365;

    return {
      daily: dailyReturn.toFixed(2),
      monthly: monthlyReturn.toFixed(2),
      annual: annualReturn.toFixed(2)
    };
  };

  const projections = calculateProjections();

  // Paso 1: Rendimiento histórico
  const renderHistoricStep = () => (
    <div className="flex flex-col h-full bg-white overflow-hidden relative">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3246ff] via-[#E5582F] to-[#3246ff]" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-gray-50 border-b border-gray-200">
        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft className="size-6 text-gray-700" />
        </button>
        <div className="text-gray-500 text-sm font-bold tracking-widest uppercase">
          Rendimiento histórico
        </div>
        <div className="w-10" />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="relative z-10 flex-1 flex gap-8 p-8 overflow-y-auto">
        {/* Left Column - Chart */}
        <div className="flex-[2] flex flex-col">
          {/* Period selector + Return */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-3">
              {(["1M", "3M", "1A"] as TimePeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-3 rounded-xl text-base font-bold transition-all ${selectedPeriod === period
                      ? "bg-[#3246ff] text-white shadow-lg scale-105"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200"
                    }`}
                >
                  {period}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-[#CEF2C5] rounded-full px-5 py-2.5 shadow-md">
              <div className="w-2 h-2 rotate-90">
                <svg viewBox="0 0 4 6.66667" className="w-full h-full">
                  <path d="M4 6.66667L0 3.33333L4 0" fill="#0D9A68" />
                </svg>
              </div>
              <span className="text-[#0D9A68] font-black text-xl">{periodReturns[selectedPeriod]}</span>
            </div>
          </div>

          {/* Chart - Much larger */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 flex-1 border-2 border-gray-200 shadow-md">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData[selectedPeriod]} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E5582F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E5582F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E5582F" />
                    <stop offset="50%" stopColor="#ff6b45" />
                    <stop offset="100%" stopColor="#E5582F" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#d1d5db' }}
                  domain={['dataMin - 1', 'dataMax + 1']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '3px solid #3246ff',
                    borderRadius: '16px',
                    color: '#111827',
                    fontSize: '15px',
                    padding: '12px 18px',
                    boxShadow: '0 10px 40px rgba(50, 70, 255, 0.25)'
                  }}
                  labelStyle={{ color: '#6b7280', fontWeight: 700 }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#strokeGradient)"
                  strokeWidth={5}
                  dot={false}
                  fill="url(#lineGradient)"
                  activeDot={{ r: 8, fill: '#E5582F', stroke: '#fff', strokeWidth: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Fund Info */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Fund title and description */}
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Welfi Pesos</h2>

            <p className="text-gray-600 text-base leading-relaxed">
              Ideal si tenés pesos y querés hacerlos rendir sin asumir grandes riesgos mientras decidís qué hacer con tu dinero.
            </p>
          </div>

          {/* Fund specs - vertical stack for desktop */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-5 border-2 border-blue-100">
              <div className="text-[#3246ff] text-xs mb-3 uppercase tracking-wider font-bold">Volatilidad</div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#3246ff]" />
                <div className="w-3 h-3 rounded-full bg-[#3246ff]" />
                <div className="w-3 h-3 rounded-full bg-gray-200" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-5 border-2 border-orange-100">
              <div className="text-[#E5582F] text-xs mb-3 uppercase tracking-wider font-bold">Plazo sugerido</div>
              <div className="text-gray-900 text-lg font-black">3 meses</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-5 border-2 border-green-100">
              <div className="text-[#0D9A68] text-xs mb-3 uppercase tracking-wider font-bold">Tiempo de rescate</div>
              <div className="text-gray-900 text-lg font-black">24 hs hábiles</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4 mt-auto">
            <button
              onClick={() => setStep("fundinfo")}
              className="w-full bg-gray-100 rounded-xl px-5 py-4 flex items-center justify-between text-gray-700 hover:bg-gray-200 transition-all border-2 border-gray-200 group"
            >
              <span className="text-base font-bold">Conocé más sobre este fondo</span>
              <ChevronLeft className="size-6 rotate-180 text-[#3246ff] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setStep("calculator")}
              className="w-full bg-gradient-to-r from-[#3246ff] to-[#5d6bff] text-white py-5 rounded-xl font-black shadow-lg hover:shadow-xl hover:shadow-[#3246ff]/30 transition-all text-lg"
            >
              Invertir
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Paso 2: Calculadora de rendimiento
  const renderCalculatorStep = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <button onClick={() => setStep("historic")} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft className="size-6 text-gray-700" />
        </button>
        <div className="text-gray-500 text-sm font-bold tracking-widest uppercase">
          Calculadora de inversión
        </div>
        <div className="w-10" />
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex gap-8 p-8 overflow-hidden">
        {/* Left Column - Amount Input */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Available balances */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border-2 border-gray-200 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Saldo disponible</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium text-sm">ARS</span>
              <span className="font-black text-gray-900 text-lg">${availableBalanceARS}</span>
            </div>
            <div className="border-t border-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium text-sm">USD</span>
              <span className="font-black text-gray-900 text-lg">${availableBalanceUSD}</span>
            </div>
          </div>

          {/* Currency selector */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Seleccionar moneda</h3>
            <div className="flex gap-3 bg-gray-100 rounded-xl p-2">
              <button
                onClick={() => {
                  setSelectedCurrency("ARS");
                  setAmount("1000");
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedCurrency === "ARS"
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                ARS
              </button>
              <button
                onClick={() => {
                  setSelectedCurrency("USD");
                  setAmount("10");
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedCurrency === "USD"
                    ? "bg-white text-gray-900 shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                  }`}
              >
                USD
              </button>
            </div>
          </div>

          {/* Amount input */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border-2 border-blue-100 flex flex-col gap-4">
            <h2 className="text-base font-bold text-gray-800">Monto a invertir</h2>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-gray-700 font-bold text-2xl">{selectedCurrency} $</span>
              </div>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="w-full text-4xl font-black text-gray-900 bg-transparent border-0 outline-none pl-32 pr-4 py-3 text-right focus:ring-4 focus:ring-[#3246ff]/20 rounded-xl transition-all"
                autoFocus
              />
            </div>

            {!isAmountValid && getNumericAmount() > 0 && (
              <p className="text-red-500 text-xs font-semibold">⚠️ Dinero insuficiente</p>
            )}
          </div>

          {/* Quick amount buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setAmount("1000")}
              className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl py-3 text-gray-700 text-sm font-bold hover:border-[#3246ff] hover:text-[#3246ff] transition-all"
            >
              $ 1.000
            </button>
            <button
              onClick={() => setAmount(selectedCurrency === "ARS" ? "5000" : "50")}
              className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl py-3 text-gray-700 text-sm font-bold hover:border-[#3246ff] hover:text-[#3246ff] transition-all"
            >
              $ {selectedCurrency === "ARS" ? "5.000" : "50"}
            </button>
            <button
              onClick={() => setAmount(selectedCurrency === "ARS" ? "10000" : "100")}
              className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl py-3 text-gray-700 text-sm font-bold hover:border-[#3246ff] hover:text-[#3246ff] transition-all"
            >
              $ {selectedCurrency === "ARS" ? "10.000" : "100"}
            </button>
          </div>

          {/* Conversion info for USD - Compact */}
          {selectedCurrency === "USD" && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-900 font-bold text-sm">💱 Dólar MEP</span>
                <span className="text-blue-900 font-black text-base">$ {formatNumber(MEP_RATE.toString())}</span>
              </div>
              <div className="border-t border-blue-200" />
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium text-sm">ARS a invertir</span>
                <span className="text-blue-900 font-black text-base">≈ ${formatNumber(getARSAmount())}</span>
              </div>
              <p className="text-xs text-blue-600 italic pt-1">
                Podés suscribir y retirar en USD o ARS. La conversión se hace mediante dólar MEP.
              </p>
            </div>
          )}

          {/* ARS Strategy Info */}
          {selectedCurrency === "ARS" && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-xs text-green-700 leading-relaxed">
                💡 <strong>Estrategia en ARS:</strong> Esta cartera invierte en pesos argentinos. Podés suscribir y retirar tanto en ARS como en USD (conversión mediante dólar MEP).
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Projection */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 flex-1 flex flex-col">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Proyección de rendimiento</h3>

            <div className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-6">
                <p className="text-5xl font-black text-gray-900 mb-2">6,25%</p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Rendimiento anual estimado</p>
                <p className="text-xs text-[#3246ff] font-bold mt-1">(en ARS)</p>
              </div>

              <div className="border-t-2 border-gray-200 mb-6" />

              {/* Breakdown - compact for desktop */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center space-y-2 bg-blue-50 rounded-xl p-4 border-2 border-blue-100 min-h-[100px] flex flex-col justify-center">
                  <p className="text-[#3246ff] font-black text-lg break-words">ARS {formatNumber(projections.daily)}</p>
                  <p className="text-xs text-gray-600 uppercase tracking-wider font-bold">Por día</p>
                </div>
                <div className="text-center space-y-2 bg-orange-50 rounded-xl p-4 border-2 border-orange-100 min-h-[100px] flex flex-col justify-center">
                  <p className="text-[#E5582F] font-black text-lg break-words">ARS {formatNumber(projections.monthly)}</p>
                  <p className="text-xs text-gray-600 uppercase tracking-wider font-bold">Por mes</p>
                </div>
                <div className="text-center space-y-2 bg-green-50 rounded-xl p-4 border-2 border-green-100 min-h-[100px] flex flex-col justify-center">
                  <p className="text-[#0D9A68] font-black text-lg break-words">ARS {formatNumber(projections.annual)}</p>
                  <p className="text-xs text-gray-600 uppercase tracking-wider font-bold">Por año</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center italic bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                ⚠️ Las proyecciones son estimadas y no representan una promesa de rentabilidad.
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={() => setStep("name")}
            disabled={!isAmountValid}
            className={`w-full py-4 rounded-xl font-black transition-all text-base ${isAmountValid
                ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg hover:shadow-xl hover:shadow-[#3246ff]/30"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );

  // Paso 3: Información del fondo (modal sobre histórico)
  const renderFundInfoStep = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <button onClick={() => setStep("historic")} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft className="size-6 text-gray-700" />
        </button>
        <div className="text-gray-500 text-sm font-bold tracking-widest uppercase">
          Información del fondo
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border-2 border-gray-200 space-y-8">
            <h2 className="text-3xl font-black text-gray-900 text-center">¿En qué invierte?</h2>

            {/* Fund composition */}
            <div className="flex items-center justify-center gap-6 bg-blue-50 rounded-2xl p-6 border-2 border-blue-100">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3246ff] to-[#4856ff] flex items-center justify-center shadow-lg">
                <div className="w-12 h-1 bg-white rounded-full" />
              </div>
              <div className="flex items-center gap-3 text-base text-gray-700">
                <div className="w-3 h-3 rounded-full bg-[#3246ff]" />
                <span className="font-bold">100% FCI Adcap Renta Dólar</span>
              </div>
            </div>

            {/* Fund description - Two column grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 space-y-3">
                <div className="text-3xl mb-2">💡</div>
                <h3 className="font-black text-gray-900 text-lg">¿Qué hace?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Invierte tus dólares en instrumentos de renta fija de corto plazo (como bonos corporativos y soberanos) para generarte intereses.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 space-y-3">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="font-black text-gray-900 text-lg">¿En qué moneda?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Dólares
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 space-y-3">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-black text-gray-900 text-lg">Objetivo</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Ganarle a la inflación en dólares y evitar que tu plata se oxide
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 space-y-3">
                <div className="text-3xl mb-2">📅</div>
                <h3 className="font-black text-gray-900 text-lg">Plazo sugerido</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  3 meses, pero podés retirar tu dinero cuando quieras.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 space-y-3">
                <div className="text-3xl mb-2">💸</div>
                <h3 className="font-black text-gray-900 text-lg">Rescate</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  48hs hábiles si se hace un día hábil antes de las 15hs.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 space-y-3">
                <div className="text-3xl mb-2">⚠️</div>
                <h3 className="font-black text-gray-900 text-lg">Volatilidad</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Media ⭐⭐☆☆☆ (puede tener días negativos)
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
              <p className="text-sm text-gray-700">
                <strong>📈 Rentabilidad:</strong> Los rendimientos son estimados. Ganancias pasadas no aseguran rendimientos futuros.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue button */}
      <div className="p-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setStep("historic")}
            className="w-full bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white py-5 rounded-xl font-black shadow-lg hover:shadow-xl hover:shadow-[#3246ff]/30 transition-all text-lg"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );

  // Paso 3.5: Elegir nombre para la inversión
  const renderNameStep = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <button onClick={() => setStep("calculator")} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft className="size-6 text-gray-700" />
        </button>
        <div className="w-10" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Title */}
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-black text-gray-900">Elegí un nombre</h2>
            <p className="text-gray-500 text-lg">¡Gran nombre!</p>
          </div>

          {/* Emoji + Name Input */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg space-y-6">
            {/* Emoji Selector Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 flex items-center justify-center text-6xl hover:scale-105 transition-transform shadow-md"
              >
                {selectedEmoji}
              </button>
            </div>

            {/* Emoji Picker Grid */}
            {showEmojiPicker && (
              <div className="grid grid-cols-8 gap-2 p-4 bg-white rounded-xl border-2 border-gray-200">
                {popularEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className={`text-3xl p-2 rounded-lg hover:bg-gray-100 transition-colors ${selectedEmoji === emoji ? "bg-blue-50 ring-2 ring-[#3246ff]" : ""
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-3">
              <input
                type="text"
                value={investmentName}
                onChange={(e) => setInvestmentName(e.target.value)}
                placeholder="Vacaciones 2025"
                maxLength={50}
                className="w-full text-3xl font-black text-gray-900 text-center bg-transparent border-0 border-b-2 border-gray-300 focus:border-[#3246ff] outline-none py-4 transition-all placeholder:text-gray-300"
                autoFocus
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={() => setStep("confirm")}
            disabled={!investmentName.trim()}
            className={`w-full py-6 rounded-xl font-black transition-all text-xl ${investmentName.trim()
                ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg hover:shadow-xl hover:shadow-[#3246ff]/30 scale-100 hover:scale-[1.02]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );

  // Paso 4: Confirmación
  const renderConfirmStep = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
        <button onClick={() => setStep("name")} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <ChevronLeft className="size-6 text-gray-700" />
        </button>
        <div className="text-gray-500 text-sm font-bold tracking-widest uppercase">
          Confirmación de inversión
        </div>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-3 pt-4">
            <h2 className="text-4xl font-black text-gray-900">¿Estamos ok?</h2>
            <p className="text-xl font-bold text-gray-600">Welfi Pesos</p>
          </div>

          {/* Confirmation card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border-2 border-gray-200 shadow-lg space-y-5">
            {selectedCurrency === "USD" ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white rounded-xl p-5 border-2 border-gray-200">
                    <span className="text-gray-600 font-medium text-lg">Vendes</span>
                    <span className="font-black text-gray-900 text-xl">USD {amount}</span>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-900 font-bold text-base">💱 Dólar MEP (estimado)</span>
                      <span className="text-blue-900 font-black text-lg">$ {formatNumber(MEP_RATE.toString())}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-xl p-5 border-2 border-gray-200">
                    <span className="text-gray-600 font-medium text-lg">Recibes en ARS</span>
                    <span className="font-black text-gray-900 text-xl">≈ ${formatNumber(getARSAmount())}</span>
                  </div>

                  <div className="border-t-2 border-dashed border-gray-300 my-4" />

                  <div className="flex items-center justify-between bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-2 border-blue-200">
                    <span className="text-gray-700 font-bold text-lg">Monto a invertir</span>
                    <span className="font-black text-[#3246ff] text-2xl">ARS {formatNumber(getARSAmount())}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between bg-gradient-to-br from-blue-50 to-white rounded-xl p-8 border-2 border-blue-200">
                <span className="text-gray-700 font-bold text-xl">Monto a invertir</span>
                <span className="font-black text-[#3246ff] text-3xl">ARS {amount}</span>
              </div>
            )}

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5 mt-5">
              <p className="text-sm text-gray-700 leading-relaxed">
                ⏱️ Al confirmar la operación, pasará a encontrarse en estado <strong>"pendiente"</strong>.
                La misma puede demorar hasta <strong>48 hs hábiles</strong> en concretarse.
              </p>
            </div>

            {selectedCurrency === "USD" && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                <p className="text-sm text-blue-700 leading-relaxed">
                  ⚠️ La cotización del dólar MEP es estimada y puede variar ligeramente al momento de ejecutar la operación.
                </p>
              </div>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200">
            <div className="flex items-start gap-4">
              <button
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`mt-1 shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${acceptedTerms
                    ? "bg-[#3246ff] border-[#3246ff] scale-105"
                    : "border-gray-400 hover:border-gray-500"
                  }`}
              >
                {acceptedTerms && <Check className="size-4 text-white stroke-[3]" />}
              </button>
              <p className="text-sm text-gray-700 leading-relaxed">
                Acepto{" "}
                <span className="text-[#3246ff] font-bold cursor-pointer hover:underline">términos y condiciones de Welfi</span>
                {" "}y el{" "}
                <span className="text-[#3246ff] font-bold cursor-pointer hover:underline">reglamento de gestión del fondo.</span>
                {selectedCurrency === "USD" && (
                  <span> Entiendo que la venta de dólares se realizará al precio MEP estimado.</span>
                )}
              </p>
            </div>
          </div>

          {/* Confirm button */}
          <button
            onClick={() => setStep("success")}
            disabled={!acceptedTerms}
            className={`w-full py-6 rounded-xl font-black transition-all text-xl ${acceptedTerms
                ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg hover:shadow-xl hover:shadow-[#3246ff]/30 scale-100 hover:scale-[1.02]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            {acceptedTerms ? "Confirmar inversión ✓" : "Aceptá los términos para continuar"}
          </button>

          {/* Bottom spacing */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );

  // Paso 5: Éxito
  const renderSuccessStep = () => (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="flex justify-center">
            <img src={imgSuccess} alt="Success" className="w-80 h-auto" />
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-6xl font-black text-gray-900">¡Listo!</h2>
              <div className="w-32 h-2 bg-gradient-to-r from-[#3246ff] to-[#E5582F] rounded-full mx-auto" />
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border-2 border-green-200 space-y-4">
              <p className="font-black text-2xl text-gray-900">Tu inversión fue configurada</p>
              <p className="text-gray-600 text-base leading-relaxed">
                Esta operación puede demorar hasta <strong>48 hs hábiles</strong> en ejecutarse.
                Te notificaremos cuando esté confirmada.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white py-6 rounded-xl font-black shadow-lg hover:shadow-xl hover:shadow-[#3246ff]/30 transition-all text-xl"
          >
            Ir al inicio →
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl h-[90vh] max-h-[900px] overflow-hidden relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          <X className="size-6" />
        </button>

        {step === "historic" && renderHistoricStep()}
        {step === "calculator" && renderCalculatorStep()}
        {step === "fundinfo" && renderFundInfoStep()}
        {step === "name" && renderNameStep()}
        {step === "confirm" && renderConfirmStep()}
        {step === "success" && renderSuccessStep()}
      </div>
    </div>
  );
}