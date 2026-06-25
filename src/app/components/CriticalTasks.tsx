import { useNavigate } from 'react-router';
import { AlertTriangle } from 'lucide-react';
import { sections } from '../data/tasks';

const NEON = "#00FF88";
const DIM  = "#1a5c38";

export function CriticalTasks() {
  const navigate = useNavigate();

  const critical = sections.flatMap(s =>
    s.tasks
      .filter(t => t.status === 'Belum Mula')
      .map(t => ({ ...t, sectionId: s.id, sectionName: s.name }))
  ).slice(0, 8);

  const sectionCounts = sections.map(s => ({
    id: s.id,
    name: s.name,
    count: s.tasks.filter(t => t.status === 'Belum Mula').length,
    total: s.tasks.length,
  }));

  return (
    <div className="rounded-2xl p-5 border h-full flex flex-col"
      style={{ background: 'linear-gradient(135deg,#071810,#0d2318)', borderColor: `${NEON}22` }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg border" style={{ background: `${NEON}10`, borderColor: `${NEON}25` }}>
          <AlertTriangle className="size-4" style={{ color: NEON }} />
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">Tugasan Belum Mula</h3>
          <p className="text-xs" style={{ color: `${NEON}50` }}>Memerlukan tindakan segera</p>
        </div>
        <span className="ml-auto font-black text-lg" style={{ color: NEON }}>
          {sectionCounts.reduce((s, c) => s + c.count, 0)}
        </span>
      </div>

      <div className="space-y-2.5 mb-4">
        {sectionCounts.map(sec => (
          <button
            key={sec.id}
            onClick={() => navigate(`/section/${sec.id}`)}
            className="w-full text-left rounded-lg px-2 py-1.5 transition-colors"
            style={{ background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = `${NEON}08`)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: NEON }}>{sec.name}</span>
              <span className="text-xs font-bold" style={{ color: `${NEON}80` }}>{sec.count} tugasan</span>
            </div>
            <div className="w-full rounded-full h-1.5" style={{ background: `${NEON}15` }}>
              <div
                className="h-1.5 rounded-full"
                style={{
                  width: `${(sec.count / sec.total) * 100}%`,
                  background: `linear-gradient(to right, ${DIM}, ${NEON})`,
                  boxShadow: `0 0 6px ${NEON}60`,
                }}
              />
            </div>
          </button>
        ))}
      </div>

      <div className="pt-3 flex-1" style={{ borderTop: `1px solid ${NEON}15` }}>
        <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: `${NEON}40` }}>
          Contoh Tugasan
        </p>
        <div className="space-y-1.5 overflow-hidden">
          {critical.slice(0, 5).map(task => (
            <button
              key={task.id}
              onClick={() => navigate(`/section/${task.sectionId}`)}
              className="w-full text-left flex items-start gap-2 rounded px-1.5 py-1 transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = `${NEON}08`)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span className="size-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: NEON, boxShadow: `0 0 4px ${NEON}` }} />
              <span className="text-gray-400 text-[11px] leading-tight line-clamp-1">{task.aktiviti}</span>
              <span className="ml-auto text-[10px] flex-shrink-0" style={{ color: `${NEON}70` }}>
                {task.sectionName.replace('Seksyen ', 'S')}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
