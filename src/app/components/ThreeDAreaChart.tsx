import { useId } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ThreeDAreaChartProps {
  data: Array<{ name: string; value: number }>;
  color: string;
}

export function ThreeDAreaChart({ data, color }: ThreeDAreaChartProps) {
  const gradientId = useId();
  const filterId = useId();

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8} />
            <stop offset="95%" stopColor={color} stopOpacity={0.1} />
          </linearGradient>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
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
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={3}
          fill={`url(#${gradientId})`}
          filter={`url(#${filterId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
