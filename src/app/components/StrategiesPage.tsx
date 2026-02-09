import { X, TrendingUp, Filter, Info, ChevronRight, Shield, Zap, Target, Banknote } from "lucide-react";
import { useState } from "react";
import { StrategyDetail } from "./StrategyDetail";

interface StrategiesPageProps {
    onClose: () => void;
    onSelectStrategy: (strategyId: string) => void;
}

export function StrategiesPage({ onClose, onSelectStrategy }: StrategiesPageProps) {
    const [filter, setFilter] = useState<"todos" | "conservador" | "moderado" | "arriesgado">("todos");
    const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

    const allStrategies = [
        {
            id: "inflation_hedging",
            title: "Cobertura inflación",
            description: "Protegé el poder de compra de tus pesos.",
            risk: "conservador",
            currency: "ARS",
            rate: "CER +2%",
            icon: Shield,
            color: "from-blue-500 to-cyan-400"
        },
        {
            id: "conservative_growth",
            title: "Crecimiento Estabe",
            description: "Ideal para construir un fondo de reserva.",
            risk: "conservador",
            currency: "ARS",
            rate: "TNA 42%",
            icon: TrendingUp,
            color: "from-emerald-500 to-green-400"
        },
        {
            id: "long_term_growth",
            title: "Acciones Globales",
            description: "Invertí en las mejores empresas del mundo.",
            risk: "arriesgado",
            currency: "USD",
            rate: "+8-12% año",
            icon: Zap,
            color: "from-purple-600 to-indigo-500"
        },
        {
            id: "max_potential",
            title: "Innovación Tech",
            description: "Potencial alto con empresas tecnológicas.",
            risk: "arriesgado",
            currency: "USD",
            rate: "+15% año",
            icon: Zap,
            color: "from-fuchsia-600 to-pink-500"
        },
        {
            id: "fixed_income_usd",
            title: "Renta Fija USD",
            description: "Generá intereses mensuales en dólares.",
            risk: "moderado",
            currency: "USD",
            rate: "5.5% año",
            icon: Banknote,
            color: "from-amber-500 to-orange-400"
        },
        {
            id: "usd_inflation_hedging",
            title: "Reserva de Valor",
            description: "Oro y activos refugio para tus ahorros.",
            risk: "moderado",
            currency: "USD",
            rate: "3-4% año",
            icon: Shield,
            color: "from-yellow-500 to-amber-300"
        }
    ];

    const strategyData = allStrategies.find(s => s.id === selectedStrategy);

    if (selectedStrategy && strategyData) {
        return (
            <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                <div className="bg-[#f8f9fc] rounded-[2rem] shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col relative border border-white/50">
                    <StrategyDetail
                        strategy={strategyData}
                        onBack={() => setSelectedStrategy(null)}
                        onConfirmSelection={(id) => onSelectStrategy(id)}
                    />
                </div>
            </div>
        );
    }

    const filteredStrategies = filter === "todos"
        ? allStrategies
        : allStrategies.filter(s => s.risk === filter);

    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-[#f8f9fc] rounded-[2rem] shadow-2xl w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col relative border border-white/50">

                {/* Header Background */}
                <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-[#1e293b] to-[#0f172a] -z-0" />

                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">

                    {/* Header */}
                    <div className="p-8 md:p-10 flex justify-between items-start text-white">
                        <div>
                            <div className="flex items-center gap-2 mb-2 opacity-80">
                                <Target className="size-5 text-[#3246ff]" />
                                <span className="font-bold tracking-wider text-xs uppercase">Mercado de Estrategias</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                                Elegí tu próximo objetivo
                            </h1>
                            <p className="text-gray-400 text-lg max-w-xl">
                                Carteras diseñadas por expertos para potenciar tus ahorros según tu perfil y horizonte.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors backdrop-blur-md border border-white/10"
                        >
                            <X className="size-6 text-white" />
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="px-8 md:px-10 pb-6 flex items-center gap-4 overflow-x-auto no-scrollbar">
                        {(["todos", "conservador", "moderado", "arriesgado"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${filter === f
                                        ? "bg-white text-gray-900 border-white shadow-lg scale-105"
                                        : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10"
                                    } capitalization whitespace-nowrap`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Grid Area */}
                    <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-[#f8f9fc] rounded-t-[2.5rem] mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {filteredStrategies.map((strategy) => (
                                <button
                                    key={strategy.id}
                                    onClick={() => setSelectedStrategy(strategy.id)}
                                    className="group bg-white p-6 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-[#3246ff]/10 transition-all duration-300 border border-gray-100 hover:border-[#3246ff]/30 hover:-translate-y-1 text-left flex flex-col h-full relative overflow-hidden"
                                >
                                    {/* Gradient Hover Accent */}
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${strategy.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                                    <div className="flex justify-between items-start mb-6 w-full">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${strategy.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                                            <strategy.icon className="size-7 text-white" />
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            {/* Currency Badge */}
                                            <div className="bg-gray-100/80 text-gray-600 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider mb-1">
                                                {strategy.currency}
                                            </div>

                                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                                <TrendingUp className="size-3" />
                                                {strategy.rate}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 w-full">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#3246ff] transition-colors">
                                            {strategy.title}
                                        </h3>
                                        <p className="text-gray-500 font-medium leading-relaxed">
                                            {strategy.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${strategy.risk === 'conservador' ? 'bg-green-500' :
                                                    strategy.risk === 'moderado' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`} />
                                            <span className="text-sm font-semibold text-gray-600 capitalize">{strategy.risk}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#3246ff] font-bold text-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                            Ver detalle <ChevronRight className="size-4" />
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
