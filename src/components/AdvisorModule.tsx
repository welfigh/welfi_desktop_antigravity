import { Phone, Video, MessageCircle, Lock, Crown, Sparkles } from "lucide-react";
import { useState } from "react";
import type { WelfiTier } from "../constants/tierConfig";
import { advisorInfo, tierConfigs } from "../constants/tierConfig";

interface AdvisorModuleProps {
    tier: WelfiTier;
    className?: string;
}

export function AdvisorModule({ tier, className = "" }: AdvisorModuleProps) {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    return (
        <>
            <div className={`relative ${className}`}>
                {/* ========== NORMAL TIER: Blurred + Upsell ========== */}
                {tier === "normal" && (
                    <div className="relative overflow-hidden rounded-3xl shadow-xl">
                        {/* Blurred advisor preview */}
                        <div className="filter blur-[4px] grayscale opacity-60 pointer-events-none select-none">
                            <div className="bg-white p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={advisorInfo.photoUrl}
                                        alt="Asesor"
                                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg">{advisorInfo.name}</p>
                                        <p className="text-sm text-gray-500">{advisorInfo.email}</p>
                                        <p className="text-sm text-gray-500">{advisorInfo.phone}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-1 py-3 bg-gray-200 text-gray-400 rounded-xl font-bold text-center">
                                        Contactar por WhatsApp
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Overlay CTA */}
                        <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center p-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3246ff] to-[#6366f1] flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                                <Lock className="size-7 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2 text-center">
                                Desbloqueá tu asesor personalizado
                            </h3>
                            <p className="text-sm text-gray-600 text-center mb-4 max-w-xs">
                                Tené un experto que te acompañe en cada decisión de inversión, por WhatsApp, cuando lo necesites.
                            </p>
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-[#3246ff] via-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                <Sparkles className="size-4" />
                                Sumate a Welfi Pro • $3 USD/mes
                            </button>
                            <p className="text-[11px] text-gray-400 mt-2">
                                O invertí más de $10.000 USD y es gratis
                            </p>
                        </div>
                    </div>
                )}

                {/* ========== PRO TIER: Full advisor access ========== */}
                {tier === "pro" && (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
                        {/* Pro header accent */}
                        <div className="h-1.5 bg-gradient-to-r from-[#3246ff] via-[#6366f1] to-[#8b5cf6]" />

                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-lg">👤</span>
                                <h3 className="font-black text-gray-900">Tu asesor personal</h3>
                                <span className="px-2 py-0.5 bg-gradient-to-r from-[#3246ff] to-[#6366f1] text-white text-[10px] font-bold rounded-full">
                                    PRO ⚡
                                </span>
                            </div>

                            <div className="flex items-center gap-4 mb-5">
                                <div className="relative">
                                    <img
                                        src={advisorInfo.photoUrl}
                                        alt={advisorInfo.name}
                                        className="w-16 h-16 rounded-full object-cover border-3 border-blue-200 shadow-lg"
                                    />
                                    {/* Online indicator */}
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                </div>
                                <div>
                                    <p className="font-black text-gray-900 text-lg">{advisorInfo.name}</p>
                                    <p className="text-sm text-gray-500">{advisorInfo.email}</p>
                                    <p className="text-sm text-gray-500">{advisorInfo.phone}</p>
                                </div>
                            </div>

                            {/* WhatsApp Contact Button */}
                            <a
                                href={`https://wa.me/${advisorInfo.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            >
                                <MessageCircle className="size-5" fill="white" />
                                Contactar por WhatsApp
                            </a>

                            {/* Upgrade to Black hint */}
                            <button
                                onClick={() => setShowUpgradeModal(true)}
                                className="w-full mt-3 py-3 text-center text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors"
                            >
                                💎 ¿Querés videollamadas y carteras personalizadas? Conocé Welfi Black
                            </button>
                        </div>
                    </div>
                )}

                {/* ========== BLACK TIER: Full premium experience ========== */}
                {tier === "black" && (
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                        {/* Premium dark gradient bg */}
                        <div className="bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] p-6">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                {/* Black header */}
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">👤</span>
                                        <h3 className="font-black text-white">Tu asesor exclusivo</h3>
                                    </div>
                                    <span
                                        className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider border border-purple-400/30"
                                        style={{
                                            background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                                            color: "#ffd700",
                                            boxShadow: "0 0 12px rgba(168,85,247,0.3)",
                                        }}
                                    >
                                        💎 BLACK
                                    </span>
                                </div>

                                {/* Advisor card */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative">
                                        <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full opacity-50 blur-sm" />
                                        <img
                                            src={advisorInfo.photoUrl}
                                            alt={advisorInfo.name}
                                            className="relative w-16 h-16 rounded-full object-cover border-2 border-purple-400/50"
                                        />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1a2e]" />
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-lg">{advisorInfo.name}</p>
                                        <p className="text-sm text-purple-300/80">{advisorInfo.email}</p>
                                        <p className="text-sm text-purple-300/80">{advisorInfo.phone}</p>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <a
                                        href={`https://wa.me/${advisorInfo.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <MessageCircle className="size-4" fill="white" />
                                        WhatsApp
                                    </a>
                                    <button
                                        onClick={() => alert("Llamar al asesor — WIP")}
                                        className="flex items-center justify-center gap-2 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/10 transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <Phone className="size-4" />
                                        Llamar
                                    </button>
                                </div>

                                <button
                                    onClick={() => alert("Agendar videollamada — WIP")}
                                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <Video className="size-4" />
                                    Agendar videollamada
                                </button>

                                {/* Black exclusive services */}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-[10px] text-purple-300/60 font-bold tracking-wider mb-3">SERVICIOS EXCLUSIVOS BLACK</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => alert("Solicitar cartera personalizada — WIP")}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-all group"
                                        >
                                            <span className="text-lg">📊</span>
                                            <p className="text-xs font-bold text-white mt-1">Cartera personalizada</p>
                                            <p className="text-[10px] text-purple-300/50">Pedí tu portfolio a medida</p>
                                        </button>
                                        <button
                                            onClick={() => alert("Planificación financiera — WIP")}
                                            className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-all group"
                                        >
                                            <span className="text-lg">📋</span>
                                            <p className="text-xs font-bold text-white mt-1">Plan financiero</p>
                                            <p className="text-[10px] text-purple-300/50">Planificación integral</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ========== UPGRADE MODAL ========== */}
            {showUpgradeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpgradeModal(false)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowUpgradeModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                        >
                            ✕
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3246ff] to-[#8b5cf6] flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <Crown className="size-8 text-white" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Mejorá tu experiencia Welfi</h2>
                            <p className="text-gray-500">Elegí el plan que mejor se adapte a tus necesidades</p>
                        </div>

                        {/* Plans comparison */}
                        <div className="space-y-4">
                            {/* Pro Plan */}
                            <div
                                className={`rounded-2xl p-5 border-2 transition-all cursor-pointer hover:scale-[1.02] ${tier === "pro"
                                    ? "border-blue-300 bg-blue-50 opacity-60"
                                    : "border-blue-200 hover:border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-gradient-to-r from-[#3246ff] to-[#6366f1] text-white text-xs font-bold rounded-full">
                                            ⚡ PRO
                                        </span>
                                        {tier === "pro" && (
                                            <span className="text-xs text-blue-600 font-bold">Tu plan actual</span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-gray-900">$3 <span className="text-sm font-bold text-gray-500">USD/mes</span></p>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {tierConfigs.pro.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                            <span className="text-green-500 text-xs">✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-[10px] text-gray-400 mt-3">
                                    Gratis con +$10.000 USD invertidos
                                </p>
                                {tier !== "pro" && tier !== "black" && (
                                    <button
                                        onClick={() => alert("Suscripción Welfi Pro — WIP")}
                                        className="w-full mt-3 py-3 bg-gradient-to-r from-[#3246ff] to-[#6366f1] text-white font-bold rounded-xl hover:from-[#4856ff] hover:to-[#8b5cf6] transition-all shadow-lg"
                                    >
                                        Suscribirme a Pro
                                    </button>
                                )}
                            </div>

                            {/* Black Plan */}
                            <div
                                className={`rounded-2xl p-5 border-2 transition-all cursor-pointer hover:scale-[1.02] ${tier === "black"
                                    ? "border-purple-300 bg-purple-50 opacity-60"
                                    : "border-purple-200 hover:border-purple-400 bg-gradient-to-br from-gray-900 to-[#1a1a2e]"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="px-2 py-0.5 text-xs font-bold rounded-full border border-purple-400/30"
                                            style={{
                                                background: "linear-gradient(135deg, #1a1a2e, #0f3460)",
                                                color: "#ffd700",
                                            }}
                                        >
                                            💎 BLACK
                                        </span>
                                        {tier === "black" && (
                                            <span className="text-xs text-purple-300 font-bold">Tu plan actual</span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xl font-black ${tier === "black" ? "text-gray-900" : "text-white"}`}>
                                            $10 <span className={`text-sm font-bold ${tier === "black" ? "text-gray-500" : "text-gray-400"}`}>USD/mes</span>
                                        </p>
                                    </div>
                                </div>
                                <ul className="space-y-2">
                                    {tierConfigs.black.features.map((f, i) => (
                                        <li key={i} className={`flex items-center gap-2 text-sm ${tier === "black" ? "text-gray-700" : "text-gray-300"}`}>
                                            <span className="text-amber-400 text-xs">✓</span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <p className={`text-[10px] mt-3 ${tier === "black" ? "text-gray-400" : "text-gray-500"}`}>
                                    Gratis con +$20.000 USD invertidos
                                </p>
                                {tier !== "black" && (
                                    <button
                                        onClick={() => alert("Suscripción Welfi Black — WIP")}
                                        className="w-full mt-3 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
                                    >
                                        Suscribirme a Black
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
