import { useId } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ThreeDPieChartProps {
  data: Array<{ name: string; value: number }>;
  colors: string[];
}

export function ThreeDPieChart({ data, colors }: ThreeDPieChartProps) {
  const filterId = useId();
  const baseGradientId = useId();

  const renderLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <defs>
          {colors.map((color, index) => (
            <linearGradient key={`pie-gradient-${baseGradientId}-${index}`} id={`${baseGradientId}-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.7} />
            </linearGradient>
          ))}
          <filter id={filterId}>
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={100}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          filter={`url(#${filterId})`}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${baseGradientId}-${index}`}
              fill={`url(#${baseGradientId}-${index % colors.length})`}
              stroke="#374151"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            border: '1px solid #374151',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            color: '#e5e7eb',
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{ color: '#9ca3af' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
