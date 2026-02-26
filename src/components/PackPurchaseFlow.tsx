import { ArrowLeft, Check, Rocket } from "lucide-react";
import { useState, useEffect } from "react";

interface Pack {
    id: string;
    name: string;
}

interface PackPurchaseFlowProps {
    pack: Pack;
    quantity: number;
    totalPrice: number;
    onBack: () => void;
    onClose: () => void;
}

export function PackPurchaseFlow({ pack, quantity, totalPrice, onBack, onClose }: PackPurchaseFlowProps) {
    const [step, setStep] = useState<"confirmation" | "processing" | "success">("confirmation");

    const handleInvest = () => {
        setStep("processing");
        // Simulate API call
        setTimeout(() => {
            setStep("success");
        }, 2000);
    };

    if (step === "success") {
        return (
            <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                    <Rocket className="size-16 text-[#3246ff] animate-bounce" />
                </div>

                <h2 className="text-3xl font-black text-gray-900 mb-4">¡Listo!</h2>
                <p className="text-lg font-bold text-gray-800 mb-2">Tu inversión fue configurada</p>
                <p className="text-gray-500 max-w-xs mx-auto mb-12">
                    Esta operación puede demorar hasta 24 hs en ejecutarse.
                </p>

                <button
                    onClick={onClose}
                    className="w-full max-w-sm py-4 rounded-xl bg-[#3246ff] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                >
                    Volver a mis cuentas
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 border-b border-gray-100">
                <div className="max-w-xl mx-auto flex items-center relative">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors absolute left-0"
                        disabled={step === "processing"}
                    >
                        <ArrowLeft className="size-5 text-gray-700" />
                    </button>
                    <div className="w-full text-center">
                        <h1 className="text-lg font-bold text-gray-900">Inversión</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-xl mx-auto w-full p-8 flex flex-col items-center pt-12">
                <h2 className="text-2xl font-black text-gray-900 mb-8 text-center">
                    {pack.name}
                </h2>

                <div className="w-full bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600 font-medium">Solicitud de inversión:</span>
                        <span className="text-xl font-black text-gray-900 text-right">
                            {totalPrice.toLocaleString("es-AR")} ARS
                        </span>
                    </div>

                    <p className="text-xs text-center text-gray-500 leading-relaxed max-w-xs mx-auto mt-4 border-t border-gray-200 pt-4">
                        Al confirmar la operación, pasará a encontrarse en estado "pendiente". La misma puede demorar hasta 24 hs hábiles en concretarse.
                    </p>
                    <p className="text-xs text-center text-gray-500 leading-relaxed max-w-xs mx-auto mt-2">
                        Podés hacer el seguimiento de tu orden en la sección de Actividad.
                    </p>
                </div>

                <div className="flex items-center gap-3 mb-8 cursor-pointer group">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-[#3246ff] transition-colors flex items-center justify-center">
                        {/* Mock checkbox unchecked/checked logic if needed, simplify for now */}
                    </div>
                    <p className="text-xs text-gray-500">
                        Acepto <span className="text-[#3246ff]">términos y condiciones de Welfi</span> y la <span className="text-[#3246ff]">declaración jurada del BCRA</span>.
                    </p>
                </div>
            </div>

            {/* Footer Button */}
            <div className="p-6 bg-white border-t border-gray-100">
                <div className="max-w-xl mx-auto">
                    <button
                        onClick={handleInvest}
                        disabled={step === "processing"}
                        className="w-full py-4 rounded-xl bg-[#3246ff] text-white font-bold text-lg shadow-lg hover:shadow-xl hover:bg-[#2635c2] transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                    >
                        {step === "processing" ? "Procesando..." : "Invertir"}
                    </button>
                </div>
            </div>
        </div>
    );
}
