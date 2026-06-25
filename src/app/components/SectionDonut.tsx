import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router';
import type { Section } from '../data/tasks';

interface Props {
  section: Section;
  completion: number;
}

// Strictly define the three possible statuses for TypeScript
type StatusType = 'good' | 'avg' | 'poor';

export function SectionDonut({ section, completion }: Props) {
  const navigate = useNavigate();
  const done = section.tasks.filter(t => t.status === 'Selesai').length;
  const inProgress = section.tasks.filter(t => t.status === 'Dalam Proses').length;
  const notStarted = section.tasks.filter(t => t.status === 'Belum Mula').length;
  const total = section.tasks.length;

  const donutData = [
    { value: completion },
    { value: Math.max(0, 100 - completion) },
  ];

  // Apply that strict type to our status variable
  const status: StatusType = completion >= 80 ? 'good' : completion >= 60 ? 'avg' : 'poor';
  
  // We unified all primary text to match the darker premium green, 
  // but keep the semantic status for the small badge text (Baik/Sederhana/Perhatian).
  const badgeColors: Record<StatusType, string> = {
    good: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    avg: 'bg-emerald-800/20 text-emerald-500 border-emerald-700/30',
    poor: 'bg-emerald-950/30 text-emerald-600 border-emerald-900/40'
  };

  const trackColor = "rgba(2, 15, 8, 0.6)"; // Deepened slightly more for better contrast

  return (
    <div
      onClick={() => navigate(`/section/${section.id}`)}
      className="relative rounded-[24px] bg-glass-surface backdrop-blur-[24px] border border-glass-border shadow-[0_12px_32px_0_rgba(0,0,0,0.6)] p-5 cursor-pointer hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_12px_40px_0_rgba(16,185,129,0.15)] transition-all duration-300 group overflow-hidden"
    >
      {/* Embedded Edge Light on hover */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="min-w-0 flex-1 pr-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-emerald-200/40 mb-0.5">
            {section.name}
          </p>
          <h3 className="text-emerald-100/90 font-semibold text-xs leading-tight truncate" title={section.fullName}>
            {section.fullName}
          </h3>
        </div>
        <span className={`flex-shrink-0 text-[10px] px-2 py-1 rounded-full font-medium tracking-wide border shadow-sm ${badgeColors[status]}`}>
          {status === 'good' ? 'Baik' : status === 'avg' ? 'Sederhana' : 'Perhatian'}
        </span>
      </div>

      {/* Donut Chart */}
      <div className="relative z-10" style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <defs>
              {/* Premium Dark Green to White Gradient for that holographic/metallic shine */}
              <linearGradient id={`grad-green-white-${section.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#047857" /> {/* Dark Emerald (emerald-700) */}
                <stop offset="50%" stopColor="#10b981" /> {/* Mid Emerald */}
                <stop offset="100%" stopColor="#ffffff" /> {/* Bright White reflection */}
              </linearGradient>
            </defs>

            <Pie
              data={donutData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={68}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-out"
            >
              {/* Unified Green-to-White gradient for all rings for executive consistency */}
              <Cell key={`${section.id}-fill`} fill={`url(#grad-green-white-${section.id})`} style={{ filter: `drop-shadow(0px 2px 8px rgba(16,185,129,0.25))` }} />
              <Cell key={`${section.id}-empty`} fill={trackColor} />
            </Pie>
            
            {/* Outer Decorative Thin Ring */}
            <Pie
              data={[{ value: 1 }]}
              cx="50%"
              cy="50%"
              innerRadius={74}
              outerRadius={75}
              dataKey="value"
              strokeWidth={0}
              isAnimationActive={false}
            >
              <Cell key={`${section.id}-ring`} fill="rgba(16, 185, 129, 0.1)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text - Unified to premium green for consistency */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
          <span className="text-3xl font-light tracking-tight text-emerald-500">{completion}%</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-200/40 mt-1">Pencapaian</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mt-4 relative z-10">
        <div className="text-center rounded-xl bg-emerald-950/20 border border-emerald-800/20 py-2 transition-colors group-hover:bg-emerald-900/20">
          <p className="font-light text-lg text-emerald-400">{done}</p>
          <p className="text-[9px] uppercase tracking-wider text-emerald-100/40">Selesai</p>
        </div>
        <div className="text-center rounded-xl bg-[#020a06]/30 border border-emerald-900/30 py-2">
          <p className="font-light text-lg text-emerald-500/70">{inProgress}</p>
          <p className="text-[9px] uppercase tracking-wider text-emerald-100/30">Berjalan</p>
        </div>
        <div className="text-center rounded-xl bg-[#020a06]/30 border border-emerald-900/30 py-2">
          <p className="font-light text-lg text-emerald-600/50">{notStarted}</p>
          <p className="text-[9px] uppercase tracking-wider text-emerald-100/20">Blm Mula</p>
        </div>
      </div>

      {/* Footer hint */}
      <div className="mt-4 text-center relative z-10">
        <p className="text-[10px] text-emerald-200/20 font-medium tracking-wide">
          <span className="text-emerald-100/40">{total}</span> TUGASAN KESELURUHAN
        </p>
        <p className="text-[10px] mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-emerald-500 font-medium tracking-wide flex items-center justify-center gap-1">
          Klik untuk butiran <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
        </p>
      </div>
    </div>
  );
}