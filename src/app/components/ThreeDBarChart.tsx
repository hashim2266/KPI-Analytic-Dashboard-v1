import { useId } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ThreeDBarChartProps {
  data: Array<{ name: string; value: number }>;
  color: string;
}

export function ThreeDBarChart({ data, color }: ThreeDBarChartProps) {
  const gradientId = useId();
  const filterId = useId();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={color} stopOpacity={0.6} />
          </linearGradient>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="4" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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
          cursor={{ fill: `${color}15` }}
        />
        <Bar
          dataKey="value"
          fill={`url(#${gradientId})`}
          radius={[8, 8, 0, 0]}
          filter={`url(#${filterId})`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
