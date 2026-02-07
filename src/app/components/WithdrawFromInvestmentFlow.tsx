import { X, ArrowRight, Check, ChevronLeft, Wallet } from "lucide-react";
import { useState } from "react";
import rocketImage from "../../assets/2e0e2f2f7c7a72aa9e737bca0a0a071131e2ad74.png";

interface WithdrawFromInvestmentFlowProps {
    onClose: () => void;
    investment: {
        name: string;
        emoji: string;
        currency: string; // Moneda de la inversión (ARS o USD)
        amount: string; // Valor actual de la inversión
    };
}

export function WithdrawFromInvestmentFlow({ onClose, investment }: WithdrawFromInvestmentFlowProps) {
    const [step, setStep] = useState(1); // 1: Amount, 2: Confirmation, 3: Success
    const [selectedCurrency, setSelectedCurrency] = useState<"ARS" | "USD">(
        investment.currency as "ARS" | "USD"
    );

    const [amount, setAmount] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);

    const exchangeRate = 1150; // Tipo de cambio MEP ejemplo

    // Helper to parse localized string to number
    const parseAmount = (val: string) => {
        return parseFloat(val.replace(/\./g, "").replace(",", ".")) || 0;
    };

    const investmentValue = parseAmount(investment.amount);

    // Handle currency change
    const handleCurrencyChange = (currency: "ARS" | "USD") => {
        setSelectedCurrency(currency);
        setAmount(""); // Reset amount on currency change to avoid confusion
    };

    const handleConfirm = () => {
        setStep(3);
        setTimeout(() => {
            onClose();
        }, 3000);
    };

    // Calculate equivalent amounts (What you receive vs What is deducted)
    // Logic: 
    // 1. If Same Currency: Input Amount = Deducted Amount = Received Amount
    // 2. Investment ARS -> Withdraw USD: Input (USD) -> Deduct (USD * Rate = ARS)
    // 3. Investment USD -> Withdraw ARS: Input (ARS) -> Deduct (ARS / Rate = USD)

    const getDeductedAmount = () => {
        if (!amount) return 0;
        const numAmount = parseFloat(amount.replace(/\./g, "").replace(",", "."));

        if (selectedCurrency === investment.currency) {
            return numAmount;
        }

        // Withdraw USD from ARS investment (Buying USD)
        if (selectedCurrency === "USD" && investment.currency === "ARS") {
            return numAmount * exchangeRate;
        }

        // Withdraw ARS from USD investment (Selling USD)
        if (selectedCurrency === "ARS" && investment.currency === "USD") {
            return numAmount / exchangeRate;
        }

        return 0;
    };

    // Get max available amount in SELECTED currency
    const getMaxAmount = () => {
        if (selectedCurrency === investment.currency) {
            return investmentValue;
        }
        // ARS Investment -> Max USD = ARS / Rate
        if (selectedCurrency === "USD" && investment.currency === "ARS") {
            return investmentValue / exchangeRate;
        }
        // USD Investment -> Max ARS = USD * Rate
        if (selectedCurrency === "ARS" && investment.currency === "USD") {
            return investmentValue * exchangeRate;
        }
        return 0;
    };

    const handleWithdrawAll = () => {
        const max = getMaxAmount();
        // Format to string with 2 decimals
        setAmount(max.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    };

    const deductedAmount = getDeductedAmount();
    // Allow a small margin of error for floating point comparisons when withdrawing all
    const isValidAmount = deductedAmount > 0 && deductedAmount <= (investmentValue + 0.01);

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
                                    <h2 className="text-xl font-black text-gray-900">Retirar dinero</h2>
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

                        {/* Investment Balance */}
                        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                            <p className="text-sm text-gray-600 mb-1">Saldo disponible para retirar</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-black text-gray-900">
                                    {investment.amount} <span className="text-lg text-gray-600">{investment.currency}</span>
                                </p>
                            </div>
                            {/* Show equivalent if currency differs or just as info */}
                            <p className="text-sm text-gray-500 mt-1">
                                ≈ {investment.currency === "ARS"
                                    ? `$ ${(investmentValue / exchangeRate).toLocaleString("es-AR", { maximumFractionDigits: 2 })} USD`
                                    : `$ ${(investmentValue * exchangeRate).toLocaleString("es-AR", { maximumFractionDigits: 2 })} ARS`
                                }
                            </p>
                        </div>

                        {/* Currency selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                ¿En qué moneda querés recibir?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleCurrencyChange("ARS")}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold ${selectedCurrency === "ARS"
                                        ? "border-[#3246ff] bg-blue-50 text-[#3246ff]"
                                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                                        }`}
                                >
                                    <div className="text-2xl mb-1">🇦🇷</div>
                                    Pesos (ARS)
                                </button>
                                <button
                                    onClick={() => handleCurrencyChange("USD")}
                                    className={`p-4 rounded-xl border-2 transition-all font-semibold ${selectedCurrency === "USD"
                                        ? "border-[#3246ff] bg-blue-50 text-[#3246ff]"
                                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                                        }`}
                                >
                                    <div className="text-2xl mb-1">💵</div>
                                    Dólares (USD)
                                </button>
                            </div>

                            {/* Conversion Warning */}
                            {selectedCurrency !== investment.currency && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="text-xs text-blue-800">
                                        💡 Estás retirando en <strong>{selectedCurrency}</strong> de una inversión en <strong>{investment.currency}</strong>.
                                        Se aplicará la conversión mediante dólar MEP (${exchangeRate.toLocaleString("es-AR")}).
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Amount input */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    ¿Cuánto querés retirar?
                                </label>
                                <button
                                    onClick={handleWithdrawAll}
                                    className="text-sm font-bold text-[#3246ff] hover:text-[#2635c2] transition-colors"
                                >
                                    Retirar todo
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
                                    className={`w-full pl-12 pr-24 py-4 text-2xl font-black text-gray-900 border-2 rounded-2xl focus:outline-none transition-colors ${!isValidAmount && amount ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-[#3246ff]"
                                        }`}
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-400">
                                    {selectedCurrency}
                                </span>
                            </div>

                            {/* Validation Message */}
                            {!isValidAmount && amount && (
                                <p className="text-sm text-red-500 mt-2 font-semibold">
                                    ⚠️ El monto excede tu saldo disponible ({deductedAmount.toLocaleString("es-AR", { maximumFractionDigits: 2 })} {investment.currency} a debitar)
                                </p>
                            )}

                            {/* Deduction details if conversion happens */}
                            {isValidAmount && amount && selectedCurrency !== investment.currency && (
                                <p className="text-sm text-gray-600 mt-2 font-semibold">
                                    ≈ se debitarán ${deductedAmount.toLocaleString("es-AR", { maximumFractionDigits: 2 })} {investment.currency} de tu inversión
                                </p>
                            )}
                        </div>

                        {/* Continue button */}
                        <button
                            onClick={() => setStep(2)}
                            disabled={!amount || amount === "0,00" || !isValidAmount}
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
                                Confirmación de retiro
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
                            <h2 className="text-3xl font-black text-gray-900 mb-2">¿Confirmás el retiro?</h2>
                            <p className="text-lg text-gray-600 font-semibold">{investment.name}</p>
                        </div>

                        {/* Summary card */}
                        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6 mb-6">

                            {/* Receiving Amount */}
                            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-semibold">Recibes</span>
                                    <span className="text-2xl font-black text-green-600">
                                        $ {amount} <span className="text-lg text-gray-900">{selectedCurrency}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Conversion details if needed */}
                            {selectedCurrency !== investment.currency && (
                                <>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-blue-800 font-semibold flex items-center gap-2">
                                                🔄 Dólar MEP
                                            </span>
                                            <span className="text-xl font-black text-blue-900">
                                                $ {exchangeRate.toLocaleString("es-AR")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 font-semibold">Se debita de inversión</span>
                                            <span className="text-lg font-bold text-gray-800">
                                                - {deductedAmount.toLocaleString("es-AR", { maximumFractionDigits: 2 })} {investment.currency}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* If no conversion, show simple debit */}
                            {selectedCurrency === investment.currency && (
                                <div className="bg-gray-100 border border-gray-200 rounded-xl p-4 mb-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-semibold">Se debita de inversión</span>
                                        <span className="text-lg font-bold text-gray-800">
                                            - {amount} {investment.currency}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="border-t-2 border-dashed border-gray-300 my-4"></div>

                            {/* Destination info (Mock) */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Wallet className="size-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Se acreditará en tu saldo {selectedCurrency}</p>
                                    <p className="text-xs text-gray-500">Disponible en Welfi</p>
                                </div>
                            </div>

                        </div>

                        {/* Warnings */}
                        <div className="space-y-3 mb-6">
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <span className="text-yellow-600 flex-shrink-0">⏱️</span>
                                    <div className="text-sm text-gray-700 space-y-2">
                                        <p>
                                            El dinero estará disponible en tu cuenta en <span className="font-bold">24 a 48 hs hábiles</span>.
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

                            {/* Conversion Disclaimer - Only if currencies differ */}
                            {selectedCurrency !== investment.currency && (
                                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                                    <div className="flex gap-3">
                                        <span className="text-blue-600 flex-shrink-0">ℹ️</span>
                                        <div className="text-sm text-blue-900 space-y-2">
                                            <p className="font-bold">Sobre la conversión:</p>
                                            <p>
                                                La cotización mostrada es <strong>estimada</strong> a valor actual.
                                            </p>
                                            <p>
                                                El cambio definitivo se realizará una vez rescatados los fondos (aprox. 24hs), ejecutando automáticamente la compra de {selectedCurrency}. El monto final se acreditará directamente en tu cuenta y puede variar levemente según la cotización del momento.
                                            </p>
                                        </div>
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
                                    Confirmo el rescate de fondos y acepto los{" "}
                                    <a href="#" className="text-[#3246ff] font-bold underline">
                                        términos y condiciones.
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
                            Confirmar retiro <Check className="size-5" />
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

                        {/* Rocket illustration (or different one for withdrawal?) - Reusing rocket for success vibe */}
                        <div className="mb-6 flex justify-center">
                            <img src={rocketImage} alt="Success" className="w-64 h-64 object-contain" />
                        </div>

                        {/* Title */}
                        <div className="mb-6">
                            <h2 className="text-4xl font-black text-gray-900 mb-2">¡Solicitud recibida!</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-[#3246ff] to-[#e5582f] mx-auto rounded-full" />
                        </div>

                        {/* Success message */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
                            <h3 className="text-xl font-black text-gray-900 mb-3">
                                Tu rescate está en proceso
                            </h3>
                            <p className="text-sm text-gray-600">
                                El dinero se acreditará en tu cuenta en un plazo máximo de <span className="font-bold">48 hs hábiles</span>.
                            </p>
                        </div>

                        {/* Return to home button */}
                        <button
                            onClick={onClose}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white font-bold text-lg hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Volver a la inversión <ArrowRight className="size-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
