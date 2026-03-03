import { ChevronLeft, X, TrendingUp, AlertTriangle, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import rocketImage from "../assets/2e0e2f2f7c7a72aa9e737bca0a0a071131e2ad74.png";

interface Strategy {
    id: string;
    title: string;
    description: string;
    risk: string;
    currency: string;
    rate: string;
    color: string;
    icon: any;
}

interface StrategyConfirmationProps {
    strategy: Strategy;
    amount: string;
    goalName: string;
    onBack: () => void;
    onClose: () => void;
    onSuccess: () => void;
}

export function StrategyConfirmation({ strategy, amount, goalName, onBack, onClose, onSuccess }: StrategyConfirmationProps) {
    const [step, setStep] = useState<"confirm" | "success">("confirm");
    const [acceptTerms, setAcceptTerms] = useState(false);

    // Hardcoded MEP rate for parity with CreateWelfiPesosFlow
    const MEP_RATE = 1240;
    const numericAmount = parseInt(amount || "0");
    const investedArs = strategy.currency === "USD" ? numericAmount * MEP_RATE : numericAmount;

    if (step === "success") {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center relative w-full">
                <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="size-6 text-gray-600" /></button>

                <div className="mb-8">
                    <img src={rocketImage.src} alt="Success" className="w-64 h-64 object-contain animate-bounce-slow" />
                </div>

                <div className="mb-8">
                    <h2 className="text-4xl font-black text-gray-900 mb-2">¡Objetivo Creado!</h2>
                    <div className={`w-24 h-1 bg-gradient-to-r ${strategy.color} mx-auto rounded-full`} />
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8 max-w-md w-full">
                    <h3 className="text-xl font-black text-gray-900 mb-3">
                        Tu inversión fue configurada
                    </h3>
                    <p className="text-sm text-gray-600">
                        Esta operación puede demorar hasta{" "}
                        <span className="font-bold">48 hs hábiles</span> en ejecutarse. Te notificaremos
                        cuando esté confirmada.
                    </p>
                </div>

                <button
                    onClick={onSuccess}
                    className={`w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r ${strategy.color} text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2`}
                >
                    Ir al inicio <ArrowRight className="size-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 h-full flex flex-col relative w-full items-center justify-center overflow-y-auto">
            <div className="absolute top-0 left-0 w-full flex justify-between p-8">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="size-6 text-gray-600" /></button>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">CONFIRMACIÓN DE INVERSIÓN</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="size-6 text-gray-600" /></button>
            </div>

            <div className="w-full max-w-lg text-center mt-12 pb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-2">¿Estamos ok?</h2>
                <p className="text-xl font-bold text-gray-600 mb-8">{goalName}</p>

                <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 text-left">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${strategy.color} flex items-center justify-center shadow-inner`}>
                            <strategy.icon className="size-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Estrategia elegida</p>
                            <p className="text-lg font-black text-gray-900">{strategy.title}</p>
                        </div>
                    </div>

                    {strategy.currency === "USD" ? (
                        <>
                            <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl mb-3">
                                <span className="text-gray-600 font-bold">Inversión Inicial en USD</span>
                                <span className="text-gray-900 font-black">u$s {numericAmount.toLocaleString('es-AR')}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-blue-50/50 border border-blue-100 rounded-xl mb-3">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="size-4 text-[#3246ff]" />
                                    <span className="text-[#3246ff] font-bold text-sm">Dólar MEP (estimado)</span>
                                </div>
                                <span className="text-gray-900 font-bold">$ {MEP_RATE.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                            </div>

                            <div className="border-t border-gray-200 border-dashed mb-6 mt-3" />

                            <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-6 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-bold">Monto a debitar</span>
                                    <span className="text-[#3246ff] font-black text-2xl">ARS {investedArs.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="border border-blue-100 bg-blue-50/50 rounded-2xl p-6 mb-6">
                            <p className="text-sm font-bold text-gray-600 mb-1">Monto a invertir (Inicial)</p>
                            <div className="flex justify-between items-baseline">
                                <span className="text-lg font-bold text-gray-900">ARS</span>
                                <span className="text-3xl font-black text-[#3246ff]">{numericAmount.toLocaleString('es-AR')}</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 text-left">
                            <div className="mt-0.5 text-yellow-600">⏱️</div>
                            <p className="text-xs text-gray-700">
                                Al confirmar la operación, pasará a encontrarse en estado <strong>"pendiente"</strong>. La misma puede demorar hasta <strong>48 hs hábiles</strong> en concretarse.
                            </p>
                        </div>

                        {strategy.currency === "USD" && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-left">
                                <AlertTriangle className="size-4 text-[#3246ff] flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-[#3246ff]">
                                    La cotización del dólar MEP es estimada y puede variar ligeramente al momento de ejecutar la operación.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border border-gray-200 rounded-2xl p-4 flex items-start gap-3 text-left cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setAcceptTerms(!acceptTerms)}>
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${acceptTerms ? 'bg-[#3246ff] border-[#3246ff]' : 'border-gray-300 bg-white'}`}>
                        {acceptTerms && <Check className="size-3 text-white" />}
                    </div>
                    <p className="text-sm text-gray-600">
                        Acepto <span className="text-[#3246ff] font-bold">términos y condiciones de Welfi</span> y el mandato de la estrategia seleccionada.
                    </p>
                </div>

                <button
                    onClick={() => setStep("success")}
                    disabled={!acceptTerms}
                    className="mt-8 w-full py-4 bg-gray-200 text-gray-500 rounded-2xl font-bold text-lg transition-all hover:bg-[#3246ff] hover:text-white disabled:opacity-50 disabled:hover:bg-gray-200 disabled:hover:text-gray-500"
                >
                    Aceptá los términos para continuar
                </button>
            </div>
        </div>
    );
}
