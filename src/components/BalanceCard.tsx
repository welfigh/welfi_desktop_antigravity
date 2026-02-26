import { ChevronDown, TrendingUp } from "lucide-react";
import { HelpCircle } from "lucide-react";
import { useState } from "react";

interface BalanceCardProps {
  balance: string;
  currency: string;
  returnRate: string;
  isPositive?: boolean;
  onCurrencyChange?: () => void;
}

export function BalanceCard({ balance, currency, returnRate, isPositive = true, onCurrencyChange }: BalanceCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-baseline gap-2">
        <p className="text-white font-semibold text-3xl md:text-4xl">{balance}</p>
        <button
          onClick={onCurrencyChange}
          className="flex items-center gap-1.5 text-white/90 hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          <span className="text-xl">{currency === "USD" ? "🇺🇸" : "🇦🇷"}</span>
          <span className="text-sm">{currency}</span>
          <ChevronDown className="size-4" />
        </button>
      </div>

      {/* Return rate badge + info icon inline */}
      <div className="flex items-center gap-1.5">
        <button className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
          <TrendingUp className={`size-3 ${isPositive ? 'text-[#CEF2C5]' : 'text-red-300'}`} />
          <span className={`text-xs ${isPositive ? 'text-[#CEF2C5]' : 'text-red-300'}`}>{returnRate}</span>
        </button>

        <div className="relative">
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-white/60 hover:text-white/90 transition-colors"
          >
            <HelpCircle className="size-3.5" />
          </button>

          {showTooltip && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-64">
              <div className="backdrop-blur-xl bg-black/80 text-white text-sm rounded-2xl px-4 py-3 shadow-xl border border-white/10 text-center">
                <p className="text-white/90">Es la variación diaria respecto al cierre anterior</p>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-3 rotate-45 bg-black/80 border-l border-t border-white/10" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
