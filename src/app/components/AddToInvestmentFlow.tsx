import { X, ArrowRight, Check, ChevronLeft } from "lucide-react";
import { useState } from "react";
import rocketImage from "../../assets/2e0e2f2f7c7a72aa9e737bca0a0a071131e2ad74.png";
interface AddToInvestmentFlowProps {
  onClose: () => void;
  investment: {
    name: string;
    emoji: string;
    currency: string; // Moneda de la inversión (ARS o USD)
    monthlyInvestment?: string;
    amount: string; // current amount
    allowedInputCurrencies?: ("ARS" | "USD")[];
  };
  availableBalance: {
    ars: string;
    usd: string;
  };
}

export function AddToInvestmentFlow({ onClose, investment, availableBalance }: AddToInvestmentFlowProps) {
  const [step, setStep] = useState(1); // 1: Amount, 2: Confirmation, 3: Success
  const [selectedCurrency, setSelectedCurrency] = useState<"ARS" | "USD">(
    investment.currency as "ARS" | "USD"
  );

  const allowedCurrencies = investment.allowedInputCurrencies || ["ARS", "USD"];

  // Initialize with monthly investment amount if available and currency matches
  const getInitialAmount = () => {
    if (investment.monthlyInvestment && investment.currency === "ARS") {
      return investment.monthlyInvestment;
    }
    if (investment.monthlyInvestment && investment.currency === "USD") {
      return investment.monthlyInvestment;
    }
    return "";
  };

  const [amount, setAmount] = useState(getInitialAmount());
  const [acceptTerms, setAcceptTerms] = useState(false);
  const exchangeRate = 1150; // Tipo de cambio MEP ejemplo

  // Handle currency change and auto-fill amount
  const handleCurrencyChange = (currency: "ARS" | "USD") => {
    if (!allowedCurrencies.includes(currency)) {
      // Generic message or specific? 
      // User requested: "Esta inversión solo permite suscripciones en USD" (implied for ARS->USD case, but seemingly reversed in prompt).
      // I will return a clear message based on what IS allowed.
      const allowed = allowedCurrencies.join(" o ");
      alert(`Esta inversión solo permite suscripciones en ${allowed === "ARS" ? "Pesos (ARS)" : "Dólares (USD)"}.`);
      return;
    }

    setSelectedCurrency(currency);

    // If switching to USD and investment is in ARS, convert the monthly investment
    if (currency === "USD" && investment.currency === "ARS" && investment.monthlyInvestment) {
      const arsAmount = parseFloat(investment.monthlyInvestment.replace(",", "."));
      if (!isNaN(arsAmount)) {
        const usdEquivalent = (arsAmount / exchangeRate).toFixed(2);
        setAmount(usdEquivalent.replace(".", ","));
      }
    }
    // If switching to ARS and investment is in ARS, set to monthly investment
    if (currency === "ARS" && investment.currency === "ARS" && investment.monthlyInvestment) {
      setAmount(investment.monthlyInvestment);
    }
  };

  const handleConfirm = () => {
    setStep(3);
    setTimeout(() => {
      onClose();
      setStep(1);
      setAmount(getInitialAmount());
      setSelectedCurrency(investment.currency as "ARS" | "USD");
      setAcceptTerms(false);
    }, 3000);
  };

  // Calculate equivalent amounts
  const getEquivalentAmount = () => {
    if (!amount) return "";
    const numAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(numAmount)) return "";

    // Case 3: ARS Strategy, Input USD -> Convert to ARS
    if (selectedCurrency === "USD" && investment.currency === "ARS") {
      return (numAmount * exchangeRate).toFixed(2);
    }
    // Case 4: USD Strategy, Input ARS -> Convert to USD
    if (selectedCurrency === "ARS" && investment.currency === "USD") {
      return (numAmount / exchangeRate).toFixed(2);
    }
    return "";
  };

  const getMonthlyInvestmentDisplay = () => {
    if (!investment.monthlyInvestment) return "";
    if (investment.currency === "USD") {
      const usdAmount = investment.monthlyInvestment;
      const arsEquivalent = (parseFloat(usdAmount.replace(",", ".")) * exchangeRate).toFixed(2);
      return `${usdAmount} USD (~${arsEquivalent.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ARS)`;
    }
    return `${investment.monthlyInvestment} ${investment.currency}`;
  };

  const handleInvestAll = () => {
    if (selectedCurrency === "ARS") {
      setAmount(availableBalance.ars);
    } else {
      setAmount(availableBalance.usd);
    }
  };

  const isArsDisabled = !allowedCurrencies.includes("ARS");
  const isUsdDisabled = !allowedCurrencies.includes("USD");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Step 1: Enter amount */}
        {step === 1 && (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <span className="text-2xl">{investment.emoji}</span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900">Sumar dinero</h2>
                  <p className="text-sm text-gray-600">{investment.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            {/* Available balance */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Dinero disponible para invertir</p>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xl font-black text-gray-900">
                    {availableBalance.ars} <span className="text-sm text-gray-600">ARS</span>
                  </p>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div>
                  <p className="text-xl font-black text-gray-900">
                    {availableBalance.usd} <span className="text-sm text-gray-600">USD</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Current investment balance */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Saldo actual</p>
              <p className="text-2xl font-black text-gray-900">
                {investment.amount} <span className="text-lg text-gray-600">{investment.currency}</span>
              </p>
            </div>

            {/* Monthly investment configured - destacado */}
            {investment.monthlyInvestment && (
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-2xl p-4 mb-6">
                <p className="text-sm font-bold text-blue-900 mb-1">💡 Tu inversión mensual configurada</p>
                <p className="text-2xl font-black text-blue-900">
                  {getMonthlyInvestmentDisplay()}
                </p>
                {investment.currency === "USD" && (
                  <p className="text-xs text-blue-700 mt-2">
                    Tipo de cambio MEP: ${exchangeRate.toLocaleString("es-AR")}
                  </p>
                )}
              </div>
            )}

            {/* Currency selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ¿Con qué moneda querés invertir?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleCurrencyChange("ARS")}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold ${selectedCurrency === "ARS"
                      ? "border-[#3246ff] bg-blue-50 text-[#3246ff]"
                      : isArsDisabled
                        ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                >
                  <div className="text-2xl mb-1">🇦🇷</div>
                  Pesos (ARS)
                  {isArsDisabled && <span className="block text-[10px] mt-1 text-red-400 font-bold">No habilitado</span>}
                </button>
                <button
                  onClick={() => handleCurrencyChange("USD")}
                  className={`p-4 rounded-xl border-2 transition-all font-semibold ${selectedCurrency === "USD"
                      ? "border-[#3246ff] bg-blue-50 text-[#3246ff]"
                      : isUsdDisabled
                        ? "border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                >
                  <div className="text-2xl mb-1">💵</div>
                  Dólares (USD)
                  {isUsdDisabled && <span className="block text-[10px] mt-1 text-red-400 font-bold">No habilitado</span>}
                </button>
              </div>

              {/* Warning for MEP (USD -> ARS) */}
              {selectedCurrency === "USD" && investment.currency === "ARS" && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-800">
                    💡 Tus USD serán convertidos a ARS mediante dólar MEP (${exchangeRate.toLocaleString("es-AR")})
                  </p>
                </div>
              )}

              {/* Warning for CCL/MEP Reverse (ARS -> USD) */}
              {selectedCurrency === "ARS" && investment.currency === "USD" && (
                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-800">
                    💡 Tus ARS serán convertidos a USD al tipo de cambio estimado (${exchangeRate.toLocaleString("es-AR")})
                  </p>
                </div>
              )}
            </div>
            {/* Amount input */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">
                  ¿Cuánto querés sumar?
                </label>
                <button
                  onClick={handleInvestAll}
                  className="text-sm font-bold text-[#3246ff] hover:text-[#2635c2] transition-colors"
                >
                  Invertir todo disponible
                </button>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-400">
                  $
                </span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,]/g, "");
                    setAmount(value);
                  }}
                  placeholder="0,00"
                  className="w-full pl-12 pr-24 py-4 text-2xl font-black text-gray-900 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#3246ff] transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
                  {selectedCurrency}
                </span>
              </div>
              {selectedCurrency !== investment.currency && amount && getEquivalentAmount() && (
                <p className="text-sm text-gray-600 mt-2 font-semibold">
                  ≈ ${getEquivalentAmount()} {investment.currency} se sumarán a tu inversión
                </p>
              )}
            </div>
            {/* Continue button */}
            <button
              onClick={() => setStep(2)}
              disabled={!amount || amount === "0,00"}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white font-bold text-lg hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Continuar
              <ArrowRight className="size-5" />
            </button>
          </div>
        )}
        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setStep(1)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="size-5 text-gray-600" />
              </button>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Confirmación de inversión
              </h3>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="size-5 text-gray-600" />
              </button>
            </div>
            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-gray-900 mb-2">¿Estamos ok?</h2>
              <p className="text-lg text-gray-600 font-semibold">{investment.name}</p>
            </div>
            {/* Summary card */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">
              {/* If converting USD to ARS */}
              {selectedCurrency === "USD" && investment.currency === "ARS" && (
                <>
                  {/* Vendes */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">Vendes</span>
                      <span className="text-xl font-black text-gray-900">
                        USD {amount}
                      </span>
                    </div>
                  </div>
                  {/* Dólar MEP */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-semibold flex items-center gap-2">
                        🔄 Dólar MEP (estimado)
                      </span>
                      <span className="text-xl font-black text-blue-900">
                        $ {exchangeRate.toLocaleString("es-AR")}
                      </span>
                    </div>
                  </div>
                  {/* Recibes en ARS */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">Recibes en ARS</span>
                      <span className="text-xl font-black text-gray-900">
                        ≈ ${getEquivalentAmount()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </span>
                    </div>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 my-4"></div>
                  {/* Monto a invertir */}
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-semibold">Monto a invertir</span>
                      <span className="text-2xl font-black text-[#3246ff]">
                        ARS {getEquivalentAmount()?.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {/* If same currency or ARS to USD */}
              {!(selectedCurrency === "USD" && investment.currency === "ARS") && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">Monto a invertir</span>
                    <span className="text-2xl font-black text-[#3246ff]">
                      {selectedCurrency} {amount}
                    </span>
                  </div>
                  {selectedCurrency !== investment.currency && (
                    <p className="text-sm text-gray-600 mt-2 text-right">
                      ≈ ${getEquivalentAmount()} {investment.currency}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* Warnings */}
            <div className="space-y-3 mb-6">
              {/* Processing time warning */}
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <span className="text-yellow-600 flex-shrink-0">🔒</span>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      Al confirmar, la operación pasará a estado "pendiente" y se ejecutará en <span className="font-bold">24-48 hs hábiles</span>.
                    </p>
                    <p className="text-xs text-gray-600">
                      Tené en cuenta los horarios de corte para que la operación ingrese hoy:
                      <br />• <strong>FCI:</strong> hasta las 15:00 hs.
                      <br />• <strong>Otros instrumentos:</strong> hasta las 16:45 hs.
                    </p>
                    <p className="text-xs text-gray-600">
                      Si operás después de este horario o en días no hábiles, la solicitud pasará automáticamente para el día hábil siguiente.
                    </p>
                  </div>
                </div>
              </div>
              {/* MEP rate warning - only if converting USD to ARS */}
              {selectedCurrency === "USD" && investment.currency === "ARS" && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <span className="text-blue-600 flex-shrink-0">⚠️</span>
                    <p className="text-sm text-blue-800">
                      La cotización del dólar MEP es estimada y puede variar ligeramente al momento
                      de ejecutar la operación.
                    </p>
                  </div>
                </div>
              )}
            </div>
            {/* Terms and conditions */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-5 h-5 text-[#3246ff] border-gray-300 rounded focus:ring-[#3246ff]"
                  />
                </div>
                <span className="text-sm text-gray-700">
                  Acepto{" "}
                  <a href="#" className="text-[#3246ff] font-bold underline">
                    términos y condiciones de Welfi
                  </a>{" "}
                  y el{" "}
                  <a href="#" className="text-[#3246ff] font-bold underline">
                    reglamento de gestión del fondo.
                  </a>
                </span>
              </label>
            </div>
            {/* Confirm button */}
            <button
              onClick={handleConfirm}
              disabled={!acceptTerms}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white font-bold text-lg hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Confirmar inversión <Check className="size-5" />
            </button>
          </div>
        )}
        {/* Step 3: Success */}
        {step === 3 && (
          <div className="p-8 text-center relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="size-5 text-gray-600" />
            </button>
            {/* Rocket illustration */}
            <div className="mb-6 flex justify-center">
              <img src={rocketImage} alt="Rocket" className="w-64 h-64 object-contain" />
            </div>
            {/* Title with underline */}
            <div className="mb-6">
              <h2 className="text-4xl font-black text-gray-900 mb-2">¡Listo!</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#3246ff] to-[#e5582f] mx-auto rounded-full" />
            </div>
            {/* Success message */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-black text-gray-900 mb-3">
                Tu inversión fue configurada
              </h3>
              <p className="text-sm text-gray-600">
                Esta operación puede demorar hasta{" "}
                <span className="font-bold">48 hs hábiles</span> en ejecutarse. Te notificaremos
                cuando esté confirmada.
              </p>
            </div>
            {/* Return to home button */}
            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white font-bold text-lg hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Ir al inicio <ArrowRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}