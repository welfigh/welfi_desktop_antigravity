import { X, ArrowRight, Shield, TrendingUp, PiggyBank, Target, Package } from "lucide-react";

interface ProductSelectorProps {
    onClose: () => void;
    onSelectProduct: (productType: string) => void;
}

export function ProductSelector({ onClose, onSelectProduct }: ProductSelectorProps) {
    const products = [
        {
            id: "welfi_pesos",
            emoji: "💰",
            icon: TrendingUp,
            name: "Welfi Pesos",
            description: "Hacé rendir tu liquidez diaria. Dinero disponible siempre.",
            color: "bg-blue-50 text-blue-600",
            gradient: "from-blue-500 to-indigo-600"
        },
        {
            id: "emergency_fund",
            emoji: "🛡️",
            icon: Shield,
            name: "Fondo de Emergencia",
            description: "Tu respaldo ante imprevistos. Seguridad y tranquilidad.",
            color: "bg-purple-50 text-purple-600",
            gradient: "from-purple-500 to-pink-600"
        },
        {
            id: "retirement_fund",
            emoji: "🌱",
            icon: PiggyBank,
            name: "Fondo de Retiro",
            description: "Invertí en tu futuro y asegurá tu retiro.",
            color: "bg-green-50 text-green-600",
            gradient: "from-green-500 to-emerald-600"
        },
        {
            id: "strategies",
            emoji: "🎯",
            icon: Target,
            name: "Objetivo Personal",
            description: "Ahorrá para una meta específica: viaje, auto, casa.",
            color: "bg-orange-50 text-orange-600",
            gradient: "from-orange-500 to-red-600"
        },
        {
            id: "packs",
            emoji: "📦",
            icon: Package,
            name: "Packs Temáticos",
            description: "Inversiones diversificadas en un solo click.",
            color: "bg-indigo-50 text-indigo-600",
            gradient: "from-indigo-500 to-violet-600"
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">Nueva Inversión</h2>
                            <p className="text-gray-600">Elegí el producto ideal para tus objetivos</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                            <X className="size-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {products.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => onSelectProduct(product.id)}
                                className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-[#3246ff] hover:bg-blue-50/30 transition-all text-left"
                            >
                                <div className={`w-16 h-16 rounded-2xl ${product.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    <product.icon className="size-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#3246ff] transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {product.description}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#3246ff] group-hover:text-white transition-colors">
                                    <ArrowRight className="size-5" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
