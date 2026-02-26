import { ChevronLeft, X, TrendingUp, AlertTriangle, ChevronRight, Check, ArrowRight, Info, Calendar } from "lucide-react";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import rocketImage from "../assets/2e0e2f2f7c7a72aa9e737bca0a0a071131e2ad74.png";

interface CreateWelfiPesosFlowProps {
    onClose: () => void;
    availableBalance: {
        ars: string;
        usd: string;
    };
}

const chartData = [
    { date: '12 Ago', value: 95.50 },
    { date: '21 Ago', value: 101.20 },
    { date: '14 Sep', value: 99.80 },
    { date: '01 Oct', value: 104.50 },
    { date: '18 Nov', value: 102.30 },
    { date: '05 Dic', value: 106.80 }
];

const emojis = ["💰", "💸", "🏖️", "🚗", "🏡", "🎓", "💍", "👶", "🐶", "💻"];

export function CreateWelfiPesosFlow({ onClose, availableBalance }: CreateWelfiPesosFlowProps) {
    const [step, setStep] = useState<"intro" | "info" | "amount" | "name" | "confirm" | "success">("intro");
    const [amount, setAmount] = useState("");
    const [selectedCurrency, setSelectedCurrency] = useState<"ARS" | "USD">("ARS");
    const [selectedEmoji, setSelectedEmoji] = useState("💰");
    const [customName, setCustomName] = useState("");
    const [acceptTerms, setAcceptTerms] = useState(false);

    // --- RENDER STEPS ---

    // 1. INTRO STEP
    const renderIntro = () => (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="size-6 text-gray-500" /></button>

                <div className="text-center">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">RENDIMIENTO HISTÓRICO</h2>
                    <div className="flex items-center justify-center gap-2">
                        <h1 className="text-3xl font-black text-gray-900">Welfi Pesos</h1>
                    </div>
                </div>

                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="size-6 text-gray-500" /></button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-y-auto pr-2 pb-6">
                {/* Left Column: Chart + Details */}
                <div className="flex-1 space-y-6">
                    {/* Chart Section */}
                    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8">
                        <div className="flex items-baseline justify-between mb-2">
                            <div>
                                <p className="text-sm font-bold text-gray-500 mb-1">Valor de cuotaparte</p>
                                <div className="flex items-baseline gap-3">
                                    <h3 className="text-4xl font-black text-gray-900">$ 106,80</h3>
                                    <span className="bg-green-100 text-green-700 px-2.5 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                                        <TrendingUp className="size-3" /> +0.4%
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full my-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        hide={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        domain={['dataMin - 5', 'dataMax + 5']}
                                        tickFormatter={(value: number) => `$${Math.round(value)}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                        formatter={(value: number) => [`$ ${value}`, "Valor"]}
                                        labelStyle={{ color: '#9ca3af' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#e5582f"
                                        strokeWidth={4}
                                        dot={{ r: 0 }}
                                        activeDot={{ r: 6, fill: "#e5582f", stroke: "white", strokeWidth: 3 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Time Selectors - Bottom */}
                        <div className="flex justify-center">
                            <div className="flex bg-gray-100 p-1 rounded-xl">
                                <button className="px-6 py-2 bg-white text-[#3246ff] shadow-sm rounded-lg text-sm font-bold transition-all">1M</button>
                                <button className="px-6 py-2 text-gray-500 hover:text-gray-900 rounded-lg text-sm font-bold transition-all">3M</button>
                                <button className="px-6 py-2 text-gray-500 hover:text-gray-900 rounded-lg text-sm font-bold transition-all">1A</button>
                                <button className="px-6 py-2 text-gray-500 hover:text-gray-900 rounded-lg text-sm font-bold transition-all">YTD</button>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Info Grid (Moved from Step 2) */}
                    <h3 className="text-xl font-black text-gray-900 ml-2">Detalles del fondo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#3246ff] flex items-center justify-center text-white flex-shrink-0">
                                <TrendingUp className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">¿En qué invierte?</h4>
                                <p className="text-sm text-gray-600 leading-snug">100% FCI Adcap Renta Dólar. Instrumentos de renta fija de corto plazo.</p>
                            </div>
                        </div>

                        <div className="p-5 border border-gray-100 rounded-2xl flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                                <AlertTriangle className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">¿Qué hace?</h4>
                                <p className="text-sm text-gray-600 leading-snug">Genera intereses con bonos corporativos y soberanos.</p>
                            </div>
                        </div>

                        <div className="p-5 border border-gray-100 rounded-2xl flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                <div className="text-lg">💰</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Moneda</h4>
                                <p className="text-sm text-gray-600 leading-snug">Dólares Estadounidenses (USD)</p>
                            </div>
                        </div>

                        <div className="p-5 border border-gray-100 rounded-2xl flex items-start gap-4 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                                <TrendingUp className="size-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">Objetivo</h4>
                                <p className="text-sm text-gray-600 leading-snug">Ganarle a la inflación en dólares.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Summary & CTA */}
                <div className="w-full lg:w-[380px] flex-shrink-0 space-y-6 lg:sticky lg:top-0">
                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                        <h2 className="text-2xl font-black text-gray-900 mb-4">Resumen</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Una opción conservadora para hacer rendir tus dólares mientras decidís tu próxima inversión.
                        </p>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                                <span className="text-xs font-bold text-gray-500 uppercase">Volatilidad</span>
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-[#3246ff]" />
                                    <div className="w-2 h-2 rounded-full bg-[#3246ff]" />
                                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                                <span className="text-xs font-bold text-gray-500 uppercase">Plazo sugerido</span>
                                <span className="font-bold text-gray-900">3 meses</span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                                <span className="text-xs font-bold text-gray-500 uppercase">Rescate</span>
                                <span className="font-bold text-gray-900">48 hs hábiles</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-100 flex gap-3">
                        <AlertTriangle className="size-5 text-yellow-600 flex-shrink-0" />
                        <p className="text-xs text-yellow-800 leading-snug">
                            <strong>Nota:</strong> Los rendimientos pasados no garantizan rendimientos futuros. La inversión está sujeta a riesgos de mercado.
                        </p>
                    </div>

                    <button
                        onClick={() => setStep("amount")}
                        className="w-full py-4 bg-[#3246ff] hover:bg-[#2635c2] text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                    >
                        Invertir ahora <ArrowRight className="size-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    // 2. AMOUNT STEP (Simulator)
    const renderAmount = () => {
        const MEP_RATE = 1240;
        const numericAmount = parseInt(amount || "0");
        const investedArs = selectedCurrency === "USD" ? numericAmount * MEP_RATE : numericAmount;

        return (
            <div className="p-8 h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setStep("intro")} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="size-6 text-gray-500" /></button>
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">PASO 1 DE 3</span>
                        <h2 className="text-lg font-black text-gray-900">Calculadora</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="size-6 text-gray-500" /></button>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Data Entry */}
                    <div className="flex-1 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col relative overflow-hidden">
                        {/* Decorative background blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

                        <div className="relative z-10 flex-1 flex flex-col">
                            {/* Balances Display */}
                            <div className="bg-gray-50 rounded-2xl p-5 mb-8 flex justify-between items-center border border-gray-100">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Saldo en ARS</p>
                                    <p className="text-lg font-black text-gray-900">$ {availableBalance.ars}</p>
                                </div>
                                <div className="w-px h-10 bg-gray-200 mx-4"></div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Saldo en USD</p>
                                    <p className="text-lg font-black text-gray-900">$ {availableBalance.usd}</p>
                                </div>
                            </div>

                            {/* Currency Selector */}
                            <div className="flex flex-col items-center mb-10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 text-center">Seleccionar moneda a invertir</p>
                                <div className="bg-gray-100 p-1.5 rounded-xl inline-flex gap-1">
                                    <button
                                        onClick={() => setSelectedCurrency("ARS")}
                                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${selectedCurrency === "ARS" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        ARS
                                    </button>
                                    <button
                                        onClick={() => setSelectedCurrency("USD")}
                                        className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${selectedCurrency === "USD" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        USD
                                    </button>
                                </div>
                            </div>

                            {/* Main Input */}
                            <div className="flex-1 flex flex-col justify-center items-center mb-8">
                                <label className="text-sm font-bold text-gray-500 mb-6 block">¿Cuánto querés invertir?</label>

                                <div className="relative w-full max-w-md flex justify-center items-baseline gap-2">
                                    <span className="text-4xl font-black text-gray-300 self-center mb-2">{selectedCurrency === "ARS" ? "$" : "u$s"}</span>
                                    <input
                                        type="text"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
                                        className="w-full text-center text-7xl font-black text-gray-900 bg-transparent border-none outline-none placeholder:text-gray-200"
                                        placeholder="0"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Info / Calculation Message */}
                            {selectedCurrency === "USD" && (
                                <div className="mt-auto bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                                    <div className="flex gap-3 items-start mb-4">
                                        <div className="p-2 bg-[#3246ff] rounded-lg text-white">
                                            <TrendingUp className="size-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-900 font-bold">Operatoria Dólar MEP</p>
                                            <p className="text-xs text-gray-600 leading-relaxed">
                                                Tus dólares se convertirán automáticamente a Pesos al tipo de cambio MEP para ingresar al fondo (Welfi Pesos).
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Conversión estimada</span>
                                            <span className="text-xs text-gray-500 font-medium">TC MEP: ${MEP_RATE}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-baseline justify-end gap-1">
                                                <span className="text-xl font-black text-gray-900">$ {investedArs.toLocaleString('es-AR')}</span>
                                                <span className="text-xs font-bold text-gray-400 uppercase">ARS</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Projection Card (Dark Mode) */}
                    <div className="w-full lg:w-[420px] bg-[#0f111a] text-white rounded-[2.5rem] p-8 shadow-2xl flex flex-col relative overflow-hidden ring-4 ring-gray-50">
                        {/* Background Gradients */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#3246ff] rounded-full blur-[100px] opacity-20 translate-x-1/3 -translate-y-1/3" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e5582f] rounded-full blur-[100px] opacity-10 -translate-x-1/3 translate-y-1/3" />

                        <div className="relative z-10 flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">TU PROYECCIÓN</h3>
                                <div className="bg-[#3246ff]/20 border border-[#3246ff]/30 rounded-lg px-2 py-1">
                                    <span className="text-[#3246ff] text-xs font-black">+6.25% TNA</span>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center items-center text-center">
                                <div className="mb-2">
                                    <span className="text-5xl font-black text-white tracking-tight">
                                        $ {(investedArs * 1.0625).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm font-medium">Tenencia estimada en 1 año (ARS)</p>
                            </div>

                            <div className="space-y-4 my-8 bg-white/5 rounded-2xl p-5 border border-white/5 backdrop-blur-md">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                        <span className="text-gray-300">Ganancia en 1 mes</span>
                                    </div>
                                    <span className="font-bold text-white">+ $ {(investedArs * 0.0625 / 12).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="w-full h-px bg-white/5" />
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                                        <span className="text-gray-300">Ganancia en 6 meses</span>
                                    </div>
                                    <span className="font-bold text-white">+ $ {(investedArs * 0.0625 / 2).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="w-full h-px bg-white/5" />
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                        <span className="text-gray-300">Ganancia en 1 año</span>
                                    </div>
                                    <span className="font-bold text-white">+ $ {(investedArs * 0.0625).toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
                                </div>
                            </div>

                            {/* Disclaimers */}
                            <div className="space-y-2 mb-6 text-[10px] text-gray-500">
                                <p className="flex gap-2">
                                    <span className="text-yellow-500">⚠️</span>
                                    Las proyecciones son estimadas y no representan una promesa de rentabilidad.
                                </p>
                                <p className="flex gap-2">
                                    <span className="text-blue-500">ℹ️</span>
                                    Podés suscribir y retirar en USD o ARS. La conversión se hace mediante dólar MEP.
                                </p>
                            </div>

                            <div className="mt-auto">
                                <button
                                    onClick={() => setStep("name")}
                                    disabled={!amount || parseInt(amount) === 0}
                                    className="group w-full py-4 bg-white text-[#0f111a] rounded-xl font-black text-lg hover:bg-gray-200 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/5"
                                >
                                    Continuar
                                    <ArrowRight className="size-5 text-[#0f111a] group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // 3. NAME STEP
    const renderName = () => (
        <div className="p-8 h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center relative">
            <button onClick={() => setStep("amount")} className="absolute top-8 left-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="size-6 text-gray-600" /></button>
            <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="size-6 text-gray-600" /></button>

            <h2 className="text-3xl font-black text-gray-900 mb-2">Elegí un nombre</h2>
            <p className="text-gray-500 mb-12">¡Gran nombre!</p>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100 w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 rounded-3xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-5xl shadow-inner cursor-pointer hover:scale-105 transition-transform">
                        {selectedEmoji}
                    </div>
                </div>

                <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Vacaciones 2025"
                    className="w-full text-center text-2xl font-bold text-gray-900 border-b-2 border-[#3246ff] pb-2 focus:outline-none placeholder:text-gray-300"
                    autoFocus
                />
            </div>

            <div className="mt-8 flex gap-2 flex-wrap justify-center max-w-md">
                {emojis.map(e => (
                    <button
                        key={e}
                        onClick={() => setSelectedEmoji(e)}
                        className={`text-2xl p-3 rounded-2xl hover:bg-gray-100 transition-colors ${selectedEmoji === e ? 'bg-blue-50 scale-110' : ''}`}
                    >
                        {e}
                    </button>
                ))}
            </div>

            <button
                onClick={() => setStep("confirm")}
                disabled={!customName}
                className="mt-12 w-full max-w-md py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold text-lg hover:bg-[#3246ff] hover:text-white transition-all disabled:opacity-50"
            >
                Siguiente
            </button>
        </div>
    );

    // 4. CONFIRMATION STEP
    const renderConfirm = () => {
        const MEP_RATE = 1240;
        const numericAmount = parseInt(amount || "0");
        const investedArs = selectedCurrency === "USD" ? numericAmount * MEP_RATE : numericAmount;

        return (
            <div className="p-8 h-full flex flex-col relative w-full items-center justify-center">
                <div className="absolute top-0 left-0 w-full flex justify-between p-8">
                    <button onClick={() => setStep("name")} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="size-6 text-gray-600" /></button>
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">CONFIRMACIÓN DE INVERSIÓN</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="size-6 text-gray-600" /></button>
                </div>

                <div className="w-full max-w-lg text-center">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">¿Estamos ok?</h2>
                    <p className="text-xl font-bold text-gray-600 mb-8">{customName || "Welfi Pesos"}</p>

                    <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm mb-6">
                        {selectedCurrency === "USD" ? (
                            <>
                                {/* Row 1: Vendes */}
                                <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl mb-3">
                                    <span className="text-gray-600 font-bold">Vendes</span>
                                    <span className="text-gray-900 font-black">USD {numericAmount}</span>
                                </div>

                                {/* Row 2: MEP Rate */}
                                <div className="flex justify-between items-center p-4 bg-blue-50/50 border border-blue-100 rounded-xl mb-3">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="size-4 text-[#3246ff]" />
                                        <span className="text-[#3246ff] font-bold text-sm">Dólar MEP (estimado)</span>
                                    </div>
                                    <span className="text-gray-900 font-bold">$ {MEP_RATE.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                </div>

                                {/* Row 3: Recibes */}
                                <div className="flex justify-between items-center p-4 border border-gray-100 rounded-xl mb-6">
                                    <span className="text-gray-600 font-bold">Recibes en ARS</span>
                                    <span className="text-gray-900 font-black">≈ $ {investedArs.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200 border-dashed mb-6" />

                                {/* Row 4: Final Investment */}
                                <div className="bg-blue-50/30 border border-blue-100 rounded-2xl p-6 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-700 font-bold">Monto a invertir</span>
                                        <span className="text-[#3246ff] font-black text-2xl">ARS {investedArs.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="border border-blue-100 bg-blue-50/50 rounded-2xl p-6 mb-6">
                                <p className="text-sm font-bold text-gray-600 mb-1">Monto a invertir</p>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-lg font-bold text-gray-900">ARS</span>
                                    <span className="text-3xl font-black text-[#3246ff]">{amount}</span>
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

                            {selectedCurrency === "USD" && (
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
                            Acepto <span className="text-[#3246ff] font-bold">términos y condiciones de Welfi</span> y el <span className="text-[#3246ff] font-bold">reglamento de gestión del fondo.</span>
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
    };

    // 5. SUCCESS STEP
    const renderSuccess = () => (
        <div className="p-8 h-full flex flex-col items-center justify-center text-center relative">
            <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="size-6 text-gray-600" /></button>

            <div className="mb-8">
                <img src={rocketImage.src} alt="Success" className="w-64 h-64 object-contain animate-bounce-slow" />
            </div>

            <div className="mb-8">
                <h2 className="text-4xl font-black text-gray-900 mb-2">¡Listo!</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-[#3246ff] to-[#e5582f] mx-auto rounded-full" />
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8 max-w-md">
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
                onClick={onClose}
                className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white font-bold text-lg hover:from-[#4856ff] hover:to-[#3246ff] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
                Ir al inicio <ArrowRight className="size-5" />
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`bg-white rounded-[2.5rem] shadow-2xl w-full max-h-[95vh] overflow-y-auto transition-all ${step === 'intro' ? 'max-w-6xl h-[85vh]' : "max-w-4xl h-[700px]"}`}>
                {step === "intro" && renderIntro()}
                {step === "amount" && renderAmount()}
                {step === "name" && renderName()}
                {step === "confirm" && renderConfirm()}
                {step === "success" && renderSuccess()}
            </div>
        </div>
    );
}
