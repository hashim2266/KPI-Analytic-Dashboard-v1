import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { BarChart2, TrendingUp, CheckCircle2, Clock3, Activity, Search, ExternalLink, ShieldCheck, Plus, Check, BrainCircuit, Settings, BookOpen } from 'lucide-react';
import { sections as initialSections, Section, Task } from '../data/tasks'; 
import { SectionDonut } from '../components/SectionDonut';
import { DashboardSidebar } from '../components/DashboardSidebar';
import { CriticalTasks } from '../components/CriticalTasks';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ReportLibrary } from '../components/ReportLibrary';

const premiumTorchCard = "relative rounded-[24px] bg-[#05180d] border border-emerald-500/10 shadow-[0_16px_40px_0_rgba(0,0,0,0.85)] p-5 overflow-hidden transition-all duration-300 hover:border-emerald-400/30 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_45%)] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.05),transparent_40%)]";

const peakActivityData = [
  { name: '01 Jun', 'Sksn 1': 20, 'Sksn 2': 10 },
  { name: '05 Jun', 'Sksn 1': 85, 'Sksn 2': 40 },
  { name: '10 Jun', 'Sksn 1': 45, 'Sksn 2': 90 },
  { name: '15 Jun', 'Sksn 1': 30, 'Sksn 2': 15 },
  { name: '20 Jun', 'Sksn 1': 95, 'Sksn 2': 50 },
  { name: '25 Jun', 'Sksn 1': 60, 'Sksn 2': 100 },
  { name: '30 Jun', 'Sksn 1': 40, 'Sksn 2': 35 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  
  // 1. Load data from Local Storage first, fallback to initial data if empty
  const [appSections, setAppSections] = useState<Section[]>(() => {
    const savedData = localStorage.getItem('kpi_system_data');
    if (savedData) {
      try { return JSON.parse(savedData); } catch (e) { return initialSections; }
    }
    return initialSections;
  });

  // 2. Auto-save to Local Storage silently every time a new task is added
  useEffect(() => {
    localStorage.setItem('kpi_system_data', JSON.stringify(appSections));
  }, [appSections]);
  
  const [activeSectionInput, setActiveSectionInput] = useState<string | null>(null);
  const [newActivityText, setNewActivityText] = useState('');
  const [newActivityTarget, setNewActivityTarget] = useState(1);

  function dynamicAvg(sectionId: string): number {
    const sec = appSections.find(s => s.id === sectionId);
    if (!sec || !sec.tasks.length) return 0;
    return Math.round(sec.tasks.reduce((sum, t) => sum + t.peratusan, 0) / sec.tasks.length);
  }

  function getSectionInsight(sec: Section): { text: string; alert: boolean } {
    const avgScore = dynamicAvg(sec.id);
    const pendingCount = sec.tasks.filter(t => t.status === 'Belum Mula').length;
    if (avgScore >= 75) return { text: "PRESTASI OPTIMID: MENCAPAI SASARAN STRATEGIK", alert: false };
    if (pendingCount > 5) return { text: `RISIKO TERTUNGGAK: ${pendingCount} TUGASAN BELUM MULA`, alert: true };
    return { text: "EVALUASI SEDERHANA: DIPANTAU SECARA AKTIF", alert: false };
  }

  const handleAddTask = (sectionId: string) => {
    if (!newActivityText.trim()) return;
    setAppSections(prevSections => {
      return prevSections.map(sec => {
        if (sec.id !== sectionId) return sec;
        const nextId = sec.tasks.reduce((max, t) => t.id > max ? t.id : max, 0) + 1;
        const nextBil = sec.tasks.length + 1;
        const newTask: Task = {
          id: nextId, bil: nextBil, aktiviti: newActivityText, sasaran: newActivityTarget,
          unit: "Kes", type: "count", pencapaian: newActivityTarget, peratusan: 100, status: "Selesai"
        };
        return { ...sec, tasks: [...sec.tasks, newTask] };
      });
    });
    setNewActivityText('');
    setNewActivityTarget(1);
    setActiveSectionInput(null);
  };

  const filteredSections = appSections.filter((sec: Section) => {
    const matchSectionName = sec.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             sec.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTasks = sec.tasks.some(task => 
      task.aktiviti.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.status && task.status.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return matchSectionName || matchTasks;
  });

  const totalTasks = appSections.reduce((sum, s) => sum + s.tasks.length, 0);
  const totalDone = appSections.reduce((sum, s) => sum + s.tasks.filter(t => t.status === 'Selesai').length, 0);
  const totalInProg = appSections.reduce((sum, s) => sum + s.tasks.filter(t => t.status === 'Dalam Proses').length, 0);
  const totalPending = appSections.reduce((sum, s) => sum + s.tasks.filter(t => t.status === 'Belum Mula').length, 0);
  const overall = Math.round(appSections.reduce((sum, s) => sum + dynamicAvg(s.id), 0) / appSections.length);

  return (
    <div className="min-h-screen bg-[#020604] text-[#e2f1e8] font-sans selection:bg-emerald-500/30 antialiased">
      
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-emerald-500/10 bg-[#020604]/95 backdrop-blur-xl shadow-lg">
        <div className="max-w-[1800px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <BarChart2 className="size-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-[#f5f7f2] font-extrabold text-lg leading-tight tracking-wider uppercase">KPI ANALYTIC SYSTEM</h1>
              <p className="text-[10px] text-[#f5f7f2]/50 font-mono font-bold uppercase tracking-widest">PENTADBIRAN CORPORATE CENTER • REVISION 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 shadow-inner">
              <Activity className="size-3.5 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-extrabold text-[#f5f7f2]/70 tracking-widest uppercase">PURATA KPI REAL-TIME</span>
              <span className="text-xl font-light ml-1 text-[#f5f7f2]">{overall}%</span>
            </div>
            <button 
              onClick={() => alert('Mod Admin: Di sini anda boleh pautkan ke halaman tetapan khas.')} 
              className="p-2 rounded-xl hover:bg-emerald-500/10 text-[#f5f7f2]/30 hover:text-emerald-400 transition-colors"
              title="Tetapan Admin"
            >
              <Settings className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-6 py-5">
        <div className="grid grid-cols-4 gap-6 items-start">

          {/* ── LEFT SIDE COLUMN ── */}
          <div className="col-span-1 flex flex-col gap-5">
            
            {/* Sidebar Module */}
            <div className={`${premiumTorchCard} p-0`}>
              <div className="p-5 relative z-10">
                <DashboardSidebar />
              </div>
            </div>
            
            {/* Carian Deck & Pangkalan Arkib */}
            <div className={premiumTorchCard}>
              <div className="relative z-10 flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <h4 className="text-xs font-extrabold text-[#f5f7f2] tracking-wider uppercase">CARIAN PEKELILING & DASAR</h4>
                  </div>
                  <p className="text-[10px] text-[#f5f7f2]/60 uppercase font-extrabold tracking-wider">Integrasi MyPPSM Live Database Engine</p>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Cari seksyen, tugasan, status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#020a05]/95 border border-emerald-900/60 rounded-xl py-2 pl-3 pr-9 text-xs text-[#f5f7f2] placeholder-[#f5f7f2]/30 focus:outline-none focus:border-emerald-500/50 transition-colors font-medium"
                  />
                  <button className="absolute right-2.5 top-2.5 text-[#f5f7f2]/50 hover:text-[#f5f7f2] transition-colors">
                    <Search className="size-4" />
                  </button>
                </div>

                {/* Report Library Button */}
                <div className="mt-1">
                  <p className="text-[9px] font-extrabold text-[#f5f7f2]/50 uppercase tracking-widest mb-2">PANGKALAN ARKIB DOKUMEN</p>
                  <button 
                    onClick={() => setIsLibraryOpen(true)}
                    className="w-full py-3 rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-[10px] uppercase tracking-widest font-extrabold text-emerald-400 hover:bg-emerald-400 hover:text-black transition-all flex items-center justify-center gap-2 shadow-sm group"
                  >
                    <BookOpen className="size-4 group-hover:scale-110 transition-transform" /> BUKA REPORT LIBRARY
                  </button>
                </div>

                {/* HRMIS Portal Link */}
                <div className="pt-3 border-t border-emerald-950/80">
                  <a 
                    href="https://hrmis2.eghrmis.gov.my/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-emerald-950/40 to-black/40 border border-emerald-500/20 text-[#f5f7f2] hover:border-emerald-400/40 transition-all group shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="size-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-[11px] font-extrabold text-[#f5f7f2] leading-none uppercase tracking-widest">PORTAL HRMIS 2.0</p>
                        <p className="text-[9px] text-[#f5f7f2]/60 mt-1 uppercase font-extrabold tracking-wider">Sistem Pengurusan Sumber Manusia</p>
                      </div>
                    </div>
                    <ExternalLink className="size-3.5 text-[#f5f7f2]/60 group-hover:text-[#f5f7f2] transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT MAIN COLUMN ── */}
          <div className="col-span-3 flex flex-col gap-5">

            {/* ROW 1: 4 Section Donut Meters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-extrabold tracking-wider text-[#f5f7f2] uppercase">
                  STATUS INDEKS PENCAPAIAN SEMASA SEKSYEN (SKU)
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-5">
                {filteredSections.slice(0, 4).map((sec: Section) => {
                  const insight = getSectionInsight(sec);
                  return (
                    <div key={sec.id} className={`${premiumTorchCard} p-4 flex flex-col gap-3 justify-between h-full`}>
                      <div className="relative z-10 flex flex-col gap-3 h-full">
                        <SectionDonut section={sec} completion={dynamicAvg(sec.id)} />
                        
                        <div className="px-2 py-2 rounded-xl bg-[#031109] border border-emerald-500/20 text-center shadow-md">
                          <div className="flex items-center justify-center gap-1.5 text-[9px] font-extrabold tracking-wider">
                            <BrainCircuit className={`size-3 ${insight.alert ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                            <span className={insight.alert ? 'text-rose-400' : 'text-[#f5f7f2]'}>{insight.text}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setActiveSectionInput(activeSectionInput === sec.id ? null : sec.id)}
                          className="w-full mt-auto py-1.5 rounded-xl border border-emerald-900/40 bg-emerald-950/20 text-[10px] uppercase tracking-widest font-extrabold text-[#f5f7f2] hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-colors flex items-center justify-center gap-1 shadow-sm"
                        >
                          <Plus className="size-3" /> KEMASKINI SKU
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secure Input Workspace */}
              {activeSectionInput && (
                <div className={`${premiumTorchCard} p-5 mt-4`}>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-extrabold text-[#f5f7f2] uppercase tracking-widest">
                          KEMASKINI TUGASAN BAHARU: {appSections.find(s => s.id === activeSectionInput)?.fullName.toUpperCase()}
                        </h4>
                        <p className="text-[10px] text-[#f5f7f2]/60 font-extrabold uppercase tracking-widest">Log tindakan ini bersifat mandatori pengauditan (Penghapusan tidak dibenarkan)</p>
                      </div>
                      <button onClick={() => setActiveSectionInput(null)} className="text-[#f5f7f2]/60 hover:text-[#f5f7f2] text-xs font-mono font-bold">TUTUP ×</button>
                    </div>
                    
                    <div className="flex gap-3 items-end">
                      <div className="flex-1">
                        <label className="block text-[9px] text-[#f5f7f2]/60 font-extrabold uppercase tracking-widest mb-1">NAMA AKTIVITI / PENYERAHAN KONTRAK</label>
                        <input 
                          type="text"
                          placeholder="Contoh: Penyelarasan Kertas Kerja Fail Kemaskini Pentadbiran..."
                          value={newActivityText}
                          onChange={(e) => setNewActivityText(e.target.value)}
                          className="w-full bg-[#020a05] border border-emerald-900/60 rounded-xl py-2 px-3 text-xs text-[#f5f7f2] placeholder-[#f5f7f2]/30 focus:outline-none focus:border-emerald-500/40 font-medium"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-[9px] text-[#f5f7f2]/60 font-extrabold uppercase tracking-widest mb-1">SASARAN BIL.</label>
                        <input 
                          type="number"
                          min="1"
                          value={newActivityTarget}
                          onChange={(e) => setNewActivityTarget(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full bg-[#020a05] border border-emerald-900/60 rounded-xl py-2 px-3 text-xs text-[#f5f7f2] text-center focus:outline-none focus:border-emerald-500/40 font-mono font-bold"
                        />
                      </div>
                      <button 
                        onClick={() => handleAddTask(activeSectionInput)}
                        className="px-4 py-2 rounded-xl bg-emerald-400 text-black text-xs font-extrabold tracking-widest uppercase hover:bg-white hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all flex items-center gap-1.5 h-[38px]"
                      >
                        <Check className="size-3.5 stroke-[3]" /> SIMPAN LOG
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ROW 2: High-Peak Metric Chart */}
            <div className={premiumTorchCard}>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-extrabold text-[#f5f7f2] uppercase tracking-widest flex items-center gap-2">
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      ALIRAN PEMANTAUAN AKTIVITI BERJADUAL (PRESTASI TAHUNAN)
                    </h3>
                    <p className="text-[10px] text-[#f5f7f2]/60 uppercase font-extrabold tracking-widest">Analisis Unit Tugasan Selesai Mengikut Lonjakan Puncak Maksimum</p>
                  </div>
                </div>

                <div className="w-full h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={peakActivityData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <defs>
                        <linearGradient id="areaPeak1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="rgba(245, 247, 242, 0.3)" tick={{ fill: 'rgba(245, 247, 242, 0.6)', fontSize: 10, fontWeight: 'bold' }} />
                      <YAxis stroke="rgba(245, 247, 242, 0.3)" tick={{ fill: 'rgba(245, 247, 242, 0.6)', fontSize: 10, fontWeight: 'bold' }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ backgroundColor: '#020704', borderColor: 'rgba(16, 185, 129, 0.3)', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                      <Area type="linear" dataKey="Sksn 1" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#areaPeak1)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ROW 3: Core Operational Metrics Queue Grid */}
            <div className="grid grid-cols-3 gap-5">
              
              <div className="flex flex-col gap-4">
                {[
                  { label: 'JUMLAH TUGASAN KESELURUHAN', value: totalTasks, icon: <BarChart2 className="size-4" />, sub: 'TOTAL PORTFOLIO CROSS-SECTIONS TRACKED' },
                  { label: 'TUGASAN BERJAYA SELESAI', value: totalDone, icon: <CheckCircle2 className="size-4" />, sub: 'ABSOLUTE SUCCESS COMPLIANCE RATING' },
                  { label: 'SEDANG PROSES AKTIF', value: totalInProg, icon: <Clock3 className="size-4" />, sub: 'OPERATIONAL PIPELINES LIVE STREAMING' },
                ].map(card => (
                  <div key={card.label} className={`${premiumTorchCard} p-4 flex items-center gap-4 flex-1`}>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex-shrink-0 relative z-10">
                      {card.icon}
                    </div>
                    <div className="relative z-10">
                      <p className="text-[10px] font-extrabold text-[#f5f7f2]/60 uppercase tracking-widest mb-0.5">{card.label}</p>
                      <p className="text-4xl font-light tracking-tight leading-none font-mono text-[#f5f7f2]">{card.value}</p>
                      <p className="text-[9px] font-extrabold text-[#f5f7f2]/40 mt-1">{card.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-span-1">
                <CriticalTasks />
              </div>

              <div className={premiumTorchCard}>
                <div className="relative z-10 flex flex-col justify-between h-full min-h-[240px]">
                  <div>
                    <h3 className="font-extrabold text-[10px] mb-3 flex items-center gap-2 text-[#f5f7f2] uppercase tracking-widest">
                      <TrendingUp className="size-3.5 text-emerald-400" /> MATRIKS KECEKAPAN SKU
                    </h3>
                    
                    <div className="space-y-2.5">
                      {[
                        { label: 'Tugasan Belum Mula', value: totalPending, style: 'text-rose-400/90 font-bold font-mono' },
                        { label: 'Kadar Pematuhan Tahunan', value: `${overall}%`, style: 'text-[#f5f7f2] font-bold font-mono' },
                        { label: 'Status Pangkalan Data', value: 'SINKRONI', style: 'text-[#f5f7f2] text-xs font-extrabold font-mono tracking-widest' },
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between border-b border-emerald-950/30 pb-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#f5f7f2]/60">{item.label}</span>
                          <span className={`text-sm ${item.style}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-emerald-800/20">
                    <p className="text-[9px] font-extrabold text-[#f5f7f2]/50 uppercase tracking-widest mb-1.5">KUMULATIF PORTFOLIO PEMANTAUAN</p>
                    <div className="w-full rounded-full h-2.5 bg-emerald-950/80 overflow-hidden border border-emerald-900/40 p-0.5">
                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-800 via-emerald-400 to-white" 
                           style={{ width: `${overall}%` }} />
                    </div>
                    <div className="flex justify-between items-center mt-1.5 text-[9px] font-mono font-bold tracking-tight text-[#f5f7f2]">
                      <span>AGREGAT SISTEM</span>
                      <span>{overall}% DONE</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
      
      {/* Report Library Portal Trigger Container */}
      <ReportLibrary isOpen={isLibraryOpen} onOpenChange={setIsLibraryOpen} />
    </div>
  );
}