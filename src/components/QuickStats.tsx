import { ArrowUpRight, ArrowDownRight, DollarSign, Percent } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
}

function StatCard({ label, value, change, isPositive, icon }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-[#3246ff]/10 to-[#4856ff]/10">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
          {change}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  );
}

export function QuickStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        label="Ganancia Total"
        value="$356.20"
        change="+12.5%"
        isPositive={true}
        icon={<DollarSign className="size-5 text-[#3246ff]" />}
      />
      <StatCard
        label="Rentabilidad Anual"
        value="8.3%"
        change="+2.1%"
        isPositive={true}
        icon={<Percent className="size-5 text-[#3246ff]" />}
      />
      <StatCard
        label="Inversión Activa"
        value="$6,546"
        change="+5.2%"
        isPositive={true}
        icon={<ArrowUpRight className="size-5 text-[#3246ff]" />}
      />
    </div>
  );
}
