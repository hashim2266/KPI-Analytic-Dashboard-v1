import { useEffect, useState } from 'react';
import { Calendar, Leaf, Clock } from 'lucide-react';
import { paperlessProgram, eventsThisMonth } from '../data/tasks';

export function DashboardSidebar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
  const timeStr = now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  // Shared classes for the premium glass cards
  const glassCardClasses = "relative p-5 rounded-[24px] bg-glass-surface backdrop-blur-[24px] border border-glass-border shadow-[0_12px_32px_0_rgba(0,0,0,0.6)] overflow-hidden before:absolute before:top-0 before:inset-x-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-emerald-400/20 before:to-transparent";

  return (
    <aside className="flex flex-col gap-4 w-full">

      {/* ----------------- CLOCK SECTION ----------------- */}
      <div className={glassCardClasses}>
        {/* Top Edge Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />
        
        {/* Animated Sweep */}
        <div className="absolute inset-0 p-[1px] rounded-[24px] glass-card-mask pointer-events-none z-0">
          <div className="absolute w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[conic-gradient(from_0deg,transparent_70%,rgba(16,185,129,0.3)_85%,transparent_100%)] animate-edge-sweep" />
        </div>

        <div className="relative z-10 flex items-center gap-2 mb-3">
          <Clock className="size-4 text-emerald-500" />
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100/70">Masa Semasa</span>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="text-4xl font-light tracking-widest font-mono text-emerald-400">{timeStr}</div>
          <div className="text-xs mt-2 text-emerald-200/60">{dateStr}</div>
          <div className="text-[10px] mt-1 font-medium text-emerald-200/40 uppercase tracking-wide">Malaysia (MYT • UTC+8)</div>
        </div>
      </div>

      {/* ----------------- PAPERLESS PROGRAM ----------------- */}
      <div className={glassCardClasses}>
        {/* Top Edge Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

        <div className="relative z-10 flex items-center gap-2 mb-4">
          <Leaf className="size-4 text-emerald-500" />
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100/70">Program Tanpa Kertas</span>
        </div>
        
        <div className="relative z-10 flex items-end gap-3 mb-4">
          <span className="text-4xl font-light text-emerald-400 tracking-tight">{paperlessProgram.current}%</span>
          <span className="text-xs mb-2 text-emerald-200/50">/ {paperlessProgram.target}% Sasaran</span>
        </div>
        
        {/* Professional Progress Bar */}
        <div className="relative z-10 w-full rounded-full h-2.5 mb-5 bg-emerald-950/50 border border-emerald-900/30 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-emerald-800 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000"
            style={{ width: `${paperlessProgram.current}%` }} 
          />
        </div>
        
        <div className="relative z-10 space-y-3">
          {paperlessProgram.milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-3">
              <div 
                className={`size-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${
                  m.done 
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400' 
                    : 'bg-transparent border border-emerald-800/40'
                }`}
              >
                {m.done ? '✓' : ''}
              </div>
              <span className={`text-xs ${m.done ? 'text-emerald-100' : 'text-emerald-100/40'}`}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- EVENTS THIS MONTH ----------------- */}
      <div className={`${glassCardClasses} flex-1`}>
        {/* Top Edge Highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

        <div className="relative z-10 flex items-center gap-2 mb-5">
          <Calendar className="size-4 text-emerald-500" />
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-100/70">Acara Bulan Ini</span>
        </div>
        
        <div className="relative z-10 space-y-4">
          {eventsThisMonth.map((ev, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-shrink-0">
                <div className="rounded-lg px-2 py-1.5 min-w-[42px] text-center bg-emerald-950/40 border border-emerald-800/50 shadow-inner">
                  <span className="text-xs font-medium text-emerald-400">{ev.date}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs leading-relaxed text-emerald-100/90">{ev.title}</p>
                <span className="text-[10px] px-2 py-0.5 rounded border mt-1.5 inline-block bg-emerald-950/30 border-emerald-800/50 text-emerald-200/60 font-medium">
                  {ev.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </aside>
  );
}