import { useId } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

interface ThreeDRadarChartProps {
  data: Array<{ metric: string; value: number; fullMark: number }>;
  color: string;
}

export function ThreeDRadarChart({ data, color }: ThreeDRadarChartProps) {
  const gradientId = useId();
  const filterId = useId();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0.3} />
          </linearGradient>
          <filter id={filterId}>
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={color} floodOpacity="0.5" />
          </filter>
        </defs>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: '#9ca3af', fontSize: 10 }}
        />
        <Radar
          name="Performance"
          dataKey="value"
          stroke={color}
          fill={`url(#${gradientId})`}
          fillOpacity={0.7}
          strokeWidth={2}
          filter={`url(#${filterId})`}
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
      </RadarChart>
    </ResponsiveContainer>
  );
}
