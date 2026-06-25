import { useId } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ThreeDLineChartProps {
  data: Array<{ name: string; value: number }>;
  color: string;
}

export function ThreeDLineChart({ data, color }: ThreeDLineChartProps) {
  const gradientId = useId();
  const filterId = useId();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <filter id={filterId}>
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.4" />
          </filter>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="50%" stopColor={color} stopOpacity={1} />
            <stop offset="100%" stopColor={color} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
        <XAxis
          dataKey="name"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#374151' }}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: '#374151' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(31, 41, 55, 0.95)',
            border: '1px solid #374151',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
            color: '#e5e7eb',
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={`url(#${gradientId})`}
          strokeWidth={3}
          dot={{ fill: color, r: 5, strokeWidth: 2, stroke: '#fff' }}
          activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff' }}
          filter={`url(#${filterId})`}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
