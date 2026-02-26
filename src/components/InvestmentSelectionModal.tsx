import { X, ArrowRight, TrendingUp, Plus } from "lucide-react";

interface InvestmentOption {
    id: string;
    name: string;
    amount: string;
    currency: string;
    emoji: string;
    returnRate?: string;
}

interface InvestmentSelectionModalProps {
    title: string;
    investments: InvestmentOption[];
    onClose: () => void;
    onSelect: (investmentId: string) => void;
    onCreateNew?: () => void;
}

export function InvestmentSelectionModal({ title, investments, onClose, onSelect, onCreateNew }: InvestmentSelectionModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black text-gray-900">Sumar dinero</h2>
                            <p className="text-sm text-gray-600">Elegí a qué {title.toLowerCase()} querés sumar</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                            <X className="size-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Investment List */}
                    <div className="space-y-3">
                        {investments.map((inv) => (
                            <button
                                key={inv.id}
                                onClick={() => onSelect(inv.id)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#3246ff] hover:bg-blue-50/30 transition-all text-left group"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <span className="text-2xl">{inv.emoji}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 truncate group-hover:text-[#3246ff] transition-colors">
                                        {inv.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 font-medium">
                                            {inv.amount} {inv.currency}
                                        </span>
                                        {inv.returnRate && (
                                            <span className="text-xs text-[#0D9A68] bg-[#CEF2C5] px-1.5 py-0.5 rounded font-semibold flex items-center gap-0.5">
                                                <TrendingUp className="size-3" />
                                                {inv.returnRate}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#3246ff] group-hover:text-white transition-colors">
                                    <ArrowRight className="size-4" />
                                </div>
                            </button>
                        ))}

                        {/* Create New Option */}
                        {onCreateNew && (
                            <button
                                onClick={onCreateNew}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-[#3246ff]/30 hover:border-[#3246ff] hover:bg-blue-50 transition-all text-left group mt-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <Plus className="size-6 text-[#3246ff]" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-[#3246ff] truncate">
                                        Crear nuevo...
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Sumar un nuevo objetivo o pack
                                    </p>
                                </div>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
