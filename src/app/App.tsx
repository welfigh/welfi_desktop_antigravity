import { Menu, HelpCircle, Bell, Settings, Search } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { BalanceCard } from "./components/BalanceCard";
import { InvestmentCard } from "./components/InvestmentCard";
import { ActionButton } from "./components/ActionButton";
import { NewsCard } from "./components/NewsCard";
import { PerformanceChart } from "./components/PerformanceChart";
import { PortfolioDistribution } from "./components/PortfolioDistribution";
import { QuickStats } from "./components/QuickStats";
import { WelfiPesosFlow } from "./components/WelfiPesosFlow";
import { TotalBalanceChart } from "./components/TotalBalanceChart";
import { AllInvestmentsPage } from "./components/AllInvestmentsPage";
import { MovementsPage } from "./components/MovementsPage";
import { SettingsPage } from "./components/SettingsPage";
import { LoginPage } from "./components/LoginPage";
import img716 from "../assets/72384e84861ccea0025a5cb04af72b6dbb5d53f9.png";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelfiPesosFlow, setShowWelfiPesosFlow] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [currency, setCurrency] = useState<"USD" | "ARS">("USD");

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  // Exchange rate: 1 USD = 1000 ARS (aproximado)
  const EXCHANGE_RATE = 1000;

  // Toggle between USD and ARS
  const toggleCurrency = () => {
    setCurrency(prev => prev === "USD" ? "ARS" : "USD");
  };

  // Helper function to format amount based on selected currency
  const formatAmount = (usdAmount: number, forceARS: boolean = false) => {
    if (forceARS || currency === "ARS") {
      const arsAmount = usdAmount * EXCHANGE_RATE;
      return arsAmount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return usdAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculate total balance in selected currency
  const totalBalanceUSD = 4560.00;
  const totalBalance = currency === "USD"
    ? totalBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : (totalBalanceUSD * EXCHANGE_RATE).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#fafafa] to-[#f5f5f7]">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header con gradiente azul */}
        <header className="relative bg-gradient-to-br from-[#3246ff] via-[#4856ff] to-[#3d4eff] overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-20">
            <img
              src={img716}
              alt=""
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>

          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e5582f]/20 rounded-full blur-3xl" />

          {/* Header content */}
          <div className="relative z-10 w-full py-6">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button className="lg:hidden backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-2xl p-2.5 transition-all">
                    <Menu className="size-6 text-white" />
                  </button>
                  <h1 className="text-white text-2xl font-semibold">Hola, Fran 👋</h1>
                </div>

                <div className="flex items-center gap-4">
                  {/* Search bar - desktop only */}
                  <div className="hidden md:flex items-center gap-2 backdrop-blur-md bg-white/20 rounded-2xl px-4 py-2 min-w-[300px]">
                    <Search className="size-5 text-white/60" />
                    <input
                      type="text"
                      placeholder="Buscar inversiones, packs..."
                      className="bg-transparent text-white placeholder:text-white/60 outline-none w-full text-sm"
                    />
                  </div>

                  <button className="backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-2xl p-2.5 transition-all relative">
                    <Bell className="size-5 text-white" />
                    <div className="absolute -top-1 -right-1 bg-[#e5582f] rounded-full w-2 h-2" />
                  </button>
                  <button className="backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-2xl p-2.5 transition-all">
                    <Settings className="size-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Balance and Chart Layout */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-center py-4">
                {/* Left column - Balance */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2 text-[#b5c1ec]">
                    <span className="text-sm font-medium">Todo mi dinero</span>
                    <HelpCircle className="size-4" />
                  </div>

                  <BalanceCard
                    balance={totalBalance}
                    currency={currency}
                    returnRate="0.0%"
                    isPositive={true}
                    onCurrencyChange={toggleCurrency}
                  />

                  {/* Balance breakdown */}
                  <div className="space-y-2 text-white/80 text-sm">
                    <div className="flex items-center justify-between">
                      <span>ARS disponibles para invertir o retirar:</span>
                      <span className="font-medium text-white">$ 2.004.000,00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>USD disponibles para invertir o retirar:</span>
                      <span className="font-medium text-white">$ 4.560,00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>ARS en proceso de acreditación:</span>
                      <span className="font-medium text-white">$ 0,00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>USD en proceso de acreditación:</span>
                      <span className="font-medium text-white">$ 0,00</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-4">
                    <ActionButton>💰 Ingresar dinero</ActionButton>
                    <ActionButton>🏦 Retirar dinero</ActionButton>
                  </div>
                </div>

                {/* Right column - Historical Chart */}
                <div className="hidden lg:block w-full">
                  <TotalBalanceChart currency={currency} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 w-full px-8 lg:px-12 py-8">
          {/* HOME */}
          {currentPage === "home" && (
            <div className="space-y-8">
              {/* Investment sections container */}
              <div className="space-y-6">
                {/* Section headers */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
                  {/* Corto plazo header */}
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
                    <h2 className="text-gray-800 text-xl font-semibold">Corto plazo</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  </div>

                  {/* Mediano y largo plazo header */}
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#e5582f] to-[#f06844] rounded-full" />
                    <h2 className="text-gray-800 text-xl font-semibold">Mediano y largo plazo</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  </div>
                </div>

                {/* Investment cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6">
                  {/* Corto plazo cards */}
                  <InvestmentCard
                    title="Welfi Pesos"
                    amount="$ 2.004,00"
                    currency="ARS"
                    returnRate="0.9%"
                    objectivesCount={1}
                    objectivesLabel="inversión"
                    onViewAll={() => setCurrentPage("investments")}
                  />
                  <InvestmentCard
                    title="Welfi Dólares"
                    amount={currency === "USD" ? "$ 0,00" : `$ ${formatAmount(0, false)}`}
                    currency={currency}
                    returnRate="0.9%"
                    isEmpty={true}
                    onCreateNew={() => alert('Próximamente: Crear inversión en Welfi Dólares')}
                  />

                  {/* Mediano y largo plazo cards */}
                  <InvestmentCard
                    title="Estrategias de inversión para cumplir tus objetivos"
                    amount={currency === "USD" ? "$ 2.004,00" : `$ ${formatAmount(2004, false)}`}
                    currency={currency}
                    returnRate="0.9%"
                    objectivesCount={4}
                    objectivesLabel="objetivos"
                    onViewAll={() => setCurrentPage("investments")}
                  />
                  <InvestmentCard
                    title="Packs temáticos de acciones"
                    amount={currency === "USD" ? "$ 534,00" : `$ ${formatAmount(534, false)}`}
                    currency={currency}
                    returnRate="2.3%"
                    objectivesCount={2}
                    objectivesLabel="packs"
                    onViewAll={() => setCurrentPage("investments")}
                  />
                  <InvestmentCard
                    title="Fondo de Emergencia"
                    amount={currency === "USD" ? "$ 1.200,00" : `$ ${formatAmount(1200, false)}`}
                    currency={currency}
                    returnRate="1.5%"
                    objectivesCount={1}
                    objectivesLabel="fondo"
                    onViewAll={() => setCurrentPage("investments")}
                  />
                  <InvestmentCard
                    title="Fondo de retiro"
                    amount={currency === "USD" ? "$ 0,00" : `$ ${formatAmount(0, false)}`}
                    currency={currency}
                    returnRate="0.0%"
                    isEmpty={true}
                    onCreateNew={() => alert('Próximamente: Crear fondo de retiro')}
                  />
                </div>
              </div>

              {/* Lo último en news section */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
                  <h2 className="text-gray-800 text-xl font-semibold">Lo último en news</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <NewsCard
                    emoji="🎯"
                    message="Parece que todavía no tienes objetivos de ahorro"
                  />
                  <NewsCard
                    emoji="📈"
                    message="El mercado muestra tendencias positivas esta semana"
                  />
                  <NewsCard
                    emoji="💡"
                    message="Nuevas oportunidades de inversión disponibles"
                  />
                </div>
              </section>
            </div>
          )}

          {/* ESTADÍSTICAS */}
          {currentPage === "stats" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-[#3246ff] to-[#4856ff] rounded-full" />
                <h1 className="text-gray-900 text-3xl font-black">Estadísticas</h1>
              </div>

              {/* Quick Stats */}
              <section>
                <QuickStats />
              </section>

              {/* Charts section */}
              <section>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PerformanceChart />
                  <PortfolioDistribution />
                </div>
              </section>
            </div>
          )}

          {/* MOVIMIENTOS */}
          {currentPage === "movements" && (
            <MovementsPage />
          )}

          {/* CONFIGURACIÓN */}
          {currentPage === "settings" && (
            <SettingsPage onLogout={() => setIsAuthenticated(false)} />
          )}

          {/* TODAS MIS INVERSIONES */}
          {currentPage === "investments" && (
            <AllInvestmentsPage />
          )}
        </main>
      </div>

      {/* Welfi Pesos Investment Flow Modal */}
      {showWelfiPesosFlow && (
        <WelfiPesosFlow
          availableBalanceARS="1,000.00"
          availableBalanceUSD="4,560.00"
          onClose={() => setShowWelfiPesosFlow(false)}
        />
      )}
    </div>
  );
}