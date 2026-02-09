import { useState } from "react";
import { ArrowLeft, TrendingUp, Info, HelpCircle, AlertCircle, Clock, CheckCircle2, PieChart } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { StrategyProjection } from "./StrategyProjection";

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

interface StrategyDetailProps {
    strategy: Strategy;
    onBack: () => void;
    onConfirmSelection: (strategyId: string) => void;
}

// Mock historical data
const generateHistoricalData = () => {
    const data = [];
    let val = 1000;
    for (let i = 0; i < 12; i++) {
        val = val * (1 + (Math.random() * 0.05));
        data.push({ month: i, value: val });
    }
    return data;
};

export function StrategyDetail({ strategy, onBack, onConfirmSelection }: StrategyDetailProps) {
    const [view, setView] = useState<"detail" | "projection">("detail");
    const [activeTab, setActiveTab] = useState<"info" | "composition">("info");
    const historicalData = generateHistoricalData();

    if (view === "projection") {
        return (
            <StrategyProjection
                strategy={strategy}
                onBack={() => setView("detail")}
                onCreate={(amount, name) => onConfirmSelection(strategy.id)}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#f8f9fc]">
            {/* Header / Chart Section */}
            <div className="relative bg-white pt-8 pb-12 px-6 md:px-12 rounded-b-[3rem] shadow-sm z-10">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={onBack}
                        className="mb-6 p-2 hover:bg-gray-100 rounded-full transition-colors absolute top-6 left-6 md:left-12"
                    >
                        <ArrowLeft className="size-6 text-gray-500" />
                    </button>

                    <div className="text-center mb-8 mt-4">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">{strategy.title}</h1>
                        <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                            {strategy.description}
                        </p>
                    </div>

                    <div className="flex flex-col items-center mb-8">
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">¿Cómo viene rindiendo?</p>
                        <div className={`bg-${strategy.risk === 'conservador' ? 'green' : 'blue'}-50 text-${strategy.risk === 'conservador' ? 'green' : 'blue'}-600 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-1.5`}>
                            <TrendingUp className="size-4" />
                            {strategy.rate} Último año
                        </div>
                    </div>

                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={historicalData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3246ff" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#3246ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3246ff"
                                    strokeWidth={3}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Time frame selector mockup */}
                    <div className="flex justify-center gap-2 mt-6">
                        {['1M', '6M', 'Este año', '12M', '3A'].map((period) => (
                            <button
                                key={period}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${period === '1M'
                                        ? 'bg-[#3246ff] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Info Box Reminder */}
            <div className="max-w-4xl mx-auto w-full px-6 mt-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                    <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                        Esta es una idea de como arrancar, podés modificarlo como quieras.
                        <span className="font-bold underline ml-1 cursor-pointer">Ver más</span>
                    </p>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex-1 overflow-y-auto mt-6 px-6 pb-24">
                <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-100 mb-8">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`flex-1 pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === "info"
                                    ? "border-[#3246ff] text-[#3246ff]"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Información
                        </button>
                        <button
                            onClick={() => setActiveTab("composition")}
                            className={`flex-1 pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === "composition"
                                    ? "border-[#3246ff] text-[#3246ff]"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            Composición
                        </button>
                    </div>

                    {/* Content */}
                    {activeTab === "info" ? (
                        <div className="space-y-8">
                            {/* Moneda */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Moneda <HelpCircle className="size-3 text-gray-400" />
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">💵</div>
                                            Estrategia en
                                        </div>
                                        <span className="font-bold text-gray-900">{strategy.currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">📥</div>
                                            Ingresás en
                                        </div>
                                        <span className="font-bold text-gray-900">{strategy.currency}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">📤</div>
                                            Retirás en
                                        </div>
                                        <span className="font-bold text-gray-900">{strategy.currency}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Rentabilidad */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Rentabilidad <HelpCircle className="size-3 text-gray-400" />
                                </h3>
                                <div className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">📈</div>
                                        Rentabilidad esperada anual
                                    </div>
                                    <span className="font-bold text-gray-900">{strategy.rate}</span>
                                </div>
                            </div>

                            {/* Riesgo */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Riesgo <HelpCircle className="size-3 text-gray-400" />
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">⚡</div>
                                            Volatilidad
                                        </div>
                                        <span className="font-bold text-gray-900">Media</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">🛡️</div>
                                            Riesgo
                                        </div>
                                        <span className="font-bold text-gray-900 capitalize">{strategy.risk}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Plazo */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    Plazo de inversión y retiro <HelpCircle className="size-3 text-gray-400" />
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">🔓</div>
                                            Retirá
                                        </div>
                                        <span className="font-bold text-gray-900">Cuando querés</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">⏱️</div>
                                            Acreditación
                                        </div>
                                        <span className="font-bold text-gray-900">48hs habiles</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">📅</div>
                                            Plazo mínimo sugerido
                                        </div>
                                        <span className="font-bold text-gray-900">3 meses</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="flex flex-col items-center py-8">
                            {/* Mock Composition Chart */}
                            <div className="relative w-48 h-48 mb-8">
                                <div className="absolute inset-0 rounded-full border-[16px] border-[#3246ff] border-t-gray-100 rotate-45 transform transition-all" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <PieChart className="size-8 text-gray-300" />
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="flex items-center justify-between p-4 border rounded-xl hover:border-[#3246ff] hover:shadow-md transition-all cursor-pointer group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <span className="text-xs font-bold text-gray-500">FCI</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-[#3246ff] transition-colors">{strategy.title} Fund</p>
                                            <p className="text-xs text-gray-500">Adcap Asset Management</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-gray-900">100%</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Floating Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => setView("projection")}
                        className="w-full py-4 bg-[#3246ff] hover:bg-[#2838d9] text-white rounded-2xl font-bold custom-shadow transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
                    >
                        Proyectá tu inversión <ArrowLeft className="size-5 rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
}
