"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";

// ─── Step types ───────────────────────────────────────────────────────────────
type Step = "welcome" | "email" | "otp";

// ─── Welfi Logo inline (SVG text — no external dep) ──────────────────────────
function WelfiLogo({ size = 40 }: { size?: number }) {
    return (
        <div className="flex items-center gap-2">
            <Image
                src="/welfi_isologotipo.png"
                alt="Welfi"
                width={size}
                height={size}
                className="object-contain"
            />
            <span
                className="text-white font-bold"
                style={{ fontSize: size * 0.7 }}
            >
                welfi
            </span>
        </div>
    );
}

// ─── OTP Slot for input-otp ───────────────────────────────────────────────────
function OtpSlot({ char, hasFakeCaret, isActive }: { char: string | null; hasFakeCaret: boolean; isActive: boolean }) {
    return (
        <div
            className={`relative w-12 h-14 flex items-center justify-center rounded-xl border-2 text-2xl font-bold transition-all
                ${isActive ? "border-[#3246ff] bg-white shadow-lg shadow-[#3246ff]/20" : "border-gray-200 bg-gray-50 text-gray-800"}
            `}
        >
            {char ?? ""}
            {hasFakeCaret && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-px h-6 bg-[#3246ff] animate-pulse" />
                </div>
            )}
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
    const router = useRouter();
    const { sendOtp, verifyOtp, isLoading } = useAuth();

    const [step, setStep] = useState<Step>("welcome");
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ── Step 1: Send OTP ────────────────────────────────────────────────────

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            await sendOtp(email);
            setStep("otp");
        } catch {
            setError("No pudimos enviar el código. Verificá el email e intentá de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Step 2: Verify OTP ──────────────────────────────────────────────────

    const handleVerifyOtp = async (code: string) => {
        if (code.length < 6) return;
        setError(null);
        setIsSubmitting(true);
        try {
            await verifyOtp(email, code);
            router.push("/");
        } catch {
            setError("Código incorrecto o expirado. Revisalo e intentá de nuevo.");
            setOtpCode("");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setError(null);
        setOtpCode("");
        try {
            await sendOtp(email);
        } catch {
            setError("No pudimos reenviar el código. Intentá de nuevo.");
        }
    };

    // ── Loading guard ───────────────────────────────────────────────────────
    if (isLoading) return null;

    // ── UI ──────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen w-full flex relative overflow-hidden bg-[#1a2fff]">
            {/* Background gradient */}
            <div className="absolute inset-0">
                <div className="absolute top-[-30%] left-[-20%] w-[80%] h-[80%] bg-[#4856ff]/50 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-[#3246ff]/40 rounded-full blur-[120px]" />
            </div>

            {/* Left logo */}
            <div className="hidden lg:flex absolute top-10 left-10 z-10">
                <WelfiLogo size={44} />
            </div>
            <div className="flex lg:hidden absolute top-6 left-6 z-10">
                <WelfiLogo size={36} />
            </div>

            {/* Center content */}
            <div className="relative z-10 w-full flex flex-col items-center justify-center px-6 py-20">

                {/* ── WELCOME ── */}
                {step === "welcome" && (
                    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido!</h2>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Con welfi podés ahorrar de manera eficiente y lograr tus objetivos.
                            </p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => setStep("email")}
                                className="w-full py-3.5 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#3246ff] to-[#4856ff] hover:from-[#2536cc] hover:to-[#3644cc] transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#3246ff]/30"
                            >
                                ¡Me quiero sumar!
                            </button>
                            <button
                                onClick={() => setStep("email")}
                                className="w-full py-3 px-4 text-sm font-medium text-[#3246ff] hover:text-[#2536cc] transition-colors"
                            >
                                Ya soy welfier
                            </button>
                        </div>
                    </div>
                )}

                {/* ── EMAIL ── */}
                {step === "email" && (
                    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold text-gray-900">¡Que bueno tenerte de nuevo!</h2>
                            <p className="text-gray-500 text-sm">
                                Iniciá sesión para seguir avanzando a tus metas.
                            </p>
                        </div>

                        <form onSubmit={handleSendOtp} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Ingresar
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        autoFocus
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="usuario@welfi.com.ar"
                                        className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3246ff]/20 focus:border-[#3246ff] transition-all"
                                    />
                                </div>
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || !email}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-[#3246ff] to-[#4856ff] hover:from-[#2536cc] hover:to-[#3644cc] disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-[#3246ff]/30"
                            >
                                {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>Siguiente <ArrowRight className="h-4 w-4" /></>
                                )}
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-100" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white text-gray-400">ó</span>
                            </div>
                        </div>

                        {/* Google - disabled until Firebase is set up */}
                        <button
                            disabled
                            title="Próximamente disponible"
                            className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed"
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                                className="h-4 w-4 opacity-50"
                            />
                            Iniciá sesión con Google
                        </button>
                    </div>
                )}

                {/* ── OTP ── */}
                {step === "otp" && (
                    <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <button
                            onClick={() => { setStep("email"); setError(null); setOtpCode(""); }}
                            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" /> Volver
                        </button>

                        <div className="space-y-1 text-center">
                            <h2 className="text-2xl font-bold text-gray-900">Revisá tu email</h2>
                            <p className="text-gray-500 text-sm">
                                Te enviamos un código de 6 dígitos a<br />
                                <span className="font-semibold text-gray-700">{email}</span>
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <OTPInput
                                value={otpCode}
                                onChange={(val) => {
                                    setOtpCode(val);
                                    setError(null);
                                    if (val.length === 6) handleVerifyOtp(val);
                                }}
                                maxLength={6}
                                pattern={REGEXP_ONLY_DIGITS}
                                disabled={isSubmitting}
                                render={({ slots }) => (
                                    <div className="flex gap-2">
                                        {slots.map((slot, i) => (
                                            <OtpSlot key={i} {...slot} />
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        {isSubmitting && (
                            <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-[#3246ff]/30 border-t-[#3246ff] rounded-full animate-spin" />
                            </div>
                        )}

                        {error && (
                            <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg text-center">{error}</p>
                        )}

                        <p className="text-center text-sm text-gray-400">
                            ¿No llegó el código?{" "}
                            <button
                                onClick={handleResendOtp}
                                className="font-medium text-[#3246ff] hover:text-[#2536cc] transition-colors"
                            >
                                Reenviar
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
