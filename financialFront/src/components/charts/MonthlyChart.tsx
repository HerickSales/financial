import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MonthlyChartProps {
  data: {
    labels: string[];
    receitas: number[];
    despesas: number[];
  };
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  const chartData = data.labels.map((label, index) => ({
    month: label,
    Receitas: data.receitas[index],
    Despesas: data.despesas[index]
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="month" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Receitas"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ fill: '#10B981', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Despesas"
            stroke="#EF4444"
            strokeWidth={3}
            dot={{ fill: '#EF4444', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyChart;
