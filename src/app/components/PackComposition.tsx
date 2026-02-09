import { ArrowLeft, Minus, Plus, Info } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { PackPurchaseFlow } from "./PackPurchaseFlow";

interface Pack {
    id: string;
    name: string;
    pricePerPack: string; // "94.000"
    logos: string[];
}

interface PackCompositionProps {
    pack: Pack;
    onBack: () => void;
    availableBalance: { ars: string; usd: string };
}

export function PackComposition({ pack, onBack, availableBalance }: PackCompositionProps) {
    const [quantity, setQuantity] = useState(1);
    const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);

    // Parse price to number for calculation
    const priceNumber = parseInt(pack.pricePerPack.replace(/\./g, ""));
    const totalPrice = priceNumber * quantity;

    // Hardcoded composition data based on screenshots
    // Ideally this would come from the pack prop or an API
    const compositionData = [
        { name: "Spotify", value: 19, color: "#aadd99", amount: "16.500" },
        { name: "Meta", value: 18, color: "#a08040", amount: "15.000" },
        { name: "Netflix", value: 11, color: "#4566aa", amount: "12.500" },
        { name: "Alphabet", value: 28, color: "#ddcc44", amount: "31.000" },
        { name: "Shopify", value: 17, color: "#caaadd", amount: "19.000" },
    ];

    if (showPurchaseFlow) {
        return (
            <PackPurchaseFlow
                pack={pack}
                quantity={quantity}
                totalPrice={totalPrice}
                onBack={() => setShowPurchaseFlow(false)}
                onClose={() => {
                    // Close all the way back to list or home?
                    // For now let's just reload to reset or user can navigate back
                    window.location.reload();
                }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 sticky top-0 z-10">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="size-5 text-gray-700" />
                    </button>

                    <div className="text-right">
                        <p className="text-xs text-gray-500">Dinero disponible</p>
                        <p className="font-bold text-gray-900">U$D {availableBalance.usd}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-xl mx-auto w-full p-6 pb-32 overflow-y-auto">
                <h2 className="text-xl font-bold text-center text-gray-900 mb-8">Composición de mi portfolio</h2>

                {/* Donut Chart */}
                <div className="h-48 mb-8 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={compositionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                cornerRadius={4}
                            >
                                {compositionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* List of assets */}
                <div className="space-y-4 mb-8">
                    {compositionData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="font-medium text-gray-700">{item.name}</span>
                            </div>
                            <div className="flex gap-8">
                                <span className="font-medium text-gray-900 w-12 text-right">{item.value}%</span>
                                <span className="font-bold text-gray-900 w-20 text-right">${item.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600">Precio total del pack</span>
                        <span className="text-xl font-black text-gray-900">${pack.pricePerPack}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex items-center justify-between mb-8">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 bg-[#3246ff] rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            <Minus className="size-6" />
                        </button>
                        <span className="text-2xl font-black text-gray-900">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 bg-[#3246ff] rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            <Plus className="size-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Button */}
            <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-xl mx-auto">
                    <button
                        onClick={() => setShowPurchaseFlow(true)}
                        className="w-full py-4 rounded-xl bg-[#3246ff] text-white font-bold text-lg shadow-lg hover:bg-[#2635c2] transition-colors"
                    >
                        Invertir en este pack ({quantity})
                    </button>
                </div>
            </div>
        </div>
    );
}
