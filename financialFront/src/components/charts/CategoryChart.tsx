import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryChartProps {
  data: {
    categories: string[];
    values: number[];
    colors: string[];
  };
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const chartData = data.categories.map((category, index) => ({
    name: category,
    value: data.values[index]
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={data.colors[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `R$ ${(value as number).toFixed(2)}`}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;
