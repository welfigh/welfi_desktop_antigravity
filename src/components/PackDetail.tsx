import { ArrowLeft, Info } from "lucide-react";
import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { PackComposition } from "./PackComposition";

interface Pack {
    id: string;
    name: string;
    pricePerPack: string;
    performance: string;
    logos: string[];
    color: string;
}

interface PackDetailProps {
    pack: Pack;
    onBack: () => void;
    availableBalance: { ars: string; usd: string };
}

export function PackDetail({ pack, onBack, availableBalance }: PackDetailProps) {
    const [showComposition, setShowComposition] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("YTD");

    // Mock data for the chart - based on the "113k" screenshot
    const data = [
        { name: "Ene", value: 45000 },
        { name: "Feb", value: 52000 },
        { name: "Mar", value: 49000 },
        { name: "Abr", value: 63000 },
        { name: "May", value: 58000 },
        { name: "Jun", value: 85000 },
        { name: "Jul", value: 72000 },
        { name: "Ago", value: 95000 },
        { name: "Sep", value: 105000 },
        { name: "Oct", value: 98000 },
        { name: "Nov", value: 113000 }, // Current peak
        { name: "Dic", value: 125000 },
    ];

    if (showComposition) {
        return (
            <PackComposition
                pack={pack}
                onBack={() => setShowComposition(false)}
                availableBalance={availableBalance}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10">
                <div className="max-w-xl mx-auto flex items-center relative">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors absolute left-0"
                    >
                        <ArrowLeft className="size-5 text-gray-700" />
                    </button>

                    <div className="w-full text-center">
                        <h1 className="text-lg font-bold text-gray-900">{pack.name}</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-xl mx-auto w-full p-6 pb-24 overflow-y-auto">
                {/* Logos */}
                <div className="flex justify-center -space-x-4 mb-6">
                    {pack.logos.map((logo, index) => (
                        <div key={index} className="w-14 h-14 rounded-full bg-white border-4 border-gray-50 shadow-sm flex items-center justify-center overflow-hidden z-10">
                            <img src={logo} alt="brand" className="w-full h-full object-cover" onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${index}&background=random`
                            }} />
                        </div>
                    ))}
                </div>

                {/* Description */}
                <p className="text-center text-gray-500 text-sm mb-8 px-4">
                    Empresas que buscan incluir y digitalizar a miles de personas al rededor del mundo.
                </p>

                {/* Chart Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-gray-900 mb-1">113 k</h2>
                        <p className="text-sm text-gray-500 font-medium">22/03/2023</p>
                    </div>

                    <div className="h-64 mb-6 relative">
                        {/* Dashed vertical line indicator (static for now) */}
                        <div className="absolute top-0 bottom-8 left-1/2 w-0.5 border-l-2 border-dashed border-orange-300 z-0"></div>
                        <div className="absolute  top-[60%] left-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white transform -translate-x-1.5 -translate-y-1.5 z-10 shadow-sm"></div>

                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3246ff" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3246ff" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f3f4f6" />
                                <YAxis
                                    orientation="right"
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value / 1000}k`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3246ff"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Timeframe Selector */}
                    <div className="flex justify-between px-2">
                        {["5A", "1A", "YTD", "1M"].map((period) => (
                            <button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors ${selectedPeriod === period
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Button */}
            <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
                <div className="max-w-xl mx-auto">
                    <button
                        onClick={() => setShowComposition(true)}
                        className="w-full py-4 rounded-xl bg-[#3246ff] text-white font-bold text-lg shadow-lg hover:bg-[#2635c2] transition-colors"
                    >
                        Invertir en este pack
                    </button>
                </div>
            </div>
        </div>
    );
}
