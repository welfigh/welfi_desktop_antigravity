import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Ene', value: 4200 },
  { month: 'Feb', value: 4350 },
  { month: 'Mar', value: 4280 },
  { month: 'Abr', value: 4450 },
  { month: 'May', value: 4520 },
  { month: 'Jun', value: 4560 },
];

export function PerformanceChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Rendimiento Total</h3>
        <div className="flex gap-2">
          <button className="text-sm px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            1M
          </button>
          <button className="text-sm px-3 py-1 rounded-lg bg-gradient-to-r from-[#3246ff] to-[#4856ff] text-white">
            6M
          </button>
          <button className="text-sm px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
            1A
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#999" 
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#999" 
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="url(#colorGradient)" 
            strokeWidth={3}
            dot={{ fill: '#3246ff', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3246ff" />
              <stop offset="100%" stopColor="#4856ff" />
            </linearGradient>
          </defs>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
