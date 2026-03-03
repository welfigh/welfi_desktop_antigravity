import { TrendingUp, TrendingDown, Plus, ChevronRight, Sparkles } from "lucide-react";

interface InvestmentCardProps {
  title: string;
  amount: string;
  currency: string;
  returnRate: string;
  isPositive?: boolean;
  icons?: string[];
  objectivesCount?: number;
  objectivesLabel?: string;
  size?: "default" | "large";
  onCreateNew?: () => void;
  isEmpty?: boolean;
  onViewAll?: () => void;
  onAddMoney?: () => void;
}

export function InvestmentCard({
  title,
  amount,
  currency,
  returnRate,
  isPositive,
  objectivesCount,
  objectivesLabel,
  onCreateNew,
  isEmpty,
  onViewAll,
  onAddMoney,
}: InvestmentCardProps) {

  // Empty state
  if (isEmpty && onCreateNew) {
    return (
      <button
        onClick={onCreateNew}
        className="group bg-white rounded-2xl border border-dashed border-gray-200 hover:border-[#3246ff]/40 hover:bg-blue-50/30 transition-all p-4 flex flex-col items-center justify-center min-h-[140px] w-full"
      >
        <div className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-[#3246ff]/10 flex items-center justify-center mb-2 transition-colors">
          <Plus className="size-4 text-gray-400 group-hover:text-[#3246ff] transition-colors" />
        </div>
        <p className="text-gray-400 text-xs font-medium group-hover:text-[#3246ff] transition-colors text-center">{title}</p>
        <p className="text-gray-300 text-[10px] mt-0.5">Crear primera inversión</p>
      </button>
    );
  }

  const isUnused = !isEmpty && amount.includes("0,00");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all">
      {/* Card header */}
      <button
        onClick={onViewAll}
        className="w-full flex items-center justify-between px-4 pt-4 pb-2 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
            <Sparkles className="size-3.5 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-900 text-xs font-semibold leading-tight">{title}</p>
            {objectivesCount !== undefined && (
              <p className="text-gray-400 text-[10px]">
                {objectivesCount} {objectivesLabel || "objetivos"}
              </p>
            )}
          </div>
        </div>
        <ChevronRight className="size-3.5 text-gray-300" />
      </button>

      {/* Amount */}
      <div className="px-4 pb-1">
        <p className={`text-base font-bold ${isUnused ? "text-gray-300" : "text-gray-900"} tracking-tight`}>
          {amount}
          <span className="text-[10px] font-normal text-gray-400 ml-1">{currency}</span>
        </p>
      </div>

      {/* Return rate */}
      <div className="px-4 pb-3">
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${isPositive !== false
            ? "bg-emerald-50 text-emerald-600"
            : "bg-red-50 text-red-500"
          }`}>
          {isPositive !== false
            ? <TrendingUp className="size-2.5" />
            : <TrendingDown className="size-2.5" />
          }
          {returnRate}
        </span>
      </div>

      {/* Add money button */}
      {onAddMoney && (
        <div className="px-3 pb-3">
          <button
            onClick={(e) => { e.stopPropagation(); onAddMoney(); }}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 hover:bg-[#3246ff] hover:text-white text-gray-500 text-xs font-medium transition-all group"
          >
            <Plus className="size-3.5" />
            Sumar dinero
          </button>
        </div>
      )}
    </div>
  );
}