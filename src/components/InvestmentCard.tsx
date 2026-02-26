import { TrendingUp, Plus, Eye, Sparkles, Info } from "lucide-react";
import { useState } from "react";

interface InvestmentCardProps {
  title: string;
  amount: string;
  currency: string;
  returnRate: string;
  icons?: string[];
  objectivesCount?: number;
  objectivesLabel?: string; // Custom label for count (e.g., "packs", "fondos")
  size?: "default" | "large";
  onCreateNew?: () => void;
  isEmpty?: boolean;
  onViewAll?: () => void; // Nueva prop para ir a "Todas mis inversiones"
  onAddMoney?: () => void; // Nueva prop para sumar dinero
}

export function InvestmentCard({
  title,
  amount,
  currency,
  returnRate,
  icons = [],
  objectivesCount,
  objectivesLabel,
  size = "default",
  onCreateNew,
  isEmpty,
  onViewAll,
  onAddMoney
}: InvestmentCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Empty state - toda la card es clickeable
  if (isEmpty && onCreateNew) {
    return (
      <button
        onClick={onCreateNew}
        className="group relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-4 flex flex-col items-center justify-center h-full border-2 border-dashed border-[#3246ff]/30 hover:border-[#3246ff] hover:-translate-y-1 hover:scale-[1.01] overflow-hidden"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3246ff]/5 via-transparent to-[#e5582f]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          {/* Product name - prominent */}
          <div className="mb-2">
            <p className="text-[#3246ff] text-xs font-bold uppercase tracking-wide">{title}</p>
          </div>

          {/* Icon container */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3246ff] to-[#4856ff] flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-[#3246ff]/40 transition-all group-hover:scale-110">
              <Sparkles className="size-6 text-white animate-pulse" />
            </div>
            {/* Decorative rings */}
            <div className="absolute -inset-1.5 border-2 border-[#3246ff]/20 rounded-xl group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute -inset-3 border border-[#3246ff]/10 rounded-xl group-hover:scale-150 transition-transform duration-700" />
          </div>

          {/* Text */}
          <div className="text-center space-y-1">
            <h3 className="text-sm font-black text-gray-900 group-hover:text-[#3246ff] transition-colors">
              Creá tu primera inversión
            </h3>
            <p className="text-gray-600 text-xs max-w-[200px] mx-auto">
              Empezá hoy a construir tu futuro financiero
            </p>
          </div>

          {/* CTA Badge */}
          <div className="mt-1 px-3 py-1.5 bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white rounded-full text-xs font-bold flex items-center gap-1.5 group-hover:gap-2 transition-all shadow-md group-hover:shadow-lg">
            <Plus className="size-4" />
            <span>Comenzar ahora</span>
          </div>
        </div>
      </button>
    );
  }

  // Normal state with data - toda la card clickeable si tiene inversiones
  return (
    <button
      onClick={onViewAll}
      className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-3 flex flex-col justify-between h-full border border-gray-100 hover:border-[#3246ff]/20 hover:-translate-y-1 w-full text-left cursor-pointer"
    >

      <div className="flex-1 flex flex-col justify-center my-2">
        {/* Product name - PROMINENT with gradient and animation */}
        <div className="mb-3 relative">
          <h3 className="text-sm font-black text-center bg-gradient-to-r from-[#3246ff] via-[#4856ff] to-[#3246ff] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] group-hover:scale-105 transition-transform duration-300">
            {title}
          </h3>
          {/* Decorative underline */}
          <div className="mt-1 h-0.5 w-10 mx-auto bg-gradient-to-r from-transparent via-[#3246ff] to-transparent rounded-full opacity-50 group-hover:opacity-100 group-hover:w-16 transition-all duration-300" />
        </div>

        {/* Total invertido with objectives count */}
        {objectivesCount !== undefined ? (
          <p className="text-gray-400 text-xs mb-2 text-center font-medium">
            Total invertido en {objectivesCount} {objectivesLabel || (objectivesCount === 1 ? 'objetivo' : 'objetivos')}
          </p>
        ) : (
          <p className="text-gray-400 text-xs mb-2 text-center font-medium">Total invertido</p>
        )}

        {/* Amount with return rate */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-baseline justify-center gap-2">
            <p className="text-lg font-black text-gray-900">{amount}</p>
            <p className="text-gray-500 text-xs">{currency}</p>
          </div>

          {/* Return rate badge - clickeable with tooltip */}
          <div className="relative">
            <div
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="bg-gradient-to-r from-[#CEF2C5] to-[#d4f5cd] rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <TrendingUp className="size-3 text-[#0D9A68]" />
              <span className="text-[#0D9A68] text-xs font-semibold">{returnRate}</span>
              <Info className="size-3 text-[#0D9A68]/70" />
            </div>

            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10 animate-in fade-in duration-200">
                Variación respecto al día anterior
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Container */}
      <div className="flex flex-col gap-2 mt-3 w-full">
        {/* ADD MONEY BUTTON */}
        {onAddMoney && (
          <div className="w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onAddMoney}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:from-[#4856ff] hover:to-[#3246ff] transition-all w-full transform hover:-translate-y-0.5"
            >
              <Plus className="size-4" />
              Sumar dinero
            </button>
          </div>
        )}

      </div>

      {/* Secondary Action (Crear nuevo) - REMOVED as per user request */}
    </button>
  );
}