import { ArrowLeft, ChevronRight, TrendingUp } from "lucide-react";
import { useState } from "react";
import { PackDetail } from "./PackDetail";

interface Pack {
    id: string;
    name: string;
    pricePerPack: string;
    performance: string;
    logos: string[];
    color: string;
}

interface ThematicPacksPageProps {
    onBack: () => void;
    availableBalance: { ars: string; usd: string };
}

export function ThematicPacksPage({ onBack, availableBalance }: ThematicPacksPageProps) {
    const [selectedPack, setSelectedPack] = useState<Pack | null>(null);

    const packs: Pack[] = [
        {
            id: "ai",
            name: "Inteligencia Artificial",
            pricePerPack: "101.000",
            performance: "+124%",
            logos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"], // Placeholders, will need actual assets or lucide icons/text
            color: "bg-green-100",
        },
        {
            id: "internet",
            name: "Revolución de Internet",
            pricePerPack: "168.830",
            performance: "+82%",
            logos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png", "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png"],
            color: "bg-blue-100",
        },
        {
            id: "ecommerce",
            name: "Ecommerce & Fintech",
            pricePerPack: "94.000",
            performance: "+54%",
            logos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/1200px-McDonald%27s_Golden_Arches.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png"],
            color: "bg-purple-100",
        },
        {
            id: "value",
            name: "Empresas de Valor",
            pricePerPack: "169.000",
            pricePerPack: "169.000",
            performance: "+32%",
            logos: ["https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png", "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png"],
            color: "bg-orange-100",
        }
    ];

    if (selectedPack) {
        return (
            <PackDetail
                pack={selectedPack}
                onBack={() => setSelectedPack(null)}
                availableBalance={availableBalance}
            />
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-gray-50 overflow-y-auto">
            {/* Header */}
            <div className="bg-white p-6 sticky top-0 z-10 border-b border-gray-100">
                <div className="max-w-xl mx-auto flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                        <ArrowLeft className="size-5 text-gray-700" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">Packs temáticos</h1>
                </div>
            </div>

            <div className="max-w-xl mx-auto p-6 space-y-4">
                {packs.map((pack) => (
                    <div
                        key={pack.id}
                        onClick={() => setSelectedPack(pack)}
                        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-gray-900 text-lg">{pack.name}</h3>
                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${parseInt(pack.performance) > 50 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {pack.performance}
                            </span>
                        </div>

                        <div className="flex items-end justify-between">
                            {/* Logos overlapping */}
                            <div className="flex -space-x-3 items-center">
                                {pack.logos.map((logo, index) => (
                                    <div key={index} className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center overflow-hidden relative z-10">
                                        {/* Using simple colored circles with text for now as placeholders if images fail, but trying images */}
                                        <img src={logo} alt="brand" className="w-full h-full object-cover" onError={(e) => {
                                            // Fallback if image fails
                                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${index}&background=random`
                                        }} />
                                    </div>
                                ))}
                                {/* More indicator */}
                                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500 relative z-20">
                                    +2
                                </div>
                            </div>

                            <div className="text-right">
                                <p className="text-sm text-gray-500 mb-0.5">Precio pack</p>
                                <div className="flex items-center gap-1 justify-end">
                                    <span className="font-black text-gray-900 text-lg">${pack.pricePerPack}</span>
                                    <span className="text-xs text-gray-500 font-semibold">ARS / pack</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
