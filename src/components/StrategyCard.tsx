import { TrendingUp, AlertTriangle, Banknote, DollarSign } from "lucide-react";

interface StrategyCardProps {
    title: string;
    description: string;
    riskLevel: number; // 1 to 5
    currency: "ARS" | "USD" | "Mixto";
    rate: string;
    onClick: () => void;
}

export function StrategyCard({ title, description, riskLevel, currency, rate, onClick }: StrategyCardProps) {
    const renderRisk = () => {
        // Simple logic for peppers/fire icon based on risk
        return (
            <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-xs font-bold">
                <div className="flex">
                    {[...Array(riskLevel)].map((_, i) => (
                        <span key={i}>🌶️</span>
                    ))}
                    {[...Array(5 - riskLevel)].map((_, i) => (
                        <span key={i} className="opacity-30">🌶️</span>
                    ))}
                </div>
            </div>
        );
    };

    const renderCurrency = () => {
        let icon = <Banknote className="size-3" />;
        let text = currency;
        let color = "bg-blue-50 text-blue-600";

        if (currency === "USD") {
            icon = <DollarSign className="size-3" />;
            color = "bg-green-50 text-green-600";
        } else if (currency === "Mixto") {
            icon = <div className="flex"><Banknote className="size-3" /><DollarSign className="size-3 -ml-1" /></div>;
            color = "bg-purple-50 text-purple-600";
        }

        return (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${color}`}>
                {icon}
                <span>{text}</span>
            </div>
        );
    };

    return (
        <button
            onClick={onClick}
            className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-left flex flex-col h-full group"
        >
            <div className="flex-1 mb-4">
                <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-[#3246ff] transition-colors">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
                {renderRisk()}
                {renderCurrency()}
                <div className="flex items-center gap-1 bg-gray-50 text-gray-700 px-2 py-1 rounded-lg text-xs font-bold">
                    <TrendingUp className="size-3" />
                    <span>{rate}</span>
                </div>
            </div>
        </button>
    );
}
