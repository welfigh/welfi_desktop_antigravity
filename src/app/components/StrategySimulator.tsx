import { useState, useMemo } from "react";
import { ArrowLeft, TrendingUp, DollarSign, Calendar, Check, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

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

interface StrategySimulatorProps {
    strategy: Strategy;
    onBack: () => void;
    onCreate: (amount: string, goalName: string) => void;
}

export function StrategySimulator({ strategy, onBack, onCreate }: StrategySimulatorProps) {
    const [amount, setAmount] = useState("100000");
    const [monthlyContribution, setMonthlyContribution] = useState("20000");
    const [goalName, setGoalName] = useState(strategy.title);
    const [duration, setDuration] = useState(12); // months

    // Helper to parse rate string to number (very rough approximation for demo)
    const annualRate = useMemo(() => {
        if (strategy.rate.includes("CER")) return 0.50; // Inflación aprox
        if (strategy.rate.includes("42%")) return 0.42;
        if (strategy.rate.includes("+13%")) return 0.13;
        if (strategy.rate.includes("+8-12%")) return 0.10;
        if (strategy.rate.includes("5.5%")) return 0.055;
        if (strategy.rate.includes("3-4%")) return 0.035;
        return 0.10; // default
    }, [strategy.rate]);

    // Generate Chart Data
    const data = useMemo(() => {
        const dataPoints = [];
        let currentBalance = parseFloat(amount) || 0;
        let investedCapital = parseFloat(amount) || 0;
        const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
        const contribution = parseFloat(monthlyContribution) || 0;

        for (let i = 0; i <= duration; i++) {
            dataPoints.push({
                month: `Mes ${i}`,
                balance: Math.round(currentBalance),
                capital: Math.round(investedCapital),
            });
            currentBalance = currentBalance * (1 + monthlyRate) + contribution;
            investedCapital += contribution;
        }
        return dataPoints;
    }, [amount, monthlyContribution, annualRate, duration]);

    const finalBalance = data[data.length - 1].balance;
    const totalInvested = data[data.length - 1].capital;
    const profit = finalBalance - totalInvested;

    return (
        <div className="flex flex-col h-full bg-[#f8f9fc]">
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${strategy.color} text-white shadow-lg`}>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 font-medium"
                >
                    <ArrowLeft className="size-5" /> Volver a estrategias
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                        <strategy.icon className="size-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black">{strategy.title}</h1>
                        <p className="text-white/90 font-medium opacity-90">{strategy.description}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">

                    {/* Simulator Controls */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600`}>1</span>
                                Configurar Objetivo
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de tu objetivo</label>
                                    <input
                                        type="text"
                                        value={goalName}
                                        onChange={(e) => setGoalName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3246ff] focus:outline-none transition-all font-medium text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Inversión inicial ({strategy.currency})</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <DollarSign className="size-5" />
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3246ff] focus:outline-none transition-all font-bold text-xl text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Aporte mensual estimado</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Calendar className="size-5" />
                                        </div>
                                        <input
                                            type="number"
                                            value={monthlyContribution}
                                            onChange={(e) => setMonthlyContribution(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3246ff] focus:outline-none transition-all font-bold text-xl text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Proyectar a: <span className="text-[#3246ff] font-bold">{duration} meses</span></label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3246ff]"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                                        <span>1 mes</span>
                                        <span>5 años</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                            <h3 className="text-[#3246ff] font-bold mb-2 flex items-center gap-2">
                                <Info className="size-5" />
                                Este fondo invierte en:
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-900/80">
                                <li className="flex items-start gap-2">
                                    <Check className="size-4 mt-0.5" />
                                    <span>Activos diversificados para reducir riesgo.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="size-4 mt-0.5" />
                                    <span>Rebalanceo automático mensual.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="size-4 mt-0.5" />
                                    <span>Liquidez en 48hs hábiles.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Chart and Result */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <p className="text-gray-500 font-medium mb-1">Resultado proyectado</p>
                                    <h3 className="text-4xl font-black text-gray-900">
                                        $ {finalBalance.toLocaleString()} <span className="text-lg text-gray-500 font-bold">{strategy.currency}</span>
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500 font-medium mb-1">Ganancia estimada</p>
                                    <h3 className="text-2xl font-bold text-[#0D9A68]">
                                        + $ {profit.toLocaleString()}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex-1 min-h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3246ff" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#3246ff" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis dataKey="month" hide />
                                        <YAxis orientation="right" tickFormatter={(value) => `$${value / 1000}k`} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number) => [`$ ${value.toLocaleString()}`, '']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="balance"
                                            stroke="#3246ff"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorBalance)"
                                            name="Proyección"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="capital"
                                            stroke="#9ca3af"
                                            strokeDasharray="5 5"
                                            strokeWidth={2}
                                            dot={false}
                                            name="Tu capital"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={() => onCreate(amount, goalName)}
                                    className={`px-8 py-4 bg-gradient-to-r ${strategy.color} text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2`}
                                >
                                    Confirmar y Crear Objetivo <Check className="size-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
