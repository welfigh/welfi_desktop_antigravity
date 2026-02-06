import { Home, TrendingUp, Target, Package, Newspaper, Settings, HelpCircle, LogOut, BarChart3 } from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const navItems = [
    { id: "home", label: "Inicio", icon: Home },
    { id: "investments", label: "Todas mis inversiones", icon: TrendingUp },
    { id: "movements", label: "Movimientos", icon: TrendingUp },
    { id: "settings", label: "Configuración", icon: Settings },
    { id: "stats", label: "Estadísticas", icon: BarChart3 },
  ];

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3246ff] to-[#4856ff] bg-clip-text text-transparent">
          Welfi
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  currentPage === item.id
                    ? "bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <item.icon className="size-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        {/* Dólar MEP button */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg group">
            <span className="text-xl group-hover:scale-110 transition-transform">💵</span>
            <div className="flex flex-col items-start leading-tight">
              <span className="font-semibold text-sm">Compra o vendé</span>
              <span className="font-semibold text-sm">dólares</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all">
          <HelpCircle className="size-5" />
          <span className="font-medium">Ayuda</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all">
          <LogOut className="size-5" />
          <span className="font-medium">Salir</span>
        </button>
      </div>
    </aside>
  );
}