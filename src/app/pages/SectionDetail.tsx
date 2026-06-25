import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle2, Clock3, AlertCircle, Download } from 'lucide-react';
import { sections } from '../data/tasks';
import type { Task } from '../data/tasks';

const NEON = "#00FF88";
const DIM  = "#1a5c38";

function StatusBadge({ status }: { status: Task['status'] }) {
  const opacity = status === 'Selesai' ? '1' : status === 'Dalam Proses' ? '0.6' : '0.35';
  const icons = {
    'Selesai': <CheckCircle2 className="size-3" />,
    'Dalam Proses': <Clock3 className="size-3" />,
    'Belum Mula': <AlertCircle className="size-3" />,
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border"
      style={{ color: NEON, borderColor: `${NEON}40`, background: `${NEON}10`, opacity }}>
      {icons[status]}
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full h-1.5" style={{ background: `${NEON}15` }}>
        <div className="h-1.5 rounded-full transition-all"
          style={{
            width: `${value}%`,
            background: `linear-gradient(to right, ${DIM}, ${NEON})`,
            boxShadow: `0 0 4px ${NEON}60`,
          }} />
      </div>
      <span className="text-xs font-bold w-9 text-right" style={{ color: NEON }}>{value}%</span>
    </div>
  );
}

export default function SectionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const section = sections.find(s => s.id === id);

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Seksyen tidak dijumpai.</p>
          <button onClick={() => navigate('/')} className="mt-4 hover:underline text-sm" style={{ color: NEON }}>
            ← Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const done = section.tasks.filter(t => t.status === 'Selesai').length;
  const inProg = section.tasks.filter(t => t.status === 'Dalam Proses').length;
  const notStarted = section.tasks.filter(t => t.status === 'Belum Mula').length;
  const avg = Math.round(section.tasks.reduce((s, t) => s + t.peratusan, 0) / section.tasks.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="size-4" />
              Dashboard
            </button>
            <div className="h-5 w-px bg-gray-700" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: section.color }}>
                {section.name}
              </span>
              <h1 className="text-white font-black text-base leading-tight">{section.fullName}</h1>
            </div>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs transition-colors border border-gray-700">
            <Download className="size-3" />
            Eksport
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            { label: 'Jumlah Tugasan', value: section.tasks.length, opacity: 1 },
            { label: 'Selesai', value: done, opacity: 1 },
            { label: 'Dalam Proses', value: inProg, opacity: 0.65 },
            { label: 'Belum Mula', value: notStarted, opacity: 0.35 },
            { label: 'Purata %', value: `${avg}%`, opacity: 1 },
          ].map(card => (
            <div key={card.label} className="rounded-xl p-4 border"
              style={{ background: `${NEON}08`, borderColor: `${NEON}25` }}>
              <p className="text-xs mb-1" style={{ color: `${NEON}60` }}>{card.label}</p>
              <p className="text-3xl font-black" style={{ color: NEON, opacity: card.opacity }}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Task Table */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900 rounded-2xl border border-gray-700/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700/60 flex items-center justify-between">
            <h2 className="text-white font-bold text-sm">
              Senarai Tugasan — {section.name} ({section.fullName})
            </h2>
            <span className="text-gray-500 text-xs">{section.tasks.length} rekod</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700/60 bg-gray-900/60">
                  <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider w-12">Bil</th>
                  <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">Aktiviti / Tugasan</th>
                  <th className="text-center px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider w-24">Sasaran</th>
                  <th className="text-center px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider w-24">Pencapaian</th>
                  <th className="text-left px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider w-48">Peratusan</th>
                  <th className="text-center px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider w-36">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {section.tasks.map((task, i) => (
                  <tr
                    key={task.id}
                    className={`hover:bg-gray-700/20 transition-colors ${i % 2 === 0 ? 'bg-transparent' : 'bg-gray-800/10'}`}
                  >
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{task.bil}</td>
                    <td className="px-4 py-3">
                      <span className="text-gray-200 text-xs leading-snug">{task.aktiviti}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-gray-300 text-xs font-medium">
                        {task.type === 'percent' ? `${task.sasaran}%` : `${task.sasaran} ${task.unit}`}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-white text-xs font-bold">
                        {task.type === 'percent' ? `${task.pencapaian}%` : `${task.pencapaian} ${task.unit}`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ProgressBar value={task.peratusan} color={section.color} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={task.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
