import { useState } from "react";
import type { WelfiTier } from "../constants/tierConfig";

interface TierBadgeProps {
    tier: WelfiTier;
    className?: string;
}

export function TierBadge({ tier, className = "" }: TierBadgeProps) {
    const [isHovered, setIsHovered] = useState(false);

    if (tier === "normal") return null;

    const isPro = tier === "pro";

    return (
        <div
            className={`relative inline-flex items-center gap-1.5 cursor-default select-none ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badge */}
            <div
                className={`
          relative overflow-hidden px-3 py-1.5 rounded-full font-black text-xs tracking-wider
          transition-all duration-300 
          ${isPro
                        ? "bg-gradient-to-r from-[#3246ff] via-[#6366f1] to-[#8b5cf6] text-white shadow-lg shadow-blue-500/30"
                        : "bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white shadow-lg shadow-purple-900/40 border border-purple-500/30"
                    }
          ${isHovered ? "scale-110" : "scale-100"}
        `}
            >
                {/* Shine animation overlay */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: isPro
                            ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 45%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.5) 55%, transparent 60%)"
                            : "linear-gradient(105deg, transparent 40%, rgba(168,85,247,0.4) 45%, rgba(255,215,0,0.6) 50%, rgba(168,85,247,0.4) 55%, transparent 60%)",
                        backgroundSize: "200% 100%",
                        animation: "badgeShine 3s ease-in-out infinite",
                    }}
                />

                {/* Glow ring for Black */}
                {!isPro && (
                    <div
                        className="absolute inset-0 rounded-full opacity-40"
                        style={{
                            boxShadow: "0 0 12px rgba(168,85,247,0.6), inset 0 0 8px rgba(255,215,0,0.3)",
                            animation: "glowPulse 2s ease-in-out infinite alternate",
                        }}
                    />
                )}

                {/* Content */}
                <span className="relative z-10 flex items-center gap-1">
                    {isPro ? "⚡" : "💎"}
                    <span
                        className={isPro ? "" : ""}
                        style={
                            !isPro
                                ? {
                                    background: "linear-gradient(135deg, #ffd700, #fff, #ffd700)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    backgroundClip: "text",
                                }
                                : undefined
                        }
                    >
                        {isPro ? "PRO" : "BLACK"}
                    </span>
                </span>
            </div>

            {/* Tooltip on hover */}
            {isHovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 whitespace-nowrap">
                    <div
                        className={`px-3 py-2 rounded-xl text-xs font-bold shadow-xl ${isPro
                                ? "bg-gradient-to-r from-[#3246ff] to-[#6366f1] text-white"
                                : "bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] text-white border border-purple-500/30"
                            }`}
                    >
                        {isPro ? "Miembro Welfi Pro ⚡" : "Miembro Welfi Black 💎"}
                    </div>
                    {/* Arrow */}
                    <div
                        className={`absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${isPro ? "bg-[#3246ff]" : "bg-[#1a1a2e]"
                            }`}
                    />
                </div>
            )}

            {/* CSS Animations */}
            <style>{`
        @keyframes badgeShine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glowPulse {
          0% { opacity: 0.2; }
          100% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
}
