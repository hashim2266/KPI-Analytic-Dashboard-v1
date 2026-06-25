import { motion } from "motion/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  chart?: React.ReactNode;
  color: string;
}

export function KPICard({ title, value, change, icon, chart, color }: KPICardProps) {
  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="size-4" />;
    if (change < 0) return <TrendingDown className="size-4" />;
    return <Minus className="size-4" />;
  };

  const getTrendColor = () => {
    if (change > 0) return "text-green-400";
    if (change < 0) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl bg-gray-800 p-6 shadow-lg border border-gray-700"
      style={{
        boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 0 0 1px ${color}25`,
      }}
    >
      {/* Background gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full blur-3xl"
        style={{ backgroundColor: color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">{value}</h3>
        </div>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>

      {/* Trend indicator */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`flex items-center gap-1 ${getTrendColor()}`}>
          {getTrendIcon()}
          <span className="text-sm font-semibold">
            {Math.abs(change)}%
          </span>
        </span>
        <span className="text-xs text-gray-500">vs last period</span>
      </div>

      {/* Chart */}
      {chart && (
        <div className="mt-4 -mx-2">
          {chart}
        </div>
      )}
    </motion.div>
  );
}
