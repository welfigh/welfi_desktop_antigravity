import { Home, TrendingUp, Settings, HelpCircle, LogOut, BarChart3, Lock, MessageCircle, Video, Phone, Sparkles, Crown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CURRENT_USER_TIER, advisorInfo, tierConfigs } from "../../constants/tierConfig";
import type { WelfiTier } from "../../constants/tierConfig";

function SidebarAdvisor({ tier }: { tier: WelfiTier }) {
  const [showUpgrade, setShowUpgrade] = useState(false);

  // ── NORMAL: Blurred + upsell ──
  if (tier === "normal") {
    return (
      <>
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#3246ff]/30 shadow-lg shadow-blue-500/10 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="filter blur-[2px] pointer-events-none select-none bg-white p-3">
            <div className="flex items-center gap-2 mb-2">
              <img src={advisorInfo.photoUrl} alt="" className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="text-xs font-bold text-gray-900 leading-tight">{advisorInfo.name}</p>
                <p className="text-[10px] text-gray-400">{advisorInfo.email}</p>
              </div>
            </div>
            <div className="py-2 bg-green-500 text-white rounded-lg text-xs font-bold text-center">Contactar</div>
          </div>
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center p-3">
            <Lock className="size-5 text-[#3246ff] mb-1.5" />
            <p className="text-xs font-black text-gray-900 text-center leading-tight mb-1">Desbloqueá tu asesor</p>
            <p className="text-[10px] text-gray-500 text-center mb-2">Un experto a tu lado por WhatsApp</p>
            <button
              onClick={() => setShowUpgrade(true)}
              className="w-full py-2 bg-gradient-to-r from-[#3246ff] to-[#8b5cf6] text-white font-bold text-[11px] rounded-xl shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-1"
            >
              <Sparkles className="size-3" />
              Welfi Pro • $3/mes
            </button>
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgrade && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpgrade(false)} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowUpgrade(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">✕</button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3246ff] to-[#8b5cf6] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Crown className="size-8 text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Mejorá tu experiencia Welfi</h2>
                <p className="text-gray-500">Elegí el plan que mejor se adapte a tus necesidades</p>
              </div>
              <div className="space-y-4">
                {/* Pro Plan */}
                <div className="rounded-2xl p-5 border-2 border-blue-200 hover:border-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#3246ff] to-[#6366f1] text-white text-xs font-bold rounded-full">⚡ PRO</span>
                    <p className="text-xl font-black text-gray-900">$3 <span className="text-sm font-bold text-gray-500">USD/mes</span></p>
                  </div>
                  <ul className="space-y-2">
                    {tierConfigs.pro.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700"><span className="text-green-500 text-xs">✓</span>{f}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-gray-400 mt-3">Gratis con +$10.000 USD invertidos</p>
                  <button onClick={() => alert("Suscripción Welfi Pro — WIP")} className="w-full mt-3 py-3 bg-gradient-to-r from-[#3246ff] to-[#6366f1] text-white font-bold rounded-xl hover:from-[#4856ff] hover:to-[#8b5cf6] transition-all shadow-lg">
                    Suscribirme a Pro
                  </button>
                </div>
                {/* Black Plan */}
                <div className="rounded-2xl p-5 border-2 border-purple-200 hover:border-purple-400 bg-gradient-to-br from-gray-900 to-[#1a1a2e] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full border border-purple-400/30" style={{ background: "linear-gradient(135deg, #1a1a2e, #0f3460)", color: "#ffd700" }}>💎 BLACK</span>
                    <p className="text-xl font-black text-white">$10 <span className="text-sm font-bold text-gray-400">USD/mes</span></p>
                  </div>
                  <ul className="space-y-2">
                    {tierConfigs.black.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300"><span className="text-amber-400 text-xs">✓</span>{f}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-gray-500 mt-3">Gratis con +$20.000 USD invertidos</p>
                  <button onClick={() => alert("Suscripción Welfi Black — WIP")} className="w-full mt-3 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25">
                    Suscribirme a Black
                  </button>
                </div>
              </div>
            </div>
          </div>
          , document.body)}
      </>
    );
  }

  // ── PRO: Advisor + WhatsApp ──
  if (tier === "pro") {
    return (
      <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#3246ff] via-[#6366f1] to-[#8b5cf6]" />
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <img src={advisorInfo.photoUrl} alt={advisorInfo.name} className="w-10 h-10 rounded-full object-cover border-2 border-blue-200" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 leading-tight">{advisorInfo.name}</p>
              <p className="text-[10px] text-gray-400">{advisorInfo.phone}</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${advisorInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs rounded-xl shadow transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="size-3.5" fill="white" />
            Contactar
          </a>
        </div>
      </div>
    );
  }

  // ── BLACK: Premium dark card ──
  return (
    <div className="rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] p-3 relative">
        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/20 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full opacity-50 blur-[2px]" />
              <img src={advisorInfo.photoUrl} alt={advisorInfo.name} className="relative w-10 h-10 rounded-full object-cover border border-purple-400/50" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1a2e]" />
            </div>
            <div>
              <p className="text-xs font-black text-white leading-tight">{advisorInfo.name}</p>
              <span className="text-[9px] font-bold tracking-wider" style={{ color: "#ffd700" }}>💎 BLACK</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-1.5">
            <a
              href={`https://wa.me/${advisorInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 py-2 bg-[#25D366] text-white font-bold text-[10px] rounded-lg transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="size-3" fill="white" />
              WhatsApp
            </a>
            <button className="flex items-center justify-center gap-1 py-2 bg-white/10 text-white font-bold text-[10px] rounded-lg border border-white/10 transition-all hover:bg-white/20">
              <Phone className="size-3" />
              Llamar
            </button>
          </div>
          <button className="flex items-center justify-center gap-1 w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[10px] rounded-lg shadow transition-all hover:scale-[1.02]">
            <Video className="size-3" />
            Agendar videollamada
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const navItems = [
    { to: "/", label: "Inicio", icon: Home },
    { to: "/investments", label: "Todas mis inversiones", icon: TrendingUp },
    { to: "/movements", label: "Movimientos", icon: TrendingUp },
    { to: "/settings", label: "Configuración", icon: Settings },
    // { to: "/stats", label: "Estadísticas", icon: BarChart3 }, // TODO: Enable when page exists
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-56 bg-white border-r border-gray-200 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#3246ff] to-[#4856ff] bg-clip-text text-transparent">
          Welfi
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all ${isActive
                    ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="size-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Dólar MEP button */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg group">
            <span className="text-base group-hover:scale-110 transition-transform">💵</span>
            <div className="flex flex-col items-start leading-tight">
              <span className="font-semibold text-xs">Compra o vendé</span>
              <span className="font-semibold text-xs">dólares</span>
            </div>
          </button>
        </div>

        {/* Nueva Inversión button */}
        <div className="mt-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('welfi:new-investment'))}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#3246ff] to-[#8b5cf6] text-white hover:from-[#4856ff] hover:to-[#a78bfa] transition-all shadow-md hover:shadow-lg hover:shadow-purple-500/25 group"
          >
            <span className="text-base group-hover:scale-110 transition-transform">✨</span>
            <span className="font-bold text-xs">Nueva Inversión</span>
          </button>
        </div>

        {/* Sidebar Advisor Module */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <SidebarAdvisor tier={CURRENT_USER_TIER} />
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all text-sm">
          <HelpCircle className="size-4" />
          <span className="font-medium">Ayuda</span>
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all text-sm">
          <LogOut className="size-4" />
          <span className="font-medium">Salir</span>
        </button>
      </div>
    </aside>
  );
}