import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Welfi Pesos', value: 2004, color: '#3246ff' },
  { name: 'Welfi Dólares', value: 2004, color: '#4856ff' },
  { name: 'Mis Objetivos', value: 2004, color: '#6b7aff' },
  { name: 'Mis Packs', value: 534, color: '#e5582f' },
];

export function PortfolioDistribution() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Distribución del Portafolio</h3>
      
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: 'none', 
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            formatter={(value: number) => `$${value.toLocaleString()}`}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
